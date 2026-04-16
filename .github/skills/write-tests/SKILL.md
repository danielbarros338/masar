---
name: write-tests
description: "Escreve ou atualiza testes automatizados após criar, editar ou remover uma funcionalidade. Use quando: finalizar uma nova feature; modificar um use case, entidade ou value object existente; remover código que tinha cobertura de testes; quiser garantir cobertura de testes unitários e de integração antes de commitar."
argument-hint: "Arquivo ou funcionalidade que foi criada/editada/removida (ex: src/user/application/use-cases/create-user.use-case.ts)"
---

# Write Tests

Garante cobertura de testes automatizados sempre que uma funcionalidade é criada, modificada ou removida.

## Quando Usar

- Após criar um novo use case, entidade, value object, mapper ou controller
- Após modificar a lógica de qualquer uma dessas peças
- Após remover código — para deletar os testes correspondentes e verificar que nenhum teste quebrou
- Antes de commitar qualquer alteração funcional

## O que Testar por Camada

### Domain — Entidades e Value Objects

- Criação com dados válidos → deve instanciar sem erro
- Criação com dados inválidos → deve lançar exceção com mensagem clara
- Regras de negócio internas (ex: `user.activate()`, `email.isValid()`)
- Value Objects: imutabilidade, igualdade por valor

### Application — Use Cases

- **Happy path**: execução com inputs válidos retorna o resultado esperado
- **Sad paths**: cada condição de erro (entidade não encontrada, regra violada, etc.) retorna a resposta correta
- Verificar que os ports (repositórios, providers) foram chamados com os argumentos corretos
- Usar mocks/stubs para todas as dependências externas (ports)

### Infra — Repositórios e Mappers

- **Mappers**: `toDomain()` e `toPersistence()` convertem corretamente todos os campos
- **Repositórios**: testar apenas se houver lógica além do ORM (ex: queries customizadas)

### API — Controllers

- Testar que o controller chama o use case correto com os parâmetros corretos
- Testar os status HTTP retornados para cada cenário
- Não testar lógica de negócio — ela pertence ao use case

## Procedimento

### 1. Identificar o escopo

Liste os arquivos que foram criados, modificados ou removidos. Para cada um, determine qual camada pertence e o que deve ser testado conforme a tabela acima.

### 2. Localizar ou criar o arquivo de teste

Convenção de localização:

```
src/<module>/domain/entities/user.entity.ts
src/<module>/domain/entities/user.entity.spec.ts   ← mesmo diretório

src/<module>/application/use-cases/create-user.use-case.ts
src/<module>/application/use-cases/create-user.use-case.spec.ts
```

Se o arquivo de teste já existir, atualize-o. Se não existir, crie-o no mesmo diretório do arquivo testado.

### 3. Estrutura base de cada arquivo de teste

```typescript
describe('NomeDaClasse', () => {
  // Arrange compartilhado
  let sut: NomeDaClasse; // System Under Test

  beforeEach(() => {
    // setup
  });

  describe('nomeDoMetodo', () => {
    it('should <comportamento esperado> when <condição>', async () => {
      // Arrange
      // Act
      // Assert
    });
  });
});
```

### 4. Mockar dependências externas

Use `jest.fn()` para ports e providers:

```typescript
const mockUserRepository: jest.Mocked<IUserRepository> = {
  findById: jest.fn(),
  save: jest.fn(),
};
```

Nunca acesse banco de dados real em testes unitários.

### 5. Cobrir os cenários obrigatórios

Para cada use case/entidade modificada, garanta ao menos:

- [ ] Happy path (fluxo principal com sucesso)
- [ ] Cada sad path documentado no use case (lançamentos de exceção, retornos nulos)
- [ ] Verificação de chamadas aos mocks (`expect(mock.save).toHaveBeenCalledWith(...)`)

### 6. Executar os testes

```bash
yarn test                        # todos os testes
yarn test --testPathPattern src/<module>   # apenas o módulo alterado
yarn test:cov                    # verificar cobertura
```

### 7. Verificar cobertura mínima

- **Use Cases**: 100% de branches (todos os `if`/`throw` cobertos)
- **Entidades e Value Objects**: 100% de linhas
- **Mappers**: 100% de linhas
- **Controllers**: happy path + ao menos um sad path

### 8. Corrigir falhas

Se algum teste falhar após a mudança (regressão), investigue se:
- A lógica foi alterada intencionalmente → atualize o teste
- A lógica foi alterada por acidente → corrija o código

### 9. Remover testes órfãos

Se código foi removido, delete ou atualize os arquivos `.spec.ts` correspondentes para não deixar testes que referenciam código inexistente.

## Critérios de Conclusão

- [ ] Todo arquivo modificado/criado tem um `.spec.ts` correspondente
- [ ] Happy path coberto em todos os use cases
- [ ] Todos os sad paths (exceções, edge cases) cobertos
- [ ] `yarn test` executa sem falhas
- [ ] Nenhum teste usa `any` ou suprime erros TypeScript
- [ ] Nenhum teste acessa serviços externos reais (banco, HTTP, filesystem)
