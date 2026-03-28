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

if (env.NODE_ENV === 'development') {
  prisma.$on('query', (e: any) => {
    logger.debug(`Query: ${e.query} (${e.duration}ms)`);
  });
}

prisma.$on('error', (e: any) => {
  logger.error(`Prisma: ${e.message}`);
});

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    logger.info('Database connection established');
    return true;
  } catch (error) {
    logger.error('Failed to connect to database', error);
    return false;
  }
}

process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export { prisma };
