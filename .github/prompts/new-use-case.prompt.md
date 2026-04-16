---
name: new-use-case
description: "Cria um use case com o mínimo funcional seguindo Clean Architecture. Gera o use case, DTOs de entrada/saída e atualiza o port do repositório se necessário."
argument-hint: "Descrição do use case (ex: create-user, find-user-by-id, delete-product)"
agent: "agent"
---

Crie um novo use case chamado **$input** seguindo a arquitetura do projeto definida em [copilot-instructions.md](../copilot-instructions.md).

## O que gerar

```
src/<module>/application/
├── use-cases/
│   └── $input.use-case.ts
└── dto/
    ├── $input-request.dto.ts   (se ainda não existir um DTO adequado)
    └── $input-response.dto.ts  (se ainda não existir um DTO adequado)
```

Infira o `<module>` a partir do nome do use case (ex: `create-user` → módulo `user`).

Se o DTO de request ou response já existir no módulo, reutilize-o em vez de criar um novo.

## Regras obrigatórias

- **Arquivo**: `kebab-case` com sufixo `.use-case.ts` (ex: `create-user.use-case.ts`)
- **Classe**: `PascalCase` com sufixo `UseCase` (ex: `CreateUserUseCase`)
- **Método principal**: `execute(dto: <Input>Dto): Promise<<Output>Dto>`
- **Dependências**: injetadas via construtor usando os ports (`I<Module>Repository`), todas com `private readonly`
- **Sem lógica de infra**: o use case nunca importa repositórios concretos, ORM entities ou mappers
- **Early return**: use retorno antecipado para casos de erro antes do fluxo principal
- **Exceções**: lance `NotFoundException`, `BadRequestException` ou erro de domínio apropriado — nunca retorne `null` silenciosamente
- **Código limpo**: siga os princípios da skill [new-feature](../skills/new-feature/SKILL.md) — async/await, sem `any`, nomes claros

## Estrutura mínima do use case

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class ${UseCase}UseCase {
  constructor(private readonly ${module}Repository: I${Module}Repository) {}

  async execute(dto: ${UseCase}RequestDto): Promise<${UseCase}ResponseDto> {
    // 1. Validações / buscas (early return em erro)
    // 2. Lógica de domínio
    // 3. Persistência
    // 4. Retorno do DTO de resposta
  }
}
```

## Verificações antes de criar

- [ ] O port `I<Module>Repository` já existe em `src/<module>/application/ports/`? Se não, adicione o método necessário a ele (ou crie o port se for o primeiro use case do módulo).
- [ ] Existe DTO de request adequado? Reutilize ou crie um mínimo com os campos necessários.
- [ ] Existe DTO de response adequado? Reutilize ou crie um mínimo.
- [ ] A operação escreve em **mais de uma tabela**? Se sim, injete `ITransactionManager` e envolva toda a escrita em `transactionManager.run(manager => { ... })`. Repositórios devem expor métodos `*WithManager(entity, manager)`. Veja `.github/instructions/transactions.instructions.md` para o padrão completo.

## Registrar no módulo NestJS

Após criar o use case, localize o arquivo `<module>.module.ts` correspondente (ex: `src/user/user.module.ts`) e registre o use case em `providers`:

```typescript
@Module({
  providers: [
    // ... providers existentes
    CreateUserUseCase,
  ],
  // ...
})
export class UserModule {}
```

Se o módulo ainda não existir, crie-o com o mínimo:

```typescript
import { Module } from '@nestjs/common';

@Module({
  providers: [${UseCase}UseCase],
  exports: [${UseCase}UseCase],
})
export class ${Module}Module {}
```

E registre o novo módulo em `app.module.ts` nos `imports`.

## Após gerar

Acione a skill `/code-review-fix` para validar que não há erros de compilação ou lint.
