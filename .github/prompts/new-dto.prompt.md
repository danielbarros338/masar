---
description: "Cria DTOs (Data Transfer Objects) seguindo as convenções do projeto Masar (NestJS + Clean Architecture). Use quando quiser gerar um DTO de entrada ou de resposta para um módulo."
name: "New DTO"
argument-hint: "Ex: CreateUser (módulo: user) | Ex: UserResponse (módulo: user)"
agent: "agent"
---

Crie um ou mais DTOs para o módulo informado, seguindo **estritamente** as convenções do projeto descritas em [copilot-instructions.md](../copilot-instructions.md).

## Entrada esperada

O usuário deve informar (pelo argumento ou na mensagem):
- **Nome base** do DTO (ex: `CreateUser`, `UserResponse`)
- **Módulo** ao qual pertence (ex: `user`, `financial-operation`)
- **Campos** que o DTO deve conter (nome, tipo, obrigatoriedade, validações se houver)
- **Tipo**: DTO de entrada (request) ou de saída (response)

Se alguma informação estiver faltando, pergunte antes de implementar.

## Regras obrigatórias

- Arquivo em `kebab-case` com sufixo `.dto.ts` → ex: `create-user.dto.ts`
- Localização: `src/<módulo>/application/dto/`
- Classe em `PascalCase` com sufixo `Dto` → ex: `CreateUserDto`, `UserResponseDto`
- Use decorators do `class-validator` para DTOs de entrada (`@IsString()`, `@IsNotEmpty()`, `@IsEmail()`, etc.)
- Use `@ApiProperty()` do `@nestjs/swagger` quando relevante
- DTOs de resposta não precisam de validação — apenas tipagem
- Não adicione lógica de negócio nos DTOs

## Exemplo de DTO de entrada

```typescript
// src/user/application/dto/create-user.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
```

## Exemplo de DTO de resposta

```typescript
// src/user/application/dto/user-response.dto.ts
export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}
```

## Após criar o(s) arquivo(s)

- Confirme o caminho e o nome gerados
- Informe quais campos foram incluídos e seus tipos
- Sugira se um mapper (`toDomain` / `toPersistence`) pode ser necessário para converter entre DTO e entidade de domínio
