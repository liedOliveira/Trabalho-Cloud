import request from 'supertest';
import { app } from '../app';
import bcryptjs from 'bcryptjs';

const { hash } = bcryptjs;

// Mock do Prisma
jest.mock('../lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    appointment: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
    $on: jest.fn(),
    $disconnect: jest.fn(),
  },
  checkDatabaseConnection: jest.fn().mockResolvedValue(true),
}));

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('deve retornar 422 se o nome for muito curto', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'A', email: 'valido@email.com', password: '123456' });

      expect(res.status).toBe(422);
      expect(res.body.status).toBe('error');
    });

    it('deve retornar 422 se o email for inválido', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'invalido', password: '123456' });

      expect(res.status).toBe(422);
    });

    it('deve retornar 422 se a senha for muito curta', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@email.com', password: '12' });

      expect(res.status).toBe(422);
    });

    it('deve retornar 409 se o e-mail já estiver cadastrado', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'test@email.com' });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@email.com', password: '123456' });

      expect(res.status).toBe(409);
      expect(res.body.message).toContain('já cadastrado');
    });

    it('deve retornar 201 ao cadastrar com sucesso', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findUnique.mockResolvedValue(null);
      prisma.user.create.mockResolvedValue({
        id: '1',
        name: 'Test User',
        email: 'test@email.com',
        role: 'CLIENT',
        createdAt: new Date(),
      });

      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test User', email: 'test@email.com', password: '123456' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.email).toBe('test@email.com');
      expect(res.body.data).not.toHaveProperty('password');
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve retornar 422 se email for inválido', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalido', password: '123456' });

      expect(res.status).toBe(422);
    });

    it('deve retornar 422 se senha estiver vazia', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@email.com', password: '' });

      expect(res.status).toBe(422);
    });

    it('deve retornar 401 se usuário não existir', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'naoexiste@email.com', password: '123456' });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Credenciais');
    });

    it('deve retornar 401 se a senha estiver errada', async () => {
      const { prisma } = require('../lib/prisma');
      const hashed = await hash('senhaCorreta', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: '1', name: 'User', email: 'test@email.com',
        password: hashed, role: 'CLIENT',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@email.com', password: 'senhaErrada' });

      expect(res.status).toBe(401);
    });

    it('deve retornar 200 com token JWT ao logar com sucesso', async () => {
      const { prisma } = require('../lib/prisma');
      const hashed = await hash('senha123', 10);
      prisma.user.findUnique.mockResolvedValue({
        id: '1', name: 'User', email: 'test@email.com',
        password: hashed, role: 'CLIENT',
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'test@email.com', password: 'senha123' });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('token');
      expect(res.body.data.user.email).toBe('test@email.com');
      expect(res.body.data.user).not.toHaveProperty('password');
    });
  });
});

describe('Health Check', () => {
  it('deve retornar status ok com timestamp', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });
});
