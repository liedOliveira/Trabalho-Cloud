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
| **Docker** *(opcional)* | >= 20 | `docker --version` |
| **Docker Compose** *(opcional)* | >= 2.0 | `docker compose version` |

---

## Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/liedOliveira/Trabalho-Cloud.git
cd Trabalho-Cloud
```

---

### 2. Configurar o Back-end

```bash
cd backend

# Instalar dependências
npm install

# Copiar arquivo de variáveis de ambiente
cp .env.example .env
```

#### 2.1 Configurar o `.env`

Edite `backend/.env` com seus dados reais:

```env
PORT=3333
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

# Cole a URL do seu Supabase ou PostgreSQL local
DATABASE_URL="postgresql://usuario:senha@host:5432/reservas_db?schema=public"

# Troque a chave secreta
JWT_SECRET="sua-chave-secreta-aqui"
JWT_EXPIRES_IN="7d"
```

> **Supabase:** Para pegar a URL, acesse [supabase.com](https://supabase.com) > Settings > Database > Connection String (URI).

#### 2.2 Gerar o Prisma Client e criar as tabelas

```bash
npx prisma generate
npx prisma migrate dev --name init

# Popular o banco com dados de exemplo (opcional)
npm run db:seed
```

Credenciais do seed:
- Admin: `admin@agendapro.com` / `admin123`
- Cliente: `maria@email.com` / `cliente123`
- Cliente: `carlos@email.com` / `cliente123`

#### 2.3 Iniciar o servidor

```bash
npm run dev
```

O backend roda em **http://localhost:3333** e a documentação Swagger em **http://localhost:3333/api-docs**

---

### 3. Configurar o Front-end

```bash
cd ../frontend
npm install
npm run dev
```

O frontend roda em **http://localhost:5173**

Se quiser apontar para outra URL de API, crie `frontend/.env`:
```env
VITE_API_URL=http://localhost:3333/api
```

---

### 4. Executar com Docker Compose (alternativa)

```bash
# Na raiz do projeto
cp backend/.env.example backend/.env

# No .env, ajuste a DATABASE_URL para o container:
# DATABASE_URL="postgresql://reservas:reservas123@db:5432/reservas_db?schema=public"

docker compose up -d
docker compose ps
```

Sobe a API em `http://localhost:3333` e o PostgreSQL em `localhost:5432`.

Para parar: `docker compose down`

---

## Testes

```bash
# Back-end (32 testes com Jest + Supertest)
cd backend
npm test

# Front-end (9 testes com Vitest + RTL)
cd ../frontend
npm test
```

---

## Rotas da API

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
