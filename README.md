# Masar

Plataforma de chatbots com IA para gerenciamento de múltiplos bots, base de conhecimento e integração com modelos GPT da OpenAI.

Construído com **NestJS**, seguindo **Clean Architecture**, **DDD** e princípios **SOLID**.

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | NestJS 11 + TypeScript 5 |
| Banco de dados | MySQL + TypeORM 0.3 |
| Cache | Redis (ioredis) |
| Fila de mensagens | RabbitMQ (amqplib) |
| IA | OpenAI SDK (GPT) |
| Autenticação | JWT + Passport + PBKDF2 |
| E-mail | Nodemailer |
| Documentação | Swagger / OpenAPI |
| Testes | Jest + Supertest |

## Módulos

| Módulo | Responsabilidade |
|---|---|
| `auth` | Login, registro, refresh token e confirmação de e-mail |
| `user` | Criação de conta e alteração de senha |
| `bot` | Criação e gerenciamento de chatbots por usuário |
| `chat` | Sessões de chat e processamento assíncrono de mensagens via RabbitMQ |
| `agent` | Integração com OpenAI: listagem e sincronização de modelos GPT |
| `knowledge` | Base de conhecimento vinculada a cada bot |
| `email` | Envio de e-mails transacionais via Nodemailer |

## Arquitetura

```
src/
├── modules/<modulo>/
│   ├── api/controllers/      # Controllers HTTP (NestJS)
│   ├── application/
│   │   ├── use-cases/        # Casos de uso (orquestração)
│   │   ├── dto/              # DTOs de entrada e saída
│   │   └── ports/            # Interfaces/contratos (ex: IUserRepository)
│   ├── domain/
│   │   ├── entities/         # Entidades de domínio
│   │   ├── props/            # Tipos de propriedades
│   │   └── value-objects/    # Value Objects imutáveis
│   └── infra/
│       ├── orm-entities/     # Entidades TypeORM
│       ├── repositories/     # Implementações dos ports
│       └── mapper/           # Conversão domain ↔ ORM
└── common/                   # Guards, utils, ports e types compartilhados
```

**Regra de dependência:** `api → application → domain`. A camada `infra` implementa ports definidos em `application`.

## Endpoints da API

A documentação interativa está disponível em `http://localhost:3000/api/docs` após iniciar o servidor.

### Rotas públicas

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/auth/login` | Autenticação com e-mail e senha |
| `POST` | `/auth/register` | Cadastro de novo usuário |
| `POST` | `/auth/refresh` | Renovação do access token |
| `POST` | `/auth/confirm-email` | Confirmação de e-mail |

### Rotas protegidas (requer JWT)

| Método | Rota | Descrição |
|---|---|---|
| `PATCH` | `/users/password` | Alteração de senha |
| `POST` | `/bots` | Criar bot |
| `GET` | `/bots` | Listar bots do usuário |
| `PATCH` | `/bots/:id` | Atualizar bot |
| `DELETE` | `/bots/:id` | Remover bot |
| `POST` | `/chats` | Iniciar sessão de chat |
| `POST` | `/chats/incoming-message` | Enviar mensagem |
| `POST` | `/agent/chat` | Chat direto com agente IA |
| `GET` | `/agent/models` | Listar modelos GPT disponíveis |
| `POST` | `/agent/sync-models` | Sincronizar modelos com a OpenAI |
| `POST` | `/knowledge/create-knowledge` | Criar entrada na base de conhecimento |
| `PATCH` | `/knowledge/update-knowledge/:id` | Atualizar conhecimento |
| `DELETE` | `/knowledge/delete-knowledge/:id` | Remover conhecimento |
| `GET` | `/knowledge/get-knowledge/:id` | Buscar conhecimento |

## Configuração

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Servidor
PORT=3000

# Banco de dados (MySQL)
DB_HOST=
DB_PORT=3306
DB_USER=
DB_PASSWORD=
DB_DATABASE=
DB_SYNCHRONIZE=false
DB_MIGRATIONS_RUN=true

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=15m

# Redis
REDIS_HOST=
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_URL=

# OpenAI
OPENAI_API_KEY=

# E-mail (SMTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

### Instalação

```bash
yarn install
```

## Execução

```bash
# Desenvolvimento com watch
yarn start:dev

# Produção
yarn build
yarn start:prod
```

## Testes

```bash
# Testes unitários
yarn test

# Cobertura de testes
yarn test:cov

# Testes e2e
yarn test:e2e
```

## Lint

```bash
yarn lint
```
