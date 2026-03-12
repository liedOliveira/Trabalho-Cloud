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
| **Back-end** | Node.js, Express, TypeScript, Prisma, JWT, Zod, Swagger |
| **Banco de Dados** | PostgreSQL (Supabase) |
| **Testes** | Jest, Supertest, Vitest, React Testing Library |
| **DevOps** | Docker, GitHub Actions CI/CD |

## 📋 Pré-requisitos

- Node.js ≥ 18
- npm ≥ 9
- Docker (para build de produção)
- Git

## ⚡ Como Executar

### Back-end

```bash
cd backend
cp .env.example .env      # preencha DATABASE_URL e JWT_SECRET
npm install
npx prisma generate
npm run dev                # http://localhost:3333
```

Documentação Swagger: [http://localhost:3333/api-docs](http://localhost:3333/api-docs)

### Front-end

```bash
cd frontend
npm install
npm run dev                # http://localhost:5173
```

### Docker (Back-end)

```bash
cd backend
docker build -t reservas-api .
docker run -p 3333:3333 --env-file .env reservas-api
```

## 🧪 Testes

```bash
# Back-end
cd backend && npm test

# Front-end
cd frontend && npm test
```

## 📡 Rotas da API

| Método | Rota | Auth | Descrição |
|--------|------|:----:|-----------|
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

## 📂 Estrutura do Projeto

```
.
├── .github/workflows/ci-cd.yml   # Pipeline CI/CD
├── backend/                       # API RESTful (Express + TS)
│   ├── prisma/schema.prisma
│   ├── src/
│   │   ├── modules/               # auth, users, appointments
│   │   ├── middlewares/
│   │   └── ...
│   ├── Dockerfile
│   └── package.json
├── frontend/                      # SPA (React + Vite)
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   └── ...
│   └── package.json
└── README.md
```

## ✅ Requisitos Atendidos

- [x] API RESTful com CRUD completo
- [x] Autenticação e autorização (JWT)
- [x] Validação de dados (Zod)
- [x] Tratamento global de erros
- [x] Variáveis de ambiente protegidas
- [x] Logs de acesso e erro (Morgan + Winston)
- [x] Documentação Swagger (`/api-docs`)
- [x] Dockerfile otimizado (multi-stage)
- [x] Front-end com estados de carregamento e erro
- [x] Testes automatizados (back e front)
- [x] CI/CD com GitHub Actions

## 📝 Licença

Projeto acadêmico — uso educacional.
