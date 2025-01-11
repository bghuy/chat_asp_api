import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: [process.env.CLIENT_PRODUCTION_URL, process.env.CLIENT_DEVELOPMENT_URL],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    preflightContinue: true,
  });
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.status(204).send();
    } else {
      next();
    }
  });
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
