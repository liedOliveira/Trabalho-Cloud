import { PrismaClient } from '@prisma/client';
import { env } from '../config/env';
import { logger } from '../utils/logger';

const prisma = new PrismaClient({
  log:
    env.NODE_ENV === 'development'
      ? [
          { emit: 'event', level: 'query' },
          { emit: 'event', level: 'error' },
          { emit: 'event', level: 'warn' },
        ]
      : [{ emit: 'event', level: 'error' }],
});

// Log de queries em desenvolvimento
if (env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug(`Prisma Query: ${e.query} — ${e.duration}ms`);
  });
}

prisma.$on('error', (e: any) => {
  logger.error(`Prisma Error: ${e.message}`);
});

// Healthcheck da conexão com o banco
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('✅ Conexão com o banco de dados estabelecida');
    return true;
  } catch (error) {
    logger.error('❌ Falha na conexão com o banco de dados', error);
    return false;
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
