# Sistema de Gestão e Reservas para Autônomos

> Trabalho acadêmico de **Desenvolvimento em Nuvem** — Full-stack monorepo com deploy automatizado.

---

## Arquitetura

```
┌──────────────┐       ┌──────────────────┐       ┌────────────────┐
│   Frontend   │──────>│   Backend (API)  │──────>│  PostgreSQL    │
│  React+Vite  │  HTTP │  Express + TS    │ Prisma│  (Supabase)    │
│  Tailwind v3 │<──────│  JWT Auth        │<──────│                │
└──────────────┘       └──────────────────┘       └────────────────┘
```

## Stack utilizada

| Camada | Tecnologias |
|--------|------------|
| **Front-end** | React 18, Vite, TypeScript, Tailwind CSS v3, React Router, Axios |
| **Back-end** | Node.js, Express, TypeScript, Prisma v5, JWT, Zod, Swagger |
| **Banco de Dados** | PostgreSQL (Supabase) |
| **Testes** | Jest, Supertest, Vitest, React Testing Library |
| **DevOps** | Docker, Docker Compose, GitHub Actions CI/CD |

---

## Pré-requisitos

| Ferramenta | Versão mínima | Verificar |
|-----------|:------------:|-----------|
| **Node.js** | >= 18 | `node --version` |
| **npm** | >= 9 | `npm --version` |
| **Git** | qualquer | `git --version` |

---

## Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/liedOliveira/Trabalho-Cloud.git
cd Trabalho-Cloud
```

### 2. Configurar o Back-end

Abra um terminal na raiz do projeto e execute:

```bash
cd backend
npm install
```

Depois, crie o arquivo de variáveis de ambiente. Copie o exemplo:

- **Linux/Mac:** `cp .env.example .env`
- **Windows (PowerShell):** `Copy-Item .env.example .env`
- **Windows (Git Bash):** `cp .env.example .env`

#### 2.1 Editar o `.env`

Abra o arquivo `backend/.env` no editor e preencha com seus dados:

```env
PORT=3333
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Substitua pela URL do seu banco Supabase ou PostgreSQL local
DATABASE_URL="postgresql://usuario:senha@host:5432/reservas_db?schema=public"

# Troque por uma chave secreta própria
JWT_SECRET="minha-chave-secreta-123"
JWT_EXPIRES_IN="7d"
```

**Como pegar a URL do Supabase:**
1. Acesse [supabase.com](https://supabase.com) e entre no seu projeto
2. Vá em **Settings > Database**
3. Copie a **Connection String (URI)** e cole no `DATABASE_URL`

#### 2.2 Gerar o Prisma Client e criar as tabelas

Ainda dentro da pasta `backend/`, rode:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

#### 2.3 Iniciar o servidor

```bash
npm run dev
```

Se tudo der certo, o terminal vai mostrar:

```
info: Server running on http://localhost:3333
info: Swagger docs at http://localhost:3333/api-docs
info: Environment: development
```

O terminal vai ficar "parado" — isso é normal, o servidor está rodando e esperando requisições. **Não feche esse terminal.**

---

### 3. Configurar o Front-end

Abra **outro terminal** (mantenha o backend rodando) na raiz do projeto:

```bash
cd frontend
npm install
npm run dev
```

O frontend vai abrir em **http://localhost:5173**

> Se a API estiver em outra URL, crie um arquivo `frontend/.env` com:
> ```env
> VITE_API_URL=http://localhost:3333/api
> ```

---

### 4. Testar a aplicação

1. Acesse **http://localhost:5173** no navegador
2. Faça login com as credenciais do seed (ex: `admin@agendapro.com` / `admin123`)
3. Acesse o Dashboard e a página de Agendamentos

---

## Testes automatizados

Os testes não precisam do servidor rodando — usam mocks.

```bash
# Back-end (32 testes)
cd backend
npm test

# Front-end (9 testes)
cd frontend
npm test
```

> Os logs do backend durante os testes podem mostrar mensagens de erro em vermelho (ex: "Credenciais inválidas"). Isso é **normal** — são os testes verificando que os erros são tratados corretamente. O que importa é o resultado final: `Tests: 32 passed, 32 total`.

---

## Rotas da API

A documentação completa com exemplos está disponível no Swagger: **http://localhost:3333/api-docs**

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| GET | `/api/health` | Não | Health check |
| POST | `/api/auth/register` | Não | Cadastro |
| POST | `/api/auth/login` | Não | Login (retorna JWT) |
| GET | `/api/users` | Sim | Listar usuários |
| GET | `/api/users/:id` | Sim | Buscar usuário |
| PUT | `/api/users/:id` | Sim | Atualizar usuário |
| DELETE | `/api/users/:id` | Sim | Remover usuário |
| POST | `/api/appointments` | Sim | Criar agendamento |
| GET | `/api/appointments` | Sim | Listar agendamentos |
| GET | `/api/appointments/:id` | Sim | Buscar agendamento |
| PUT | `/api/appointments/:id` | Sim | Atualizar agendamento |
| DELETE | `/api/appointments/:id` | Sim | Remover agendamento |

---

## Scripts disponíveis

### Back-end (`cd backend`)

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Inicia com hot-reload |
| `npm run build` | Compila pra `dist/` |
| `npm start` | Roda a build de produção |
| `npm test` | Roda os testes |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:migrate` | Executa migrations |
| `npm run prisma:studio` | Abre interface visual do banco |
| `npm run db:seed` | Popula o banco com dados de teste |

### Front-end (`cd frontend`)

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Dev server (Vite) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview da build |
| `npm test` | Roda os testes |
| `npm run lint` | Lint com ESLint |

---

## Estrutura do Projeto

```
.
├── .github/workflows/ci-cd.yml
├── docker-compose.yml
├── scripts/
│   ├── deploy-backend.sh
│   └── deploy-frontend.sh
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── src/
│   │   ├── config/env.ts
│   │   ├── lib/prisma.ts
│   │   ├── middlewares/
│   │   ├── modules/
│   │   ├── utils/
│   │   ├── __tests__/
│   │   ├── app.ts
│   │   └── server.ts
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── contexts/AuthContext.tsx
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── __tests__/
│   │   └── App.tsx
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## Requisitos atendidos

- [x] API RESTful com CRUD completo
- [x] Autenticação e autorização (JWT)
- [x] Validação de dados (Zod)
- [x] Tratamento global de erros
- [x] Variáveis de ambiente protegidas
- [x] Logs de acesso e erro (Morgan + Winston)
- [x] Documentação Swagger (`/api-docs`)
- [x] Dockerfile otimizado (multi-stage)
- [x] Docker Compose (API + PostgreSQL)
- [x] Front-end com estados de carregamento e erro
- [x] Testes automatizados (32 backend + 9 frontend)
- [x] CI/CD com GitHub Actions (3 jobs)
- [x] Scripts de deploy automatizado

## Licença

Projeto acadêmico — uso educacional.
