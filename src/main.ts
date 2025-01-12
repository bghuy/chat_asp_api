import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// const cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [process.env.CLIENT_PRODUCTION_URL, process.env.CLIENT_DEVELOPMENT_URL];

  app.enableCors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    preflightContinue: false,
    allowedHeaders: ['Content-Type', 'Authorization']
  });
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.status(204).send();
    } else {
      next();
    }
  });

  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
