---
name: code-review-fix
description: "Revisão e correção automática de código. Use quando: quiser revisar código recém-criado ou modificado; verificar erros de sintaxe TypeScript/NestJS; corrigir erros de compilação, lint ou execução; garantir que o código compila sem erros antes de commitar. Corrige iterativamente até não restar erros."
argument-hint: "Arquivo ou pasta a revisar (ex: src/user)"
---

# Code Review & Fix

Revisa código TypeScript/NestJS em busca de erros de sintaxe, compilação e execução, corrige-os iterativamente até não restar nenhum erro.

## Quando Usar

- Após criar ou modificar arquivos TypeScript/NestJS
- Antes de commitar ou abrir PR
- Ao suspeitar de erros de compilação ou lint
- Para validar que a arquitetura Clean Arch foi respeitada (imports entre camadas)

## Procedimento

### 1. Coletar escopo

Se um arquivo ou pasta foi fornecido como argumento, use-o como escopo. Caso contrário, use `src/` inteiro.

### 2. Verificar erros de diagnóstico (TypeScript / Pylance)

Use a ferramenta `get_errors` nos arquivos do escopo para obter todos os erros e avisos reportados pelo compilador/language server.

### 3. Verificar erros de lint

Execute o comando de lint do projeto:

```bash
yarn lint
```

Analise a saída para identificar erros que o lint reportar além dos já encontrados no passo anterior.

### 4. Verificar compilação

Execute o build:

```bash
yarn build
```

Capture erros de compilação que possam não ter aparecido nas etapas anteriores (ex: referências circulares, módulos não encontrados).

### 5. Triagem dos erros

Para cada erro encontrado, classifique:

| Tipo | Exemplos | Ação |
|---|---|---|
| Erro de sintaxe | Parêntese faltando, ponto-e-vírgula | Corrigir no arquivo |
| Erro de tipo | Tipo incompatível, propriedade inexistente | Corrigir tipagem ou interface |
| Import inválido | Módulo não encontrado, caminho errado | Corrigir caminho ou instalar dep |
| Violação de camada | `domain` importando `infra`, `infra` importando `api` | Corrigir para respeitar `api → application → domain` |
| Erro de lint | Variável não usada, formatação | Corrigir ou suprimir justificadamente |

### 6. Aplicar correções

- Corrija cada erro usando as ferramentas de edição de arquivo.
- Priorize erros de compilação antes de erros de lint.
- Nunca suprima erros com `@ts-ignore` ou `eslint-disable` sem justificativa explícita.
- Respeite as convenções de nomenclatura do projeto (ver `.github/copilot-instructions.md`).

### 7. Re-verificar

Após aplicar as correções, execute novamente `get_errors` e `yarn build`. Repita os passos 5-7 até que:

- `get_errors` retorne zero erros para os arquivos do escopo
- `yarn build` complete sem erros

### 8. Relatório final

Após todas as correções, produza um sumário com:

- Quantos erros foram encontrados e de qual tipo
- Quais arquivos foram modificados
- Se ainda houver avisos (warnings) não críticos, liste-os separadamente

## Critérios de Conclusão

- [ ] Zero erros de compilação TypeScript
- [ ] Zero erros de lint (apenas warnings permitidos, se justificados)
- [ ] `yarn build` executa com sucesso
- [ ] Nenhuma violação da regra de dependência entre camadas
- [ ] Nenhum `@ts-ignore` ou `eslint-disable` não justificado introduzido
