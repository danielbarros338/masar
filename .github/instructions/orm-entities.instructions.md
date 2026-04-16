---
description: "Use when: criando uma nova ORM entity TypeORM; adicionando uma tabela ao banco; implementando infra/orm-entities em qualquer módulo. Garante que toda ORM entity seja registrada no typeorm.config.ts e no módulo NestJS correspondente."
applyTo: ["src/**/orm-entities/*.orm-entity.ts", "src/config/typeorm.config.ts"]
---

# Registro de ORM Entities

## Regra fundamental

> **Toda classe decorada com `@Entity()` deve ser registrada em dois lugares: no array `entities` de `src/config/typeorm.config.ts` e no `TypeOrmModule.forFeature()` do módulo NestJS que a utiliza.** Uma ORM entity não registrada em `typeorm.config.ts` não é reconhecida pela conexão principal e causa erros de runtime.

---

## 1. Registro global — `src/config/typeorm.config.ts`

Adicione o import e inclua a classe no array `entities`:

```typescript
// src/config/typeorm.config.ts
import { UserOrmEntity } from '../modules/user/infra/orm-entities/user.orm-entity';
import { OrderOrmEntity } from '../modules/order/infra/orm-entities/order.orm-entity'; // ← nova entity

const entities = [
  UserOrmEntity,
  OrderOrmEntity, // ← adicionar aqui
];
```

Mantenha o array legível: uma entity por linha, agrupadas por módulo, em ordem alfabética de módulo.

## 2. Registro local — `*.module.ts` do módulo

Registre a entity no `TypeOrmModule.forFeature()` do módulo NestJS correspondente para que o repositório possa ser injetado via `@InjectRepository()`:

```typescript
// src/modules/order/order.module.ts
@Module({
  imports: [TypeOrmModule.forFeature([OrderOrmEntity])],
  // ...
})
export class OrderModule {}
```

---

## Checklist ao criar uma ORM entity

- [ ] Classe criada em `src/modules/<módulo>/infra/orm-entities/<nome>.orm-entity.ts`
- [ ] Nome segue o padrão `PascalCase` com sufixo `OrmEntity` (ex: `OrderItemOrmEntity`)
- [ ] Importada e adicionada ao array `entities` em `src/config/typeorm.config.ts`
- [ ] Adicionada ao `TypeOrmModule.forFeature([...])` no módulo correspondente

---

## O que NÃO fazer

- Não confie apenas no `TypeOrmModule.forFeature()` — sem o registro em `typeorm.config.ts` a tabela não é reconhecida pela conexão
- Não use `synchronize: true` em produção — prefira migrations explícitas
- Não importe `DataSource` ou `EntityManager` diretamente em use cases — use repositórios e o port `ITransactionManager`
