---
description: "Use when: adicionando logs em qualquer camada da aplicação; escolhendo o nível de log correto (log, warn, error, debug, verbose); criando instâncias de Logger NestJS; logando erros com stack trace; definindo contexto de log em use cases, services ou filtros. Proíbe uso de console.* e define o que deve e não deve ser logado."
applyTo: ["src/**/*.ts"]
---

# Convenções de Logging

## Regra principal — nunca use `console.*`

Use **sempre** o `Logger` do NestJS. `console.log`, `console.error` etc. são proibidos em código de produção — não aparecem no sistema de log estruturado e não carregam contexto.

```typescript
// ✅ correto
import { Logger } from '@nestjs/common';
private readonly logger = new Logger(UsersService.name);

// ❌ proibido
console.log('criando usuário...');
console.error(error);
```

---

## Instanciação

Declare o logger como propriedade privada da classe, usando o nome da própria classe como contexto:

```typescript
import { Logger } from '@nestjs/common';

export class CreateUserUseCase {
  private readonly logger = new Logger(CreateUserUseCase.name);
  // ...
}
```

O contexto (`CreateUserUseCase`) aparece automaticamente em cada linha de log, facilitando o rastreamento.

---

## Níveis de log e quando usar

| Método | Nível | Quando usar |
|---|---|---|
| `logger.log()` | INFO | Fluxo normal da aplicação — recurso criado, operação concluída |
| `logger.warn()` | WARN | Situação inesperada mas recuperável — retry, fallback, dado ausente não crítico |
| `logger.error()` | ERROR | Falha — exceção capturada, operação não concluída; sempre inclua `stack` |
| `logger.debug()` | DEBUG | Informações de diagnóstico úteis apenas em desenvolvimento |
| `logger.verbose()` | VERBOSE | Detalhes de baixo nível (payloads, queries) — nunca em produção |

---

## Padrão de log em erros — `stack` é obrigatório

Sempre passe `exception.stack` como segundo argumento de `logger.error()`. Nunca logue apenas a mensagem.

```typescript
// ✅ correto — stack visível para rastreamento
this.logger.error('Falha ao criar usuário', error.stack);

// ❌ incompleto — sem stack não é possível identificar a origem
this.logger.error('Falha ao criar usuário');
this.logger.error(error.message);
```

---

## O que logar por camada

### Use Cases

```typescript
async execute(dto: CreateUserDto): Promise<UserResponseDto> {
  this.logger.log(`Criando usuário: ${dto.email}`);
  // ...
  this.logger.log(`Usuário criado com id ${user.id}`);
}
```

- Log de **início** (entrada relevante sem dados sensíveis) e **conclusão** com identificador do recurso.
- Use `logger.warn()` para regras de negócio violadas que não geram exceção.
- Use `logger.error()` + `stack` no `catch`, antes de re-lançar a exceção.

### Filtros de exceção

```typescript
this.logger.error(
  `[${request.method}] ${request.url} → ${status}`,
  exception instanceof Error ? exception.stack : String(exception),
);
```

### Repositórios / Infra

- Use `logger.debug()` para queries e payloads de persistência — nunca `logger.log()`.
- Nunca logue senhas, tokens ou dados pessoais sensíveis (CPF, cartão).

---

## O que NÃO logar

| O que | Por quê |
|---|---|
| Senhas, tokens JWT, API keys | Exposição de credenciais em logs |
| Números de cartão, CPF completo | LGPD / dados sensíveis |
| Stack trace em respostas HTTP | Vaza detalhes de implementação para o cliente |
| Queries SQL completas em `log()` | Use `debug()` — verboso demais para INFO |

---

## O que NÃO fazer

- Não use `console.*` em nenhuma camada — controllers, use cases, repositórios, filtros.
- Não crie um `Logger` global compartilhado — cada classe instancia o seu com o próprio contexto.
- Não logue dados da requisição inteiros sem filtrar — remova campos sensíveis antes.
- Não use `logger.debug()` em código que vai para produção sem verificar o nível de log configurado.
