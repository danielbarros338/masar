---
name: lint-fix
description: "Corrige erros de lint no projeto. Use quando: o comando yarn lint falhar; houver erros de ESLint ou Prettier no código; quiser garantir que o código está formatado e livre de violações de estilo antes de commitar."
argument-hint: "Arquivo ou pasta a corrigir (ex: src/modules/user). Se omitido, aplica em todo o projeto."
---

# Lint Fix

Identifica e corrige erros de ESLint/Prettier no projeto, iterativamente, até que nenhum erro de lint persista.

## Quando Usar

- Ao receber falha de `yarn lint` no terminal
- Antes de commitar ou abrir PR
- Após gerar ou modificar arquivos TypeScript/NestJS
- Quando o CI/CD falhar por erro de lint

## Procedimento

### 1. Definir o escopo

Se um arquivo ou pasta foi fornecido como argumento, use-o. Caso contrário, o escopo é `src/`.

### 2. Executar auto-fix

O comando de lint do projeto já inclui `--fix` e corrige automaticamente a maioria dos erros de formatação e estilo:

```bash
yarn lint
```

Capture toda a saída. O `yarn lint` aplica `--fix` automaticamente nos arquivos — erros que sobram na saída **não puderam ser corrigidos automaticamente** e exigem intervenção manual.

### 3. Analisar os erros restantes

Para cada erro que persiste após o `yarn lint`, identifique a categoria:

| Categoria | Exemplo de regra | Ação |
|---|---|---|
| Tipo implícito / `any` não permitido | `@typescript-eslint/no-explicit-any` | Adicionar tipo correto ou `unknown` |
| Promessa não tratada | `@typescript-eslint/no-floating-promises` | Adicionar `await` ou `.catch()` |
| Variável declarada mas não usada | `@typescript-eslint/no-unused-vars` | Remover a variável ou prefixar com `_` |
| `require()` em vez de `import` | `@typescript-eslint/no-require-imports` | Converter para `import` ES module |
| Retorno de tipo `unsafe` | `@typescript-eslint/no-unsafe-*` | Adicionar tipagem explícita |
| Formatação (Prettier) | `prettier/prettier` | Corrigir espaçamento, aspas, vírgulas |
| Regra customizada do projeto | qualquer outra | Ler a mensagem e corrigir de acordo |

### 4. Corrigir manualmente os erros restantes

- Edite cada arquivo apontado, corrigindo o erro na linha indicada.
- **Nunca use `// eslint-disable` sem justificativa explícita** no comentário.
- Respeite as convenções de nomenclatura e arquitetura do projeto (ver `.github/copilot-instructions.md`).
- Não altere lógica de negócio ao corrigir lint — apenas o estilo/tipagem.

### 5. Re-executar o lint

Após as correções manuais, rode novamente:

```bash
yarn lint
```

Se ainda houver erros, repita os passos 3-5 até a saída ficar limpa.

### 6. Verificar erros de diagnóstico

Use `get_errors` nos arquivos modificados para garantir que as correções de lint não introduziram novos erros TypeScript:

```
get_errors [arquivos modificados]
```

Se houver novos erros TypeScript, corrija-os antes de prosseguir.

### 7. Relatório final

Produza um resumo com:
- Quantos arquivos foram corrigidos
- Quais categorias de erro foram encontradas
- Se algum erro foi suprimido com `eslint-disable` e por quê

## Critérios de Conclusão

- [ ] `yarn lint` executa sem nenhum erro na saída
- [ ] Nenhum `eslint-disable` não justificado foi introduzido
- [ ] `get_errors` retorna zero erros de compilação nos arquivos modificados
- [ ] Nenhuma lógica de negócio foi alterada — apenas estilo e tipagem
