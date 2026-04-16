---
description: "Cria um mapper seguindo as convenções do projeto Masar (NestJS + Clean Architecture). Use quando quiser gerar a conversão entre entidade de domínio e ORM entity com métodos toDomain() e toPersistence()."
name: "New Mapper"
argument-hint: "Ex: User (módulo: user) | Ex: FinancialOperation (módulo: financial-operation)"
agent: "agent"
---

Crie o mapper para o módulo informado, seguindo **estritamente** as convenções do projeto descritas em [copilot-instructions.md](../copilot-instructions.md).

## Entrada esperada

O usuário deve informar (pelo argumento ou na mensagem):
- **Nome base** da entidade (ex: `User`, `FinancialOperation`)
- **Módulo** ao qual pertence (ex: `user`, `financial-operation`)
- **Campos** da entidade de domínio e da ORM entity (nome e tipo de cada campo)

Se os arquivos da entidade de domínio e da ORM entity já existirem no projeto, leia-os antes de implementar para garantir fidelidade aos campos reais.

Se alguma informação estiver faltando, pergunte antes de implementar.

## Regras obrigatórias

- Arquivo: `src/<módulo>/infra/mapper/<entidade>.mapper.ts`
- Classe: `<Entidade>Mapper` em `PascalCase` com sufixo `Mapper`
- Métodos estáticos: `toDomain(orm: <Entidade>OrmEntity): <Entidade>Entity` e `toPersistence(entity: <Entidade>Entity): <Entidade>OrmEntity` (ou `Partial<>` quando necessário)
- O mapper não deve conter lógica de negócio — apenas conversão de estrutura
- Importe somente da camada correta: ORM entity de `infra/orm-entities/`, entidade de domínio de `domain/entities/`

## Exemplo

```typescript
// src/user/infra/mapper/user.mapper.ts
import { UserEntity } from '../../domain/entities/user.entity';
import { UserOrmEntity } from '../orm-entities/user.orm-entity';

export class UserMapper {
  static toDomain(orm: UserOrmEntity): UserEntity {
    return new UserEntity({
      id: orm.id,
      name: orm.name,
      email: orm.email,
      passwordHash: orm.passwordHash,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  static toPersistence(entity: UserEntity): Partial<UserOrmEntity> {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      passwordHash: entity.passwordHash,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
```

## Após criar o arquivo

- Confirme o caminho gerado
- Liste os campos mapeados em cada direção
- Aponte se algum campo precisar de transformação especial (ex: enum, Value Object, relacionamentos)
