import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { checkDatabaseConnection } from './lib/prisma';

const PORT = Number(env.PORT) || 3333;

async function bootstrap() {
  const dbConnected = await checkDatabaseConnection();

  if (!dbConnected && env.NODE_ENV === 'production') {
    logger.error('Could not connect to the database, shutting down');
    process.exit(1);
  }

  if (!dbConnected) {
    logger.warn('Database not connected. Some features may not work.');
  }

  app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
    logger.info(`Swagger docs at http://localhost:${PORT}/api-docs`);
    logger.info(`Environment: ${env.NODE_ENV}`);
  });
}

bootstrap();
