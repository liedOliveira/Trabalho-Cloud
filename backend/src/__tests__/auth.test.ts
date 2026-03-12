import request from 'supertest';
import { app } from '../app';

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
  },
}));

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('deve retornar 422 se dados forem inválidos', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: '', email: 'invalido', password: '12' });

      expect(res.status).toBe(422);
      expect(res.body.status).toBe('error');
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
    });
  });

  describe('POST /api/auth/login', () => {
    it('deve retornar 422 se email for inválido', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'invalido', password: '123456' });

      expect(res.status).toBe(422);
    });

    it('deve retornar 401 se usuário não existir', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'naoexiste@email.com', password: '123456' });

      expect(res.status).toBe(401);
    });
  });
});

describe('Health Check', () => {
  it('deve retornar status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
