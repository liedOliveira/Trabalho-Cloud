# 📅 Sistema de Gestão e Reservas para Autônomos

> Trabalho acadêmico de **Desenvolvimento em Nuvem** — Full-stack monorepo com deploy automatizado.

---

## 🏗️ Arquitetura

```
┌──────────────┐       ┌──────────────────┐       ┌────────────────┐
│   Frontend   │──────▶│   Backend (API)  │──────▶│  PostgreSQL    │
│  React+Vite  │  HTTP │  Express + TS    │ Prisma│  (Supabase)    │
│  Tailwind v3 │◀──────│  JWT Auth        │◀──────│                │
└──────────────┘       └──────────────────┘       └────────────────┘
```

## 🚀 Stack

| Camada | Tecnologias |
|--------|------------|
| **Front-end** | React 18, Vite, TypeScript, Tailwind CSS v3, React Router, Axios |
| **Back-end** | Node.js, Express, TypeScript, Prisma v5, JWT, Zod, Swagger |
| **Banco de Dados** | PostgreSQL (Supabase) |
| **Testes** | Jest, Supertest, Vitest, React Testing Library |
| **DevOps** | Docker, Docker Compose, GitHub Actions CI/CD |

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter as seguintes ferramentas instaladas:

| Ferramenta | Versão mínima | Verificar |
|-----------|:------------:|-----------|
| **Node.js** | ≥ 18 | `node --version` |
| **npm** | ≥ 9 | `npm --version` |
| **Git** | qualquer | `git --version` |
| **Docker** *(opcional)* | ≥ 20 | `docker --version` |
| **Docker Compose** *(opcional)* | ≥ 2.0 | `docker compose version` |

---

## ⚡ Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/trabalho-cloud.git
cd trabalho-cloud
```

---

### 2. Configurar o Back-end

```bash
# Entrar na pasta do backend
cd backend

# Instalar todas as dependências
npm install

# Copiar o arquivo de variáveis de ambiente
cp .env.example .env
```

#### 2.1 Configurar as variáveis de ambiente

Edite o arquivo `backend/.env` com seus dados:

```env
# Servidor
PORT=3333
NODE_ENV=development

# Banco de Dados — cole a URL do seu Supabase ou PostgreSQL local
DATABASE_URL="postgresql://usuario:senha@host:5432/reservas_db?schema=public"

# JWT — troque a chave secreta
JWT_SECRET="sua-chave-secreta-aqui-mude-em-producao"
JWT_EXPIRES_IN="7d"
```

> **💡 Supabase:** Crie um projeto em [supabase.com](https://supabase.com), vá em **Settings → Database** e copie a **Connection String (URI)**.

#### 2.2 Gerar o Prisma Client e criar as tabelas

```bash
# Gerar o client do Prisma (necessário antes de executar)
npx prisma generate

# Criar as tabelas no banco de dados
npx prisma migrate dev --name init

# (Opcional) Popular o banco com dados de exemplo
npm run db:seed
```

> **📋 Credenciais do seed:**
> - Admin: `admin@agendapro.com` / `admin123`
> - Cliente: `maria@email.com` / `cliente123`
> - Cliente: `carlos@email.com` / `cliente123`

#### 2.3 Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O backend estará disponível em: **http://localhost:3333**

Documentação Swagger: **http://localhost:3333/api-docs**

---

### 3. Configurar o Front-end

```bash
# Voltar para a raiz e entrar na pasta do frontend
cd ../frontend

# Instalar todas as dependências
npm install

# Iniciar o servidor de desenvolvimento
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

> **⚙️ Variável de ambiente (opcional):** Para apontar para outra URL de API, crie `frontend/.env`:
> ```env
> VITE_API_URL=http://localhost:3333/api
> ```

---

### 4. Executar com Docker Compose (alternativa)

Se preferir subir tudo via Docker (API + PostgreSQL local):

```bash
# Na raiz do projeto
cp backend/.env.example backend/.env

# Editar o .env com a URL do banco Docker:
# DATABASE_URL="postgresql://reservas:reservas123@db:5432/reservas_db?schema=public"

# Subir os containers
docker compose up -d

# Verificar se estão rodando
docker compose ps
```

Isso sobe:
- **API** em `http://localhost:3333`
- **PostgreSQL** em `localhost:5432` (user: `reservas`, senha: `reservas123`, db: `reservas_db`)

Para parar: `docker compose down`

---

## 🧪 Testes

```bash
# Testes do Back-end (32 testes — Jest + Supertest)
cd backend
npm test

# Testes do Front-end (9 testes — Vitest + React Testing Library)
cd ../frontend
npm test
```

---

## 📡 Rotas da API

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
| GET | `/api/health` | ✗ | Health check da API |
| POST | `/api/auth/register` | ✗ | Cadastro de usuário |
| POST | `/api/auth/login` | ✗ | Login → retorna JWT |
| GET | `/api/users` | ✓ | Listar usuários |
| GET | `/api/users/:id` | ✓ | Detalhe do usuário |
| PUT | `/api/users/:id` | ✓ | Atualizar usuário |
| DELETE | `/api/users/:id` | ✓ | Remover usuário |
| POST | `/api/appointments` | ✓ | Criar agendamento |
| GET | `/api/appointments` | ✓ | Listar agendamentos |
| GET | `/api/appointments/:id` | ✓ | Detalhe do agendamento |
| PUT | `/api/appointments/:id` | ✓ | Atualizar agendamento |
| DELETE | `/api/appointments/:id` | ✓ | Cancelar agendamento |

---

## 🛠️ Scripts Disponíveis

### Back-end (`cd backend`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (hot-reload) |
| `npm run build` | Compilar TypeScript para `dist/` |
| `npm start` | Executar build de produção |
| `npm test` | Executar testes com Jest |
| `npm run prisma:generate` | Gerar o Prisma Client |
| `npm run prisma:migrate` | Criar/executar migrations |
| `npm run prisma:studio` | Interface visual do banco |
| `npm run db:seed` | Popular o banco com dados de exemplo |

### Front-end (`cd frontend`)

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção para `dist/` |
| `npm run preview` | Pré-visualizar build de produção |
| `npm test` | Executar testes com Vitest |
| `npm run lint` | Verificar qualidade do código (ESLint) |

---

## 📂 Estrutura do Projeto

```
.
├── .github/workflows/ci-cd.yml      # Pipeline CI/CD (3 jobs)
├── docker-compose.yml                # API + PostgreSQL
├── scripts/
│   ├── deploy-backend.sh             # Deploy Docker do backend
│   └── deploy-frontend.sh            # Deploy Vercel/Netlify do frontend
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma             # Modelos: User, Appointment
│   │   └── seed.ts                   # Dados de exemplo
│   ├── src/
│   │   ├── config/env.ts             # Variáveis de ambiente (Zod)
│   │   ├── lib/prisma.ts             # Prisma Client singleton
│   │   ├── middlewares/              # auth, errorHandler, validate
│   │   ├── modules/                  # auth, users, appointments
│   │   ├── utils/                    # AppError, logger
│   │   ├── __tests__/                # 32 testes automatizados
│   │   ├── app.ts                    # Express app
│   │   └── server.ts                 # Bootstrap
│   ├── Dockerfile                    # Multi-stage build
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/               # Layout, ProtectedRoute, etc.
│   │   ├── contexts/AuthContext.tsx   # Gerenciamento de autenticação
│   │   ├── pages/                    # Login, Register, Dashboard, etc.
│   │   ├── services/                 # api.ts, apiService.ts
│   │   ├── types/                    # Interfaces TypeScript
│   │   ├── __tests__/                # 9 testes automatizados
│   │   └── App.tsx                   # Rotas da aplicação
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── package.json
└── README.md
```

---

## ✅ Requisitos Atendidos

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

## 📝 Licença

Projeto acadêmico — uso educacional.
