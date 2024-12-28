import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.enableCors(
    {
      origin: ['http://localhost:3000', process.env.CLIENT_DEVELOPMENT_URL],
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true,
    }
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
