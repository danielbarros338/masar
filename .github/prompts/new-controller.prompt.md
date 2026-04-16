---
description: "Cria um controller NestJS seguindo as convenções do projeto Masar (NestJS + Clean Architecture). Use quando quiser gerar um controller HTTP que delega para use cases, sem lógica de negócio."
name: "New Controller"
argument-hint: "Ex: User (módulo: user) | Ex: FinancialOperation (módulo: financial-operation)"
agent: "agent"
---

Crie o controller para o módulo informado, seguindo **estritamente** as convenções do projeto descritas em [copilot-instructions.md](../copilot-instructions.md).

## Entrada esperada

O usuário deve informar (pelo argumento ou na mensagem):
- **Nome base** do recurso (ex: `User`, `FinancialOperation`)
- **Módulo** ao qual pertence (ex: `user`, `financial-operation`)
- **Endpoints** desejados: método HTTP, rota e use case correspondente (ex: `POST /users → CreateUserUseCase`)
- **DTOs** de entrada e saída para cada endpoint (se já existirem, informe os nomes)

Se os use cases já existirem no projeto, leia-os para conhecer os parâmetros de `execute()` antes de implementar.

Se alguma informação estiver faltando, pergunte antes de implementar.

## Regras obrigatórias

- Arquivo: `src/api/<módulo>/controllers/<entidade>.controller.ts`
- Classe: `<Entidade>Controller` em `PascalCase` com sufixo `Controller`
- Decorado com `@Controller('<rota-base>')` e `@ApiTags('<tag>')` (Swagger)
- **Sem lógica de negócio** — apenas recebe a requisição, chama o use case e retorna o resultado
- Cada use case é injetado via construtor
- Use os decorators HTTP do NestJS: `@Get()`, `@Post()`, `@Put()`, `@Patch()`, `@Delete()`
- Use `@Body()`, `@Param()`, `@Query()` para extrair dados da requisição
- Documente com `@ApiOperation()` e `@ApiResponse()` quando relevante

## Exemplo

```typescript
// src/api/user/controllers/user.controller.ts
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserUseCase } from '../../../user/application/use-cases/create-user.use-case';
import { FindUserByIdUseCase } from '../../../user/application/use-cases/find-user-by-id.use-case';
import { DeleteUserUseCase } from '../../../user/application/use-cases/delete-user.use-case';
import { CreateUserDto } from '../../../user/application/dto/create-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly createUser: CreateUserUseCase,
    private readonly findUserById: FindUserByIdUseCase,
    private readonly deleteUser: DeleteUserUseCase,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Criar usuário' })
  async create(@Body() dto: CreateUserDto) {
    return this.createUser.execute(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  async findById(@Param('id') id: string) {
    return this.findUserById.execute(Number(id));
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover usuário' })
  async remove(@Param('id') id: string) {
    return this.deleteUser.execute(Number(id));
  }
}
```

## Após criar o arquivo

- Confirme o caminho gerado
- Liste os endpoints criados (método + rota + use case)
- Lembre que o controller deve ser registrado no módulo NestJS correspondente em `controllers: [...]`
