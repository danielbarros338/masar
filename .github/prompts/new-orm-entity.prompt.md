---
name: new-orm-entity
description: "Implementa uma ORM entity TypeORM, registra no typeorm.config.ts e no módulo NestJS correspondente, e corrige todos os erros de código e lint. Use quando precisar adicionar uma nova tabela a um módulo existente."
argument-hint: "Nome da entidade em PascalCase e módulo (ex: OrderItem — módulo: order | ex: RefreshToken — módulo: auth)"
agent: "agent"
---

Implemente a ORM entity **$input** seguindo as convenções do projeto descritas em [copilot-instructions.md](../copilot-instructions.md) e em [orm-entities.instructions.md](../instructions/orm-entities.instructions.md).

## Entrada esperada

O usuário deve informar (pelo argumento ou na mensagem):

- **Nome base** da entidade em PascalCase (ex: `OrderItem`, `RefreshToken`)
- **Módulo** ao qual pertence (ex: `order`, `auth`)
- **Campos** da tabela — nome, tipo TypeScript e qualquer restrição relevante (nullable, unique, length, default)

Se alguma informação estiver faltando, **pergunte antes de implementar**.

---

## O que gerar / atualizar

### 1. Criar a ORM entity

**Arquivo:** `src/modules/<módulo>/infra/orm-entities/<nome-kebab>.orm-entity.ts`

**Regras:**

- Nome da classe: `<Nome>OrmEntity` (ex: `OrderItemOrmEntity`)
- Decorator `@Entity('<tabela-plural-snake_case>')` — infira o nome da tabela a partir do nome da entidade (ex: `OrderItem` → `order_items`)
- Use `@PrimaryColumn({ type: 'varchar', length: 36 })` para `id: string`
- Use `@Column({ type: '<tipo>' })` para campos escalares; infira o tipo MySQL a partir do tipo TypeScript:
  - `string` → `varchar` (default length `255`) ou `text` se explicitamente longo
  - `number` sem casas → `int`
  - `number` com casas decimais → `decimal`
  - `boolean` → `boolean`
  - `Date` → `date` ou `datetime` — pergunte ao usuário se não estiver claro
  - `enum` → `enum` com a lista de valores
- Adicione `name: 'snake_case'` no decorator quando o nome do campo TypeScript for camelCase (ex: `chatId` → `name: 'chat_id'`)
- Sempre inclua ao final:
  ```typescript
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
  ```
- **Todas as propriedades devem ter `!` (definite assignment assertion):** `id!: string`, `name!: string`, etc.
- Sem construtores, sem métodos, sem lógica — apenas decorators e propriedades

**Exemplo completo:**

```typescript
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('order_items')
export class OrderItemOrmEntity {
  @PrimaryColumn({ type: 'varchar', length: 36 })
  id!: string;

  @Column({ type: 'varchar', length: 36, name: 'order_id' })
  orderId!: string;

  @Column({ type: 'varchar', length: 255 })
  description!: string;

  @Column({ type: 'decimal' })
  price!: number;

  @Column({ type: 'int' })
  quantity!: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt!: Date | null;
}
```

---

### 2. Registrar em `src/config/typeorm.config.ts`

- Adicione o import da nova ORM entity
- Inclua a classe no array `entities`
- Mantenha uma entry por linha, agrupadas por módulo e em ordem alfabética de módulo

```typescript
// Antes
import { UserOrmEntity } from '../modules/user/infra/orm-entities/user.orm-entity';

const entities = [
  UserOrmEntity,
];

// Depois
import { OrderItemOrmEntity } from '../modules/order/infra/orm-entities/order-item.orm-entity';
import { UserOrmEntity } from '../modules/user/infra/orm-entities/user.orm-entity';

const entities = [
  OrderItemOrmEntity, // ← nova
  UserOrmEntity,
];
```

---

### 3. Registrar no módulo NestJS correspondente

Localize o arquivo `src/modules/<módulo>/<módulo>.module.ts` e adicione a ORM entity ao `TypeOrmModule.forFeature([...])`:

```typescript
@Module({
  imports: [TypeOrmModule.forFeature([
    // ... entities existentes
    OrderItemOrmEntity, // ← nova
  ])],
  // ...
})
export class OrderModule {}
```

Se o módulo não importar `TypeOrmModule` ainda, adicione o import.

---

## Checklist antes de finalizar

- [ ] Arquivo criado em `src/modules/<módulo>/infra/orm-entities/<nome-kebab>.orm-entity.ts`
- [ ] Nome da classe segue o padrão `PascalCase` + sufixo `OrmEntity`
- [ ] Todas as propriedades têm `!` (definite assignment assertion)
- [ ] `id` usa `@PrimaryColumn({ type: 'varchar', length: 36 })`
- [ ] Campos camelCase têm `name: 'snake_case'` no decorator
- [ ] Campos `createdAt`, `updatedAt` e `deletedAt` incluídos com os decorators corretos
- [ ] Importada e adicionada ao array `entities` em `src/config/typeorm.config.ts`
- [ ] Adicionada ao `TypeOrmModule.forFeature([...])` no módulo correspondente

---

## Revisão de código e lint

Após criar e registrar a ORM entity, execute a skill [code-review-fix](../skills/code-review-fix/SKILL.md) para corrigir iterativamente todos os erros de TypeScript e lint até o projeto compilar sem erros.
