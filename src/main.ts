import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  app.setGlobalPrefix('api');

  const allowedOrigins = [
    process.env.CLIENT_PRODUCTION_URL,
    process.env.CLIENT_DEVELOPMENT_URL
  ].filter(Boolean);

  logger.log(`Allowed origins: ${allowedOrigins.join(', ')}`);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        logger.warn(`Origin ${origin} not allowed by CORS`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Origin,X-Requested-With,Content-Type,Accept,Authorization',
  });

  app.use((req, res, next) => {
    logger.log(`${req.method} ${req.url}`);
    if (req.method === 'OPTIONS') {
      logger.log('Handling OPTIONS request');
      res.header('Access-Control-Allow-Origin', allowedOrigins.join(', '));
      res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.status(204).end();
    } else {
      next();
    }
  });

  app.use(cookieParser());

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Application is running on: http://localhost:${port}`);
}

bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
});

