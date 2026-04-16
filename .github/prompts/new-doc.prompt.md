---
description: "Documenta um módulo inteiro com Swagger (controller, DTOs de entrada e de resposta). Use quando: quiser adicionar decorators @ApiTags, @ApiOperation, @ApiResponse, @ApiProperty em um módulo do NestJS; documentar endpoints existentes; preparar a API para exibição no Swagger UI."
argument-hint: "Informe o controller ou módulo a documentar (ex: UserController, ou abra o arquivo no editor)"
agent: "agent"
---

# Documentação Swagger — Módulo Completo

Siga as diretrizes de [docs.instructions.md](../.github/instructions/docs.instructions.md): **mínimo de verbosidade, máximo de informação**.

Sua tarefa é adicionar documentação Swagger completa a **um módulo inteiro**, abrangendo:

1. **`<módulo>.swagger.ts`** — decorators compostos para cada endpoint
2. **Controller** — usa os decorators compostos, sem Swagger inline
3. **DTOs** — `@ApiProperty` mínimo em cada propriedade

## Contexto do módulo

O usuário indicou: `$ARGUMENTS`

Localize os arquivos seguindo:

```
src/api/<módulo>/controllers/     ← Controller + criar <módulo>.swagger.ts aqui
src/<módulo>/application/dto/     ← DTOs de entrada e resposta
```

## Passo 1 — Criar `<módulo>.swagger.ts`

Crie o arquivo `<módulo>.swagger.ts` na mesma pasta do controller. Para cada endpoint, exporte um decorator composto com `applyDecorators()`:

```typescript
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserResponseDto } from '../../../users/application/dto/user-response.dto';

export const ApiCreateUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Cria um novo usuário' }),
    ApiResponse({ status: 201, type: UserResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
  );
```

- Nomeie cada decorator como `Api<Ação><Recurso>` — ex: `ApiCreateUser`, `ApiFindUser`
- Inclua apenas os status relevantes para o endpoint (não repita 401 por endpoint — vai no decorator de classe)

## Passo 2 — Atualizar o controller

Substitua qualquer Swagger inline pelos decorators compostos. Na classe:

```typescript
@ApiTags('users')          // kebab-case, plural
@ApiBearerAuth()           // somente se houver autenticação JWT
@ApiResponse({ status: 401, description: 'Não autenticado' })   // respostas comuns uma vez só
@Controller('users')
export class UsersController { ... }
```

Em cada método use apenas o decorator composto:

```typescript
@Post()
@ApiCreateUser()
create(@Body() dto: CreateUserDto) { ... }
```

## Passo 3 — Atualizar os DTOs

Adicione `@ApiProperty` com o mínimo necessário:

- Sem `description` quando o nome da propriedade é autoexplicativo
- Com `example` apenas quando o formato não é óbvio (UUID, data, enum)
- `@ApiPropertyOptional()` para campos opcionais — nunca `required: false`

```typescript
@ApiProperty({ example: 'João Silva' })
name: string;

@ApiPropertyOptional({ example: 'https://cdn.io/avatar.png' })
avatarUrl?: string;
```

Não remova decorators de validação (`@IsString`, `@IsEmail`, etc.) existentes.

## O que NÃO fazer

- Não adicione Swagger em entidades de domínio (`*.entity.ts`) — apenas em DTOs
- Não repita `@ApiResponse` de erros comuns (401, 500) em cada método — coloque na classe
- Não altere lógica de negócio
- Não remova imports ou decorators já existentes

## Verificação final

Liste os arquivos criados/modificados e confirme:
- `<módulo>.swagger.ts` criado com um decorator composto por endpoint
- Controller sem decorators Swagger inline nos métodos
- Todos os DTOs com `@ApiProperty` em cada propriedade pública
