---
description: "Use when: configurando ValidationPipe global no NestJS; criando ou editando DTOs de entrada; adicionando decorators de validação com class-validator; transformando tipos no body da requisição; formatando mensagens de erro de validação para o cliente. Cobre instalação, configuração global e convenções de DTO."
applyTo: ["src/**/*.dto.ts", "src/api/**/*.dto.ts"]
---

# Validação de Entrada (DTOs)

## Dependências obrigatórias

O projeto usa `class-validator` e `class-transformer`. Instale caso ausente:

```bash
yarn add class-validator class-transformer
```

---

## Configuração global — `main.ts`

Registre o `ValidationPipe` **antes** de `app.listen()`. Use sempre estas opções:

```typescript
import { ValidationPipe } from '@nestjs/common';

app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,           // remove campos não declarados no DTO
    forbidNonWhitelisted: true, // lança erro se campos extras forem enviados
    transform: true,           // converte automaticamente tipos primitivos (string → number, etc.)
    transformOptions: {
      enableImplicitConversion: true,
    },
  }),
);
```

| Opção | Por quê |
|---|---|
| `whitelist: true` | Garante que apenas campos do DTO cheguem ao use case |
| `forbidNonWhitelisted: true` | Rejeita payloads com campos desconhecidos (proteção contra mass assignment) |
| `transform: true` | Evita conversões manuais desnecessárias nos use cases |

---

## Estrutura e nomenclatura de DTOs

- Arquivo: `<acao>-<recurso>.dto.ts` em `<módulo>/application/dto/`
- Classe: `PascalCase` + sufixo `Dto`
- DTOs de entrada e saída ficam em arquivos separados

```
users/application/dto/
  create-user.dto.ts      ← entrada
  update-user.dto.ts      ← entrada (parcial)
  user-response.dto.ts    ← saída
```

---

## Padrões de validação

### DTO de criação

```typescript
import { IsEmail, IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome não pode ser vazio' })
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'A senha deve ter no mínimo 8 caracteres' })
  password: string;
}
```

### DTO de atualização parcial (use `PartialType`)

```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

### DTO de resposta (nunca retorne entidades de domínio)

```typescript
export class UserResponseDto {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}
```

---

## Mensagens de erro

- Sempre em **português**, descritivas e orientadas ao usuário final.
- Use a opção `message` do decorator para sobrescrever o padrão em inglês.
- Nunca exponha detalhes internos (nomes de tabela, propriedades de ORM) na mensagem.

```typescript
// ✅ correto
@IsNotEmpty({ message: 'O campo email não pode ser vazio' })
@IsEmail({}, { message: 'Informe um e-mail válido' })

// ❌ evitar — mensagem padrão em inglês do class-validator
@IsEmail()
```

---

## O que NÃO fazer

- Não faça validações manuais nos controllers ou use cases para o que `class-validator` já resolve.
- Não use `Partial<CreateUserDto>` manualmente — use `PartialType` do `@nestjs/mapped-types`.
- Não retorne uma entidade de domínio como resposta — sempre mapeie para um `ResponseDto`.
- Não adicione lógica de negócio nos DTOs — apenas validação estrutural de entrada.
