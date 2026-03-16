import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { checkDatabaseConnection } from './lib/prisma';

const PORT = Number(env.PORT) || 3333;

async function bootstrap() {
  // Verifica conexão com o banco antes de subir o servidor
  const dbConnected = await checkDatabaseConnection();

  if (!dbConnected && env.NODE_ENV === 'production') {
    logger.error('Encerrando: não foi possível conectar ao banco de dados');
    process.exit(1);
  }

  if (!dbConnected) {
    logger.warn('⚠️  Banco de dados não conectado. A API pode não funcionar corretamente.');
  }

  app.listen(PORT, () => {
    logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
    logger.info(`📚 Swagger disponível em http://localhost:${PORT}/api-docs`);
    logger.info(`🌍 Ambiente: ${env.NODE_ENV}`);
  });
}

bootstrap();
