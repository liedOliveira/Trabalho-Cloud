import { app } from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const PORT = Number(env.PORT) || 3333;

app.listen(PORT, () => {
  logger.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
  logger.info(`📚 Swagger disponível em http://localhost:${PORT}/api-docs`);
});
