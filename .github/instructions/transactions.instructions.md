---
description: "Use when: criando use cases que persistem, atualizam ou deletam dados em mais de uma tabela; implementando repositórios com operações que afetam múltiplos registros; garantindo atomicidade em operações compostas como cadastro de usuário + senha. Cobre o padrão de ITransactionManager com TypeORM QueryRunner."
applyTo: ["src/**/use-cases/*.use-case.ts", "src/**/repositories/*.repository.ts", "src/**/ports/*.ts"]
---

# Transações de Banco de Dados

## Regra fundamental

> **Toda operação que persiste, atualiza ou deleta dados em mais de uma tabela deve ser executada dentro de uma transação.** Se qualquer etapa falhar, todas as alterações devem ser revertidas (rollback). O commit só ocorre após a conclusão bem-sucedida de todas as etapas.

Exemplos de operações que **exigem** transação:
- Criar usuário + criar senha em tabelas separadas
- Criar pedido + criar itens do pedido
- Transferir saldo entre duas contas
- Deletar entidade pai + entidades filhas

---

## Padrão: Port `ITransactionManager`

Para manter o use case desacoplado do TypeORM, defina um port abstrato em `src/common/ports/`:

```typescript
// src/common/ports/i-transaction-manager.ts
import { EntityManager } from 'typeorm';

export abstract class ITransactionManager {
  abstract run<T>(work: (manager: EntityManager) => Promise<T>): Promise<T>;
}
```

### Implementação com TypeORM

A implementação usa **QueryRunner explícito** para ter controle preciso do ciclo begin/commit/rollback. Isso garante que qualquer erro dentro do `run()` acione o rollback antes de propagar a exceção.

```typescript
// src/common/infra/typeorm-transaction-manager.ts
import { Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import { ITransactionManager } from '../ports/i-transaction-manager';

@Injectable()
export class TypeOrmTransactionManager extends ITransactionManager {
  constructor(private readonly dataSource: DataSource) {
    super();
  }

  async run<T>(work: (manager: EntityManager) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await work(queryRunner.manager);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
```

> **Por que QueryRunner e não `dataSource.transaction()`?** O `dataSource.transaction()` delega o controle do rollback ao TypeORM internamente e pode não reverter operações em certos cenários de falha silenciosa. Com QueryRunner, o fluxo begin → commit/rollback → release é explícito e auditável.

### Registro no módulo

```typescript
@Module({
  providers: [
    {
      provide: ITransactionManager,
      useClass: TypeOrmTransactionManager,
    },
  ],
  exports: [ITransactionManager],
})
export class CommonModule {}
```

---

## Uso no Use Case

O use case injeta o `ITransactionManager` e executa toda a operação composta dentro do `run()`:

```typescript
// src/user/application/use-cases/create-user.use-case.ts
import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { ITransactionManager } from '../../../common/ports/i-transaction-manager';
import { IUserRepository } from '../ports/i-user.repository';
import { IUserPasswordRepository } from '../ports/i-user-password.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserPasswordEntity } from '../../domain/entities/user-password.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userPasswordRepository: IUserPasswordRepository,
    private readonly transactionManager: ITransactionManager,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    return this.transactionManager.run(async (manager) => {
      const user = UserEntity.create({ name: dto.name, email: dto.email });
      const savedUser = await this.userRepository.createWithManager(user, manager);

      const password = UserPasswordEntity.create({
        userId: savedUser.id,
        hash: dto.password, // já deve vir hasheada ou ser hasheada aqui
      });
      await this.userPasswordRepository.createWithManager(password, manager);

      return UserResponseDto.fromEntity(savedUser);
    });
  }
}
```

---

## Adaptando Repositórios para Aceitar `EntityManager`

Os métodos transacionais dos repositórios devem aceitar um `EntityManager` opcional. Quando fornecido, usam-no em vez do repositório padrão:

```typescript
// src/user/application/ports/i-user.repository.ts
import { EntityManager } from 'typeorm';
import { UserEntity } from '../../domain/entities/user.entity';

export abstract class IUserRepository {
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract createWithManager(user: UserEntity, manager: EntityManager): Promise<UserEntity>;
}
```

```typescript
// src/user/infra/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { IUserRepository } from '../../application/ports/i-user.repository';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';
import { UserMapper } from '../mapper/user.mapper';

@Injectable()
export class UserRepository extends IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {
    super();
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return this.createWithManager(user, this.repo.manager);
  }

  async createWithManager(user: UserEntity, manager: EntityManager): Promise<UserEntity> {
    const orm = manager.create(UserOrmEntity, UserMapper.toPersistence(user));
    const saved = await manager.save(orm);
    return UserMapper.toDomain(saved);
  }
}
```

---

## Checklist antes de implementar operações de escrita

- [ ] A operação escreve em **mais de uma tabela**? → Use `ITransactionManager.run()`
- [ ] O port do repositório expõe método `*WithManager(entity, manager)`?
- [ ] O `ITransactionManager` está registrado no módulo compartilhado (`CommonModule`) e importado no módulo do use case?
- [ ] A implementação do `ITransactionManager` usa **QueryRunner explícito** com begin/commit/rollback/release?
- [ ] Em caso de erro dentro do `run()`, o QueryRunner faz rollback e re-lança o erro — **não** chame `rollback` no use case.
- [ ] O erro original é re-lançado dentro do `run()` para que chegue ao filtro de exceções global.

---

## O que NÃO fazer

```typescript
// ❌ Sem transação — se o segundo save falhar, o usuário fica órfão no banco
const user = await this.userRepository.create(userEntity);
const password = await this.userPasswordRepository.create(passwordEntity);

// ❌ Usar dataSource.transaction() — não garante rollback em todos os cenários de falha
return this.dataSource.transaction(async (manager) => { ... });

// ❌ Gerenciar QueryRunner manualmente no USE CASE — acopla à infraestrutura
const queryRunner = this.dataSource.createQueryRunner();
await queryRunner.connect();
await queryRunner.startTransaction();

// ❌ Injetar DataSource diretamente no use case — viola Clean Architecture
constructor(private readonly dataSource: DataSource) {}
```
