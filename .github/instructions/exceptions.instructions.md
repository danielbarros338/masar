---
description: "Use when: criando exceções customizadas; implementando filtros de exceção NestJS; tratando erros em use cases; configurando tratamento global de erros; escolhendo qual exceção lançar; garantindo logs de stack trace; evitando parar a aplicação por erros não tratados. Cobre convenções de nomenclatura, estrutura de filtros e padrão de log obrigatório."
applyTo: ["src/**/*.exception.ts", "src/**/*.filter.ts"]
---

# Tratamento de Exceções

## Regras fundamentais

1. **A aplicação nunca pode parar** — Todo erro deve ser capturado pelo filtro global; nunca deixe exceções não tratadas sair para o processo Node.
2. **Mensagens claras** — A resposta HTTP deve conter uma mensagem legível para o cliente, sem expor detalhes internos (paths, stack, queries SQL).
3. **Log de stack obrigatório** — Sempre registre `error.stack` para rastreabilidade; nunca logue apenas a mensagem.
4. **Exceções customizadas** — Use exceções nomeadas que expressem o domínio; evite `throw new Error('...')` genérico.

---

## Exceções customizadas

Crie em `src/common/exceptions/`, herdando de `HttpException` do NestJS.

```typescript
// src/common/exceptions/not-found.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class NotFoundException extends HttpException {
  constructor(resource: string, id?: string | number) {
    const message = id
      ? `${resource} com id "${id}" não encontrado`
      : `${resource} não encontrado`;
    super({ message, error: 'Not Found' }, HttpStatus.NOT_FOUND);
  }
}
```

```typescript
// src/common/exceptions/conflict.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class ConflictException extends HttpException {
  constructor(resource: string, field: string) {
    super(
      { message: `${resource} com este ${field} já existe`, error: 'Conflict' },
      HttpStatus.CONFLICT,
    );
  }
}
```

```typescript
// src/common/exceptions/business-rule.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessRuleException extends HttpException {
  constructor(message: string) {
    super({ message, error: 'Unprocessable Entity' }, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}
```

**Convenções:**
- Arquivo: `<nome>.exception.ts` em `src/common/exceptions/`
- Classe: `PascalCase` + sufixo `Exception`
- Mensagem: descritiva, orientada ao cliente, sem expor infraestrutura

---

## Catálogo de exceções (use a mais específica)

| Classe | Status HTTP | Quando usar |
|---|---|---|
| `NotFoundException` | `404` | Recurso não encontrado por ID ou critério |
| `ConflictException` | `409` | Recurso único já existe (e-mail, CPF, slug…) |
| `BusinessRuleException` | `422` | Regra de negócio violada (ex: saldo insuficiente) |
| `UnauthorizedException` (NestJS) | `401` | Não autenticado |
| `ForbiddenException` (NestJS) | `403` | Autenticado, mas sem permissão |

---

## Filtro global de exceções

Crie em `src/common/filters/all-exceptions.filter.ts`. Este filtro **nunca** deve deixar uma exceção escapar sem ser tratada.

```typescript
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? ((exception.getResponse() as Record<string, unknown>)?.message ??
          exception.message)
        : 'Erro interno do servidor';

    // Log obrigatório com stack — permite identificar onde e por que o erro ocorreu
    this.logger.error(
      `[${request.method}] ${request.url} → ${status}`,
      exception instanceof Error ? exception.stack : String(exception),
    );

    response.status(status).json({
      statusCode: status,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
```

Registre no `main.ts` **antes** de `app.listen()`:

```typescript
app.useGlobalFilters(new AllExceptionsFilter());
```

---

## Lançar exceções nos use cases

Use sempre a exceção mais específica para o contexto:

```typescript
// ✅ correto — mensagem clara, tipo semântico
if (!user) throw new NotFoundException('Usuário', id);
if (existing) throw new ConflictException('Usuário', 'e-mail');
if (!canWithdraw) throw new BusinessRuleException('Saldo insuficiente para esta operação');

// ❌ evitar — genérico, sem semântica HTTP
if (!user) throw new Error('User not found');
if (!user) throw new HttpException('not found', 404);
```

---

## O que NÃO fazer

- Não use `try/catch` para engolir erros silenciosamente — sempre re-lance ou logue.
- Não exponha `stack`, queries SQL ou caminhos de arquivo na resposta HTTP — apenas no log do servidor.
- Não logue apenas `error.message` — **sempre** logue `error.stack`.
- Não use `process.on('uncaughtException')` como substituto dos filtros do NestJS.
- Não coloque `try/catch` nos controllers — deixe o filtro global tratar.
