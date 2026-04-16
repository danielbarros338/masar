---
name: new-module
description: "Cria a estrutura mínima de um módulo seguindo Clean Architecture + DDD. Gera entidade, value objects essenciais, port do repositório, use case inicial, mapper, ORM entity e controller."
argument-hint: "Nome do módulo em singular (ex: user, product, order)"
agent: "agent"
---

Crie um novo módulo chamado **$input** seguindo a arquitetura do projeto definida em [copilot-instructions.md](../copilot-instructions.md).

## O que gerar

Gere **apenas** os arquivos abaixo, com o mínimo necessário para o módulo funcionar. Não adicione lógica além do essencial.

```
src/modules/$input/
├── api/
│   └── controllers/
│       └── $input.controller.ts
├── application/
│   ├── use-cases/
│   │   └── create-$input.use-case.ts
│   ├── dto/
│   │   ├── create-$input.dto.ts
│   │   └── $input-response.dto.ts
│   └── ports/
│       └── i-$input.repository.ts
├── domain/
│   ├── entities/
│   │   └── $input.entity.ts
│   └── props/
│       └── $input.props.ts
├── infra/
│   ├── mapper/
│   │   └── $input.mapper.ts
│   ├── orm-entities/
│   │   └── $input.orm-entity.ts
│   └── repositories/
│       └── $input.repository.ts
└── $input.module.ts
```

## Regras obrigatórias

- **Nomenclatura**: todos os arquivos em `kebab-case`; classes em `PascalCase`; interfaces prefixadas com `I`
- **Sufixos**: `Entity`, `Vo`, `Dto`, `Mapper`, `OrmEntity`, `UseCase` (sem espaço), `Repository`
- **Regra de dependência**: `api → application → domain`; `infra` implementa ports de `application`; nunca inverta
- **Props**: crie o tipo `${Input}Props` em `$input.props.ts` e use-o na entidade
- **Use Case**: classe com método `execute()`, dependências via construtor usando o port `I${Input}Repository`
- **Mapper**: métodos estáticos `toDomain()` e `toPersistence()`
- **Controller**: delega para o use case, sem lógica de negócio; use decorators NestJS (`@Controller`, `@Post`, `@Body`, `@HttpCode`)
- **Código limpo**: siga os princípios da skill [new-feature](../skills/new-feature/SKILL.md) — nomes claros, early return, async/await, sem `any`
- **Module**: crie o arquivo `$input.module.ts` **dentro da pasta `src/modules/$input/`**, declarando controllers, providers e imports do módulo; após criá-lo, registre-o no array `imports` de `src/app.module.ts`

## Conteúdo mínimo de cada arquivo

### `$input.props.ts`
Tipo com os campos essenciais da entidade (pelo menos `id: string` e `createdAt: Date`). Pergunte ao usuário se precisar de campos adicionais, ou infira pelo nome do módulo.

### `$input.entity.ts`
Classe com construtor recebendo `${Input}Props`, expondo props via getters. Sem lógica de negócio ainda.

### `i-$input.repository.ts`
Interface com ao menos `findById(id: string): Promise<${Input}Entity | null>` e `save(entity: ${Input}Entity): Promise<void>`.

### `create-$input.use-case.ts`
Recebe `Create${Input}Dto`, cria a entidade, persiste via repositório, retorna `${Input}ResponseDto`.

### `$input.mapper.ts`
Converte entre `${Input}Entity` ↔ `${Input}OrmEntity`.

### `$input.orm-entity.ts`
Classe com os mesmos campos de `${Input}Props`, pronta para ser anotada com o ORM do projeto (deixe um comentário `// TODO: adicionar decorators do ORM` se o ORM ainda não estiver definido).

### `$input.repository.ts`
Implementa `I${Input}Repository`. Deixe os métodos com `throw new Error('Not implemented')` se o ORM ainda não estiver configurado.

### `$input.controller.ts`
Endpoint `POST /$input` que chama `Create${Input}UseCase.execute()`. Fica em `src/modules/$input/api/controllers/`.

### `$input.module.ts`
NestJS `@Module` que declara o controller, registra o use case como provider e vincula o port `I${Input}Repository` à sua implementação concreta. **Fica na raiz do módulo** (`src/modules/$input/$input.module.ts`). Após criar o arquivo, adicione `${Input}Module` ao array `imports` em `src/app.module.ts`.

## Após gerar

Acione a skill `/code-review-fix` para validar que não há erros de compilação ou lint.
