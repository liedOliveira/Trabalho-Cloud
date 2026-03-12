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
  },
}));

function generateToken(payload = { id: '1', email: 'test@email.com', role: 'CLIENT' }) {
  return sign(payload, env.JWT_SECRET, { expiresIn: '1h' });
}

describe('Appointments Routes', () => {
  const token = generateToken();

  describe('POST /api/appointments', () => {
    it('deve retornar 401 sem token', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .send({ title: 'Consulta', date: '2026-04-01T10:00:00Z' });

      expect(res.status).toBe(401);
    });

    it('deve retornar 422 com dados inválidos', async () => {
      const res = await request(app)
        .post('/api/appointments')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: '', date: 'data-invalida' });

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
      expect(res.body.data.title).toBe('Consulta');
    });
  });

  describe('GET /api/appointments', () => {
    it('deve listar agendamentos com autenticação', async () => {
      const { prisma } = require('../lib/prisma');
      prisma.appointment.findMany.mockResolvedValue([]);

      const res = await request(app)
        .get('/api/appointments')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });
  });
});
