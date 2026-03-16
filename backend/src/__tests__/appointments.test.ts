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

function generateToken(payload = { id: '1', email: 'test@email.com', role: 'CLIENT' }) {
  return sign(payload, env.JWT_SECRET, { expiresIn: '1h' });
}

describe('Appointments Routes', () => {
  const token = generateToken();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/appointments', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({ title: 'Consulta', date: '2026-04-01T10:00:00Z' });

      expect(res.status).toBe(401);
      expect(res.body.message).toContain('Token');
    });

    it('deve retornar 401 com token inválido', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', 'Bearer token-invalido')
        .send({ title: 'Consulta', date: '2026-04-01T10:00:00Z' });

      expect(res.status).toBe(401);
    });

    it('deve retornar 422 com título vazio', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '', date: '2026-04-01T10:00:00Z' });

      expect(res.status).toBe(422);
    });

    it('deve retornar 422 com data inválida', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Consulta', date: 'data-invalida' });

      expect(res.status).toBe(422);
    });

    it('deve criar agendamento com sucesso', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.appointment.create.mockResolvedValue({
        id: '1',
        title: 'Consulta',
        description: null,
        date: new Date('2026-04-01T10:00:00Z'),
        status: 'PENDING',
        userId: '1',
        user: { id: '1', name: 'Test', email: 'test@email.com' },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Consulta', date: '2026-04-01T10:00:00Z' });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe('success');
      expect(res.body.data.title).toBe('Consulta');
      expect(res.body.data.status).toBe('PENDING');
    });

    it('deve criar agendamento com descrição', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.appointment.create.mockResolvedValue({
        id: '2',
        title: 'Mentoria',
        description: 'Sessão de coaching',
        date: new Date('2026-04-05T15:00:00Z'),
        status: 'PENDING',
        userId: '1',
        user: { id: '1', name: 'Test', email: 'test@email.com' },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Mentoria', description: 'Sessão de coaching', date: '2026-04-05T15:00:00Z' });

      expect(res.status).toBe(201);
      expect(res.body.data.description).toBe('Sessão de coaching');
    });
  });

  describe('GET /api/appointments', () => {
    it('deve retornar 401 sem autenticação', async () => {
      const res = await request(app).get('/api/appointments');
      expect(res.status).toBe(401);
    });

    it('deve listar agendamentos vazio', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.appointment.findMany.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('success');
      expect(res.body.data).toEqual([]);
    });

    it('deve listar múltiplos agendamentos', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.appointment.findMany.mockResolvedValue([
        { id: '1', title: 'A', date: new Date(), status: 'PENDING', userId: '1' },
        { id: '2', title: 'B', date: new Date(), status: 'CONFIRMED', userId: '1' },
      ]);

      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });
  });

  describe('GET /api/appointments/:id', () => {
    it('deve retornar 404 se não encontrar', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.appointment.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .get('/api/appointments/id-inexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
      expect(res.body.message).toContain('não encontrado');
    });

    it('deve retornar agendamento por ID', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.appointment.findUnique.mockResolvedValue({
        id: '1', title: 'Consulta', date: new Date(), status: 'PENDING',
        user: { id: '1', name: 'Test', email: 'test@email.com' },
      });

      const res = await request(app)
        .get('/api/appointments/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data.id).toBe('1');
    });
  });

  describe('DELETE /api/appointments/:id', () => {
    it('deve retornar 404 se agendamento não existir', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.appointment.findUnique.mockResolvedValue(null);

      const res = await request(app)
        .delete('/api/appointments/id-inexistente')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it('deve deletar agendamento com sucesso', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.appointment.findUnique.mockResolvedValue({ id: '1', title: 'Test' });
      prisma.appointment.delete.mockResolvedValue({});

      const res = await request(app)
        .delete('/api/appointments/1')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(204);
    });
  });
});
