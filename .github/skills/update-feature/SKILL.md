---
name: update-feature
description: "Guia para atualizar features existentes com segurança. Use quando: precisar modificar um use case, entidade, value object, DTO, repositório ou controller já existente; alterar regras de negócio de domínio; mudar a assinatura de um port; adicionar ou remover campos de uma entidade ou DTO. Garante que nenhuma regressão seja introduzida e que todas as camadas afetadas sejam atualizadas consistentemente."
argument-hint: "Descrição da mudança e o arquivo ou funcionalidade alvo (ex: adicionar campo 'phone' na UserEntity e propagar para todas as camadas)"
---

# Update Feature

Guia para modificar features existentes de forma segura, garantindo consistência entre camadas e ausência de regressões.

## Quando Usar

- Ao modificar uma entidade de domínio, value object ou suas props
- Ao alterar a assinatura de um port (adicionar/remover métodos ou parâmetros)
- Ao evoluir um use case existente (nova regra, novo parâmetro, novo retorno)
- Ao adicionar/remover campos de DTOs de entrada ou saída
- Ao alterar lógica de um repositório ou mapper
- Ao modificar um controller (nova rota, novo status code, parâmetro diferente)

## Diferença em Relação a `new-feature`

| Aspecto | `new-feature` | `update-feature` |
|---|---|---|
| Ponto de partida | Código em branco | Código existente a entender |
| Risco principal | Over-engineering | Regressão e inconsistência entre camadas |
| Primeiro passo | Desenhar a interface pública | Ler e mapear o código existente |
| Testes | Criar do zero | Atualizar os existentes + adicionar novos |
| Schema | Pode criar nova migration | Deve criar migration de ALTER TABLE se alterar campos persistidos |

## Procedimento

### 1. Ler e entender o estado atual

Antes de qualquer modificação:

- Leia o arquivo alvo completamente.
- Leia todos os arquivos que **importam** ou **dependem** do alvo usando `vscode_listCodeUsages` ou `grep_search`.
- Identifique: entidade, props, value objects, mapper, orm-entity, repositório, port, use case(s), DTO(s) e controller relacionados.

### 2. Mapear impacto

Construa mentalmente (ou no todo list) a lista de **todos os arquivos que precisarão mudar**. Organize por camada, da mais interna para a mais externa:

```
1. domain/props/          ← tipos das props da entidade
2. domain/entities/       ← entidade de domínio
3. domain/value-objects/  ← value objects afetados
4. application/ports/     ← assinatura do port (se mudar)
5. application/dto/       ← DTOs de entrada/saída
6. application/use-cases/ ← lógica de orquestração
7. infra/orm-entities/    ← schema persistido (+ migration se necessário)
8. infra/mapper/          ← conversão domain ↔ persistence
9. infra/repositories/    ← implementação do port
10. api/controllers/      ← camada HTTP
11. *.spec.ts             ← testes afetados
```

> Nunca pule camadas. Se mudar a entidade, verifique mapper e orm-entity. Se mudar o port, verifique o repositório e todos os use cases que o injetam.

### 3. Planejar antes de editar

Para cada arquivo da lista de impacto, defina **exatamente o que muda**:

- [ ] Campo adicionado/removido? Em quais camadas ele aparece?
- [ ] Assinatura de método alterada? Quem chama esse método?
- [ ] Regra de validação nova? Em qual camada ela fica (VO, use case, DTO)?
- [ ] A mudança afeta dados persistidos? → Planejar migration.
- [ ] A mudança quebra o contrato HTTP (request/response)? → Verificar se é breaking change.

### 4. Implementar de dentro para fora

Aplique as mudanças na ordem da lista de impacto (domínio primeiro, API por último). Isso garante que erros de tipo TypeScript guiem as próximas camadas.

```
domain → application → infra → api
```

**Regras durante a implementação:**

- Não introduza `any` ou `as unknown` para "resolver" erros de tipo — corrija a tipagem corretamente.
- Se alterar um campo obrigatório em props, corrija todos os pontos de construção da entidade.
- Se alterar a assinatura de um port, corrija a implementação em `infra/repositories/` imediatamente.
- Se adicionar campo persistido, crie a migration TypeORM antes de testar.
- Mantenha o princípio de dependência: `api → application → domain`; nunca inverta.

### 5. Verificar consistência de mapper

O mapper é a ponte entre domínio e persistência — é o lugar mais propenso a bugs silenciosos em atualizações.

Checklist do mapper após qualquer mudança de campo:

- [ ] `toDomain()` mapeia o novo campo da orm-entity para a domain entity?
- [ ] `toPersistence()` inclui o novo campo ao converter domain → orm-entity?
- [ ] Campos removidos foram apagados em **ambos** os métodos?
- [ ] Tipos batem entre domain props e orm-entity column?

### 6. Verificar transações

Se a mudança afeta **mais de uma tabela** em uma única operação:

- Use `ITransactionManager.run()` — veja `.github/instructions/transactions.instructions.md`.
- Repositórios devem expor métodos `*WithManager(entity, manager)`.
- Nunca injete `DataSource` diretamente no use case.

### 7. Atualizar testes

Após as mudanças no código principal, execute a skill `write-tests` focada nos arquivos modificados:

- Atualize testes existentes que reflitam a assinatura ou comportamento antigo.
- Adicione novos casos de teste para o comportamento introduzido.
- Delete asserções que testem comportamento removido.
- Garanta que nenhum teste existente quebre sem justificativa.

### 8. Revisar e compilar

Execute a skill `code-review-fix` para garantir:

- Zero erros TypeScript nos arquivos modificados.
- Zero erros de lint.
- `yarn build` completa sem erros.

## Checklist Final

Antes de considerar a atualização concluída:

- [ ] Todos os arquivos na lista de impacto foram atualizados?
- [ ] Mapper está consistente (`toDomain` e `toPersistence`)?
- [ ] Se campo persistido mudou: migration criada?
- [ ] Se contrato HTTP mudou: Swagger/documentação atualizado?
- [ ] Se port mudou: repositório e todos os use cases que o injetam atualizados?
- [ ] Testes atualizados e passando (`yarn test`)?
- [ ] `yarn build` sem erros?
- [ ] Nenhuma regressão introduzida nos módulos adjacentes?

## Armadilhas Comuns

| Armadilha | Como Evitar |
|---|---|
| Atualizar entidade mas esquecer o mapper | Sempre trate mapper como par inseparável da entidade |
| Atualizar port mas esquecer o repositório concreto | Use `vscode_listCodeUsages` para encontrar todas as implementações |
| Renomear método mas esquecer os call sites | Prefira `vscode_renameSymbol` para renames seguros |
| Adicionar campo obrigatório sem migration | Verifique orm-entity e crie migration antes de subir |
| Alterar DTO de resposta sem atualizar Swagger | Revise `*.swagger.ts` junto com o DTO |
| Modificar use case sem atualizar testes | Sempre execute `write-tests` como último passo antes do build |
