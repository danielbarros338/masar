# Diretrizes do Projeto — Masar

Projeto NestJS com **Clean Architecture**, **DDD** e **SOLID**.

## Arquitetura

Todos os módulos de domínio ficam em `src/modules/`. Cada módulo é auto-contido e inclui a camada de API (controllers) internamente — não existe uma pasta `api/` global separada.

```
src/
├── modules/
│   └── <module>/
│       ├── application/
│       │   ├── use-cases/          # Casos de uso (orquestração de domínio)
│       │   ├── dto/                # Data Transfer Objects de entrada/saída
│       │   └── ports/              # Interfaces/contratos (ex: IUserRepository)
│       ├── domain/
│       │   ├── entities/           # Entidades de domínio
│       │   ├── props/              # Tipos de propriedades das entidades
│       │   └── value-objects/      # Value Objects imutáveis
│       ├── infra/
│       │   ├── mapper/             # Conversão entre domain entity ↔ orm-entity
│       │   ├── orm-entities/       # Entidades do ORM (TypeORM, Prisma, etc.)
│       │   ├── repositories/       # Implementações concretas dos ports
│       │   └── interfaces/         # Interfaces de infra (ex: IDatabase)
│       └── api/
│           └── controllers/        # Controllers NestJS (HTTP layer)
└── common/
    ├── common.module.ts            # Módulo NestJS que provê e exporta todos os providers comuns
    ├── ports/                      # Ports compartilhados entre módulos (ex: ITransactionManager)
    ├── types/                      # Types TypeScript compartilhados (ex: jwt.types.ts)
    └── utils/                      # Providers utilitários reutilizáveis (ex: Pbkdf2Util)
```

**Regra de dependência:** `api → application → domain`. A camada `infra` implementa ports definidos em `application`. Nunca importe camadas internas em camadas externas invertendo esse fluxo.

## Convenções de Nomenclatura

| Elemento | Convenção | Exemplo |
|---|---|---|
| Arquivos e pastas | `kebab-case` | `create-user.use-case.ts`, `user-props.ts` |
| Classes | `PascalCase` | `CreateUserUseCase`, `UserEntity` |
| Interfaces e Ports | `PascalCase` prefixado com `I` | `IUserRepository`, `IHashProvider` |
| DTOs | `PascalCase` com sufixo `Dto` | `CreateUserDto`, `UserResponseDto` |
| Entidades de domínio | `PascalCase` com sufixo `Entity` | `UserEntity` |
| Value Objects | `PascalCase` com sufixo `Vo` | `EmailVo`, `PasswordVo` |
| Mappers | `PascalCase` com sufixo `Mapper` | `UserMapper` |
| ORM Entities | `PascalCase` com sufixo `OrmEntity` | `UserOrmEntity` |
| Utils / Providers comuns | `PascalCase` com sufixo `Util` | `Pbkdf2Util`, `DateFormatterUtil` |
| Arquivos de types | `kebab-case` com sufixo `.types.ts` | `jwt.types.ts`, `pagination.types.ts` |

**Todo arquivo deve declarar sua função no nome.** Exemplos:
- `user.repository.ts` — implementação do repositório
- `user.mapper.ts` — mapper
- `create-user.use-case.ts` — caso de uso
- `user.entity.ts` — entidade de domínio
- `email.vo.ts` — value object
- `user.controller.ts` — controller

## Build e Testes

```bash
yarn install          # instalar dependências
yarn start:dev        # servidor em modo watch
yarn build            # compilar para dist/
yarn test             # testes unitários (Jest)
yarn test:cov         # cobertura de testes
yarn test:e2e         # testes e2e
yarn lint             # ESLint + Prettier fix
```

## Padrões de Implementação

- **Use Cases** devem ser classes com método `execute()` e receber dependências via injeção de construtor usando os ports (interfaces).
- **Entidades** encapsulam regras de negócio; props são tipadas com o tipo `<NomeEntity>Props`.
- **Value Objects** são imutáveis; expõem `.value` e validam no construtor.
- **Mappers** são classes estáticas ou com métodos `toDomain()` e `toPersistence()`.
- **Ports** ficam em `application/ports/` e são implementados em `infra/repositories/`.
- **Ports devem ser classes abstratas** com métodos abstratos (não `interface` TypeScript). Isso permite que o NestJS resolva a injeção de dependência pelo token da classe sem necessidade do decorator `@Inject()`. Exemplo:

```typescript
export abstract class IUserRepository {
  abstract findById(id: number): Promise<UserEntity | null>;
  abstract create(user: UserEntity): Promise<UserEntity>;
}
```

- **Controllers** delegam para use cases — sem lógica de negócio.
- **Providers comuns (`src/common/`)** — Qualquer helper ou serviço utilitário que será consumido por módulos deve ser uma classe `@Injectable()` em `src/common/utils/`, registrada como provider e exportada pelo `CommonModule`. Nunca importe diretamente com `new` dentro de use cases ou controllers. O `CommonModule` deve ser importado no `AppModule` e nos módulos que precisarem dos providers. Utils puramente estáticas (sem config/env e sem injeção) podem ser importadas diretamente sem registro no módulo.
- **Types compartilhados (`src/common/types/`)** — Types TypeScript reutilizáveis entre módulos devem ficar em arquivos dedicados dentro de `src/common/types/`, nomeados como `<domínio>.types.ts` (ex: `jwt.types.ts`). **Nunca declare `type` ou `interface` dentro de arquivos de classe, util, controller ou use case** — extraia para o arquivo de types correspondente. Arquivos de types são independentes: não contêm lógica, não importam providers NestJS e podem ser importados de qualquer camada sem quebrar a regra de dependência.
- **Transações obrigatórias** — Toda operação que persiste, atualiza ou deleta dados em **mais de uma tabela** deve ser executada dentro de uma transação TypeORM. Use o port `ITransactionManager` (em `src/common/ports/`) com o método `run(manager => {...})`. Repositórios devem expor métodos `*WithManager(entity, manager)` para aceitar o `EntityManager` transacional. A implementação do `ITransactionManager` usa **QueryRunner explícito** com begin/commit/rollback/release — nunca use `dataSource.transaction()` pois não garante rollback em todos os cenários. Nunca injete `DataSource` ou use `QueryRunner` diretamente no use case. Veja `.github/instructions/transactions.instructions.md` para o padrão completo.

## DDD

- Cada módulo representa um **Bounded Context**.
- Entidades possuem identidade (`id`); Value Objects não.
- Eventos de domínio (quando necessários) ficam em `domain/events/`.
- Agregados definem raiz de consistência — evite referências cruzadas diretas entre agregados; use IDs.
