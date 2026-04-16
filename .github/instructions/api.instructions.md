---
description: "Use when: criando ou editando controllers NestJS; definindo rotas HTTP; escolhendo status codes de resposta; estruturando endpoints REST; delegando para use cases. Aplica convenções de nomenclatura, status HTTP e estrutura de controllers do projeto."
applyTo: "src/api/**/*.controller.ts"
---

# Convenções de Controllers (Camada API)

Controllers delegam para use cases — **zero lógica de negócio**.

## Estrutura e nomenclatura

- Um arquivo por controller: `<recurso>.controller.ts` em `src/api/<módulo>/controllers/`
- Classe: `PascalCase` + sufixo `Controller` — ex: `UsersController`
- Rota base: kebab-case, plural — ex: `@Controller('users')`
- Injeção de use cases pelo construtor; nunca instanciar diretamente

```typescript
@Controller('users')
export class UsersController {
  constructor(private readonly createUser: CreateUserUseCase) {}
}
```

## Status HTTP padrão

| Operação | Método | Status de sucesso |
|---|---|---|
| Criar recurso | `POST` | `201 Created` |
| Buscar lista | `GET` | `200 OK` |
| Buscar por ID | `GET /:id` | `200 OK` |
| Atualizar parcial | `PATCH /:id` | `200 OK` |
| Substituir total | `PUT /:id` | `200 OK` |
| Remover | `DELETE /:id` | `204 No Content` |

Use `@HttpCode()` explicitamente sempre que o status não for o padrão do NestJS (que é 200 para GET/PATCH/DELETE e 201 para POST).

```typescript
@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
remove(@Param('id') id: string) { ... }
```

## Respostas de erro padrão (não repita por endpoint)

| Status | Quando |
|---|---|
| `400 Bad Request` | Validação de DTO falhou (class-validator) |
| `401 Unauthorized` | Token ausente ou inválido |
| `403 Forbidden` | Autenticado mas sem permissão |
| `404 Not Found` | Recurso inexistente |
| `409 Conflict` | Duplicação de recurso único |

## Parâmetros de rota e query

- Parâmetros de rota: `@Param('id')` — sempre `string`, converta no use case
- Query params opcionais: `@Query()` com DTO tipado
- Body: `@Body()` com DTO de entrada validado (class-validator)

## O que NÃO fazer

- Não coloque `try/catch` no controller — use filtros de exceção globais
- Não acesse repositórios, entidades ou ORM diretamente — sempre via use case
- Não duplique validações já cobertas pelo `ValidationPipe` global
- Não retorne entidades de domínio — sempre mapeie para um DTO de resposta
