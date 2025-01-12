import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// const cookieParser = require('cookie-parser');
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [process.env.CLIENT_PRODUCTION_URL, process.env.CLIENT_DEVELOPMENT_URL],
    methods: "*",
    credentials: true,
    allowedHeaders:"*"
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
