import 'dotenv/config';

import app from './app';
import { prisma } from './lib/prisma';
import { logger } from './lib/logger';

const PORT = parseInt(process.env.PORT || '4000', 10);

async function main() {
  // Test database connection
  try {
    await prisma.$connect();
    logger.info('✅ Database connected successfully');
  } catch (err) {
    logger.error('❌ Database connection failed:', err);
    process.exit(1);
  }

  const server = app.listen(PORT, () => {
    logger.info(`🎙️  Imara Studios API running on http://localhost:${PORT}`);
    logger.info(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`\n${signal} received. Shutting down gracefully...`);
    server.close(async () => {
      await prisma.$disconnect();
      logger.info('Server closed. Goodbye.');
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection:', reason);
  });
}

main();
