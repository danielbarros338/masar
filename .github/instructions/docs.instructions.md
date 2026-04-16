---
description: "Use when: adicionando documentação Swagger a controllers, DTOs ou endpoints NestJS; documentando rotas HTTP com @ApiOperation/@ApiResponse/@ApiProperty; criando decorators Swagger. Exige que a documentação seja concisa e use composição de decorators para evitar verbosidade."
applyTo: ["src/**/*.controller.ts", "src/**/*.dto.ts", "src/api/**/*.controller.ts"]
---

# Diretrizes de Documentação Swagger

Seja **o menos verboso possível e o mais informativo possível**.

## Regra principal — Composição de decorators

Sempre que um conjunto de decorators Swagger se repetir em 2 ou mais endpoints (ou puder se repetir no futuro), extraia-o para um **decorator composto** usando `applyDecorators()`.

Coloque os decorators compostos em um arquivo `<módulo>.swagger.ts` dentro da pasta do controller.

```typescript
// src/api/users/controllers/users.swagger.ts
import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { UserResponseDto } from '../../../users/application/dto/user-response.dto';

export const ApiCreateUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Cria um novo usuário' }),
    ApiResponse({ status: 201, type: UserResponseDto }),
    ApiResponse({ status: 400, description: 'Dados inválidos' }),
  );

export const ApiGetUser = () =>
  applyDecorators(
    ApiOperation({ summary: 'Retorna um usuário pelo ID' }),
    ApiResponse({ status: 200, type: UserResponseDto }),
    ApiResponse({ status: 404, description: 'Usuário não encontrado' }),
  );
```

No controller, use apenas o decorator composto:

```typescript
@Post()
@ApiCreateUser()
create(@Body() dto: CreateUserDto) { ... }

@Get(':id')
@ApiGetUser()
findOne(@Param('id') id: string) { ... }
```

## Respostas padrão — não repita

Respostas comuns a toda a API (401 Unauthorized, 500 Internal Server Error) devem ser agrupadas em um decorator de classe ou em um decorator de módulo compartilhado, **não** repetidas em cada endpoint.

```typescript
// decorator de classe — aplica a todos os endpoints do controller
@ApiTags('users')
@ApiBearerAuth()
@ApiResponse({ status: 401, description: 'Não autenticado' })
@Controller('users')
export class UsersController { ... }
```

## @ApiProperty em DTOs — mínimo necessário

Use `@ApiProperty()` com o mínimo de campos:

- Omita `description` quando o nome da propriedade já é autoexplicativo
- Inclua `example` apenas quando o formato não for óbvio (UUIDs, datas, enums)
- Use `@ApiPropertyOptional()` para campos opcionais — nunca `@ApiProperty({ required: false })`

```typescript
// ruim — verboso sem ganho
@ApiProperty({ description: 'Nome do usuário', required: true, type: String })
name: string;

// bom — conciso e suficiente
@ApiProperty({ example: 'João Silva' })
name: string;

// bom — campo opcional
@ApiPropertyOptional({ example: 'https://avatar.io/123' })
avatarUrl?: string;
```

## O que evitar

- Blocos de 5+ decorators Swagger inline em um mesmo método — extraia para decorator composto
- `description` em `@ApiResponse` quando o status HTTP já é suficientemente descritivo (ex: 204 No Content)
- `type: String` / `type: Number` explícito quando o TypeScript já infere o tipo
- Comentários explicando o que o decorator já diz
