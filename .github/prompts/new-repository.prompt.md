---
description: "Cria um repositório (port + implementação) seguindo as convenções do projeto Masar (NestJS + Clean Architecture). Use quando quiser gerar o port abstrato em application/ports/ e a implementação concreta em infra/repositories/."
name: "New Repository"
argument-hint: "Ex: User (módulo: user) | Ex: FinancialOperation (módulo: financial-operation)"
agent: "agent"
---

Crie o port abstrato e a implementação concreta do repositório para o módulo informado, seguindo **estritamente** as convenções do projeto descritas em [copilot-instructions.md](../copilot-instructions.md).

## Entrada esperada

O usuário deve informar (pelo argumento ou na mensagem):
- **Nome base** da entidade (ex: `User`, `FinancialOperation`)
- **Módulo** ao qual pertence (ex: `user`, `financial-operation`)
- **Métodos** necessários (ex: `findById`, `findAll`, `create`, `update`, `delete`)
- **ORM** utilizado (ex: TypeORM, Prisma) — se não informado, assuma TypeORM

Se alguma informação estiver faltando, pergunte antes de implementar.

## Regras obrigatórias

### Port (classe abstrata)
- Arquivo: `src/<módulo>/application/ports/i-<entidade>.repository.ts`
- Classe: `I<Entidade>Repository` — **deve ser `abstract class`**, não `interface`
- Métodos devem ser `abstract`
- Isso permite injeção de dependência pelo NestJS sem `@Inject()`

### Implementação
- Arquivo: `src/<módulo>/infra/repositories/<entidade>.repository.ts`
- Classe: `<Entidade>Repository` estende `I<Entidade>Repository`
- Usa o ORM informado para implementar cada método
- Recebe dependências via construtor com `@InjectRepository()` (TypeORM) ou equivalente

## Exemplo de port

```typescript
// src/user/application/ports/i-user.repository.ts
import { UserEntity } from '../../domain/entities/user.entity';

export abstract class IUserRepository {
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract findAll(): Promise<UserEntity[]>;
  abstract create(user: UserEntity): Promise<UserEntity>;
  abstract update(user: UserEntity): Promise<UserEntity>;
  abstract delete(id: number): Promise<void>;
}
```

## Exemplo de implementação (TypeORM)

```typescript
// src/user/infra/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  async findById(id: number): Promise<UserEntity | null> {
    const orm = await this.repo.findOneBy({ id });
    return orm ? UserMapper.toDomain(orm) : null;
  }

  async findAll(): Promise<UserEntity[]> {
    const orms = await this.repo.find();
    return orms.map(UserMapper.toDomain);
  }

  async create(user: UserEntity): Promise<UserEntity> {
    const orm = this.repo.create(UserMapper.toPersistence(user));
    const saved = await this.repo.save(orm);
    return UserMapper.toDomain(saved);
  }

  async update(user: UserEntity): Promise<UserEntity> {
    const orm = UserMapper.toPersistence(user);
    const saved = await this.repo.save(orm);
    return UserMapper.toDomain(saved);
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
```

## Após criar os arquivos

- Confirme os caminhos gerados (port e implementação)
- Liste os métodos implementados
- Lembre que o `<Entidade>Repository` deve ser registrado como provider no módulo NestJS, com `provide: I<Entidade>Repository`
- Se o módulo envolver operações que escrevem em **mais de uma tabela**, adicione variantes `*WithManager(entity, manager: EntityManager)` nos métodos de escrita do port e da implementação. Isso permite que use cases orquestrem a transação via `ITransactionManager`. Veja `.github/instructions/transactions.instructions.md` para o padrão completo.
