import request from 'supertest';
import jsonwebtoken from 'jsonwebtoken';
import { app } from '../app';
import { env } from '../config/env';

const { sign } = jsonwebtoken;

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

function generateToken(payload = { id: '1', email: 'test@email.com', role: 'ADMIN' }) {
  return sign(payload, env.JWT_SECRET, { expiresIn: '1h' });
}

describe('Users Routes', () => {
  const token = generateToken();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/users');
      expect(res.status).toBe(401);
    });

    it('deve listar todos os usuários', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findMany.mockResolvedValue([
        { id: '1', name: 'Admin', email: 'admin@test.com', role: 'ADMIN', createdAt: new Date(), updatedAt: new Date() },
        { id: '2', name: 'User', email: 'user@test.com', role: 'CLIENT', createdAt: new Date(), updatedAt: new Date() },
      ]);

      const res = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/users/:id', () => {
    it('deve retornar 404 se usuário não existir', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/users/id-inexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('não encontrado');
    });

    it('deve retornar usuário por ID', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findUnique.mockResolvedValue({
        id: '1', name: 'Admin', email: 'admin@test.com',
        role: 'ADMIN', createdAt: new Date(), updatedAt: new Date(),
      });

      const res = await request(app)
        .get('/api/users/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('1');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('deve atualizar nome do usuário', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findUnique.mockResolvedValue({
        id: '1', name: 'Old Name', email: 'admin@test.com',
        role: 'ADMIN', createdAt: new Date(), updatedAt: new Date(),
      });
      prisma.user.update.mockResolvedValue({
        id: '1', name: 'New Name', email: 'admin@test.com',
        role: 'ADMIN', createdAt: new Date(), updatedAt: new Date(),
      });

      const res = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'New Name' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('New Name');
    });

    it('deve rejeitar email inválido na atualização', async () => {
      const res = await request(app)
        .put('/api/users/1')
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalido' });

      expect(res.status).toBe(422);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('deve retornar 404 se usuário não existir', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/users/id-inexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('deve deletar usuário com sucesso', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.user.findUnique.mockResolvedValue({ id: '1', name: 'Admin' });
      prisma.user.delete.mockResolvedValue({});

      const res = await request(app)
        .delete('/api/users/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
    });
  });
});
