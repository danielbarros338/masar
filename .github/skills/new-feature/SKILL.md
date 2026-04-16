---
name: new-feature
description: "Guia de escrita de código limpo e moderno para novas features. Use quando: estiver implementando uma nova funcionalidade; quiser garantir código legível, simples e idiomático em TypeScript/NestJS; revisar se o código segue boas práticas de legibilidade e modernidade. Aplica princípios de clean code, ES moderno e padrões NestJS atuais."
argument-hint: "Descrição da feature a implementar (ex: criar use case de autenticação)"
---

# Clean Modern Code

Garante que novas features sejam escritas de forma legível, simples e usando os recursos mais modernos do TypeScript e NestJS.

## Quando Usar

- Ao implementar qualquer nova feature no projeto
- Ao revisar código existente quanto à legibilidade e modernidade
- Quando o código estiver funcionando mas parecer verboso ou difícil de ler

## Princípios

### Legibilidade acima de tudo

- **Nomes revelam intenção**: variáveis, funções e classes devem descrever o que são/fazem sem precisar de comentário.
- **Funções pequenas**: cada função faz uma única coisa. Se precisar de um comentário para explicar o que ela faz, renomeie-a.
- **Evite abreviações**: `userRepository` em vez de `usrRepo`; `isActive` em vez de `isAct`.
- **Booleanos lêem como perguntas**: `isValid`, `hasPermission`, `canDelete`.

### Simplicidade

- **Não antecipe complexidade**: implemente apenas o que foi pedido. YAGNI (You Aren't Gonna Need It).
- **Evite over-engineering**: sem abstrações extras, sem generics desnecessários, sem padrões por padrões.
- **Early return reduz indentação**: retorne cedo em condições de guarda em vez de aninhar `if/else`.
- **Desestruturação**: extraia apenas o que usa — `const { id, name } = user`.

### TypeScript Moderno

| Evitar | Preferir |
|---|---|
| `as any` | Tipo correto ou `unknown` com narrowing |
| `interface` para objetos puros de dados | `type` |
| `function` declarations soltas | Arrow functions ou métodos de classe |
| `Promise<void>` com `.then()` | `async/await` |
| `||` para fallback de valores | `??` (nullish coalescing) |
| `if (x !== null && x !== undefined)` | `if (x != null)` ou optional chaining `x?.prop` |
| Enum numérico | `const` enum ou union de strings `'admin' \| 'user'` |
| Loop `for` com índice | `for...of`, `.map()`, `.filter()`, `.find()` |

### NestJS Moderno

- Use **decorators** do NestJS semânticamente: `@Injectable()`, `@Controller()`, `@Get()`, etc.
- **Injeção via construtor** com `readonly`: `constructor(private readonly userRepo: IUserRepository) {}`
- **Guards e Interceptors** em vez de lógica repetida em controllers.
- **`@HttpCode`** e **`@Header`** em vez de manipular `res` diretamente.
- Prefira **`ConfigService`** para variáveis de ambiente em vez de `process.env` direto.

## Procedimento ao Implementar uma Feature

### 1. Entender o escopo

Leia o pedido e identifique:
- Qual camada será criada/modificada (domain, application, infra, api)
- Quais entidades/value objects envolvidos
- Quais casos de uso necessários

### 2. Escrever de fora para dentro

Comece pela interface pública (port/DTO/controller) antes de implementar detalhes internos. Isso força clareza na API antes do código.

### 3. Checklist de escrita

Antes de finalizar cada arquivo, verifique:

- [ ] Cada nome de variável/função/classe é autoexplicativo?
- [ ] Existe algum bloco que poderia ser extraído para uma função com nome melhor?
- [ ] Existe `any`, `as unknown`, ou cast desnecessário?
- [ ] Existe algum `Promise.then()` que poderia ser `await`?
- [ ] Existe algum `if/else` aninhado que poderia virar early return?
- [ ] Existe código duplicado que já existe em outro lugar do módulo?
- [ ] Os tipos estão tão restritos quanto possível (sem `string` onde poderia ser union)?
- [ ] Está usando `??` e `?.` onde cabem em vez de verificações manuais de nulidade?
- [ ] A operação de escrita afeta **mais de uma tabela**? Se sim, use `ITransactionManager.run()` — veja `.github/instructions/transactions.instructions.md`.

### 4. Revisão de legibilidade

Leia o código como se fosse a primeira vez. Se alguma linha exigir pausa para entender, refatore-a.

### 5. Executar a skill `code-review-fix`

Após implementar, acione `/code-review-fix` para garantir zero erros de compilação e lint.

## Exemplos

### Ruim vs. Bom

```typescript
// ❌ Ruim — verboso, sem intenção clara
async function proc(u: any) {
  if (u !== null && u !== undefined) {
    if (u.isActive === true) {
      return await repo.save(u);
    } else {
      return null;
    }
  }
}

// ✅ Bom — legível, moderno, simples
async function persistActiveUser(user: UserEntity): Promise<UserEntity | null> {
  if (!user?.isActive) return null;
  return userRepository.save(user);
}
```

```typescript
// ❌ Ruim — loop imperativo com índice
const names: string[] = [];
for (let i = 0; i < users.length; i++) {
  names.push(users[i].name);
}

// ✅ Bom — declarativo
const names = users.map((user) => user.name);
```

```typescript
// ❌ Ruim — injeção sem readonly, tipo genérico
constructor(private userRepo: any) {}

// ✅ Bom — port tipado, readonly
constructor(private readonly userRepository: IUserRepository) {}
```
