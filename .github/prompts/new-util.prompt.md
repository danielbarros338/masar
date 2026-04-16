---
description: "Cria uma classe utilitária em src/common/utils/ para uso compartilhado entre módulos. Use quando precisar de um helper reutilizável (ex: formatação de datas, manipulação de strings, geração de slugs, paginação)."
name: "New Util"
argument-hint: "Ex: DateFormatter | Ex: StringHelper | Ex: Pagination"
agent: "agent"
---

Crie uma classe utilitária em `src/common/utils/` seguindo **estritamente** as convenções do projeto descritas em [copilot-instructions.md](../copilot-instructions.md).

## Entrada esperada

O usuário deve informar (pelo argumento ou na mensagem):
- **Nome base** da util (ex: `DateFormatter`, `StringHelper`, `Pagination`)
- **Responsabilidade** — o que a util faz (ex: formatar datas no padrão ISO, gerar slugs a partir de strings)
- **Métodos** esperados (nome, parâmetros e retorno de cada um)

Se alguma informação estiver faltando, pergunte antes de implementar.

## Regras obrigatórias

- **Arquivo**: `src/common/utils/<nome>.util.ts` em `kebab-case` (ex: `pbkdf2.util.ts`)
- **Classe**: `PascalCase` com sufixo `Util` (ex: `Pbkdf2Util`)
- **Sempre `@Injectable()`**: qualquer util em `src/common/utils/` é um provider NestJS — nunca use `new` ou métodos estáticos para helpers consumidos por módulos
- **Registro obrigatório**: adicione o provider em `src/common/common.module.ts` (em `providers` e `exports`). O `CommonModule` já está importado no `AppModule`; se o módulo consumidor precisar do provider, importe também o `CommonModule` nele
- **Métodos de instância**: use métodos de instância (não estáticos) quando a classe lê config/env; estáticos apenas em helpers puramente computacionais sem estado
- **Config via `process.env`**: leia variáveis de ambiente no construtor com valor padrão seguro; valide e lance `Error` descritivo se inválido
- **Sem dependências de módulo**: utils não podem importar nada de `src/modules/` — só libs externas ou outros helpers de `src/common/`
- **Sem lógica de negócio de domínio**: utils são agnósticas ao domínio; não conhecem entidades nem repositórios
- **Sem `any`**: todos os parâmetros e retornos devem ser tipados
- **Tratamento de edge cases**: valide entradas inválidas e lance erros descritivos quando necessário

## Estrutura mínima

```typescript
// src/common/utils/pbkdf2.util.ts
import { Injectable } from '@nestjs/common';

@Injectable()
export class Pbkdf2Util {
  private readonly iterations: number;

  constructor() {
    this.iterations = parseInt(process.env.PBKDF2_ITERATIONS ?? '310000', 10);
    if (isNaN(this.iterations) || this.iterations <= 0) {
      throw new Error('Pbkdf2Util: PBKDF2_ITERATIONS inválido');
    }
  }

  async hash(value: string): Promise<string> { ... }
  async verify(value: string, stored: string): Promise<boolean> { ... }
}
```

```typescript
// src/common/common.module.ts  ← registrar e exportar o provider
import { Module } from '@nestjs/common';
import { Pbkdf2Util } from './utils/pbkdf2.util';

@Module({
  providers: [Pbkdf2Util],
  exports: [Pbkdf2Util],
})
export class CommonModule {}
```

## Verificações antes de criar

- [ ] Já existe uma util com responsabilidade semelhante em `src/common/utils/`? Se sim, adicione o método lá em vez de criar um novo arquivo.
- [ ] A lógica pertence à camada de domínio (regra de negócio)? Se sim, ela deve ficar em um Value Object ou entidade — não aqui.
- [ ] O provider foi adicionado em `providers` e `exports` do `CommonModule`?
- [ ] O módulo consumidor importa `CommonModule` (se diferente do `AppModule`)?

## Após criar o arquivo

- Confirme o caminho gerado e a atualização do `CommonModule`
- Liste os métodos com assinatura de tipo
- Informe quais variáveis de ambiente são necessárias (com valores padrão)
