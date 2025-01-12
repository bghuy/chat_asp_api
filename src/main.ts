import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieParser = require('cookie-parser');
const cors = require('cors');
// import cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins = [process.env.CLIENT_PRODUCTION_URL, process.env.CLIENT_DEVELOPMENT_URL];

  app.enableCors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    credentials: true,
    preflightContinue: true,
    allowedHeaders: '*'
  });
//   app.use(cors({
//     credentials: true,
//     origin: (origin, callback) => {
//         if (allowedOrigins.includes(origin) || !origin) {
//             callback(null, true);
//         } else {
//             callback(new Error('Not allowed by CORS'));
//         }
//     },
// }));

  // Middleware để xử lý các yêu cầu OPTIONS (preflight request)
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.status(204).send();
    } else {
      next();
    }
  });

  app.use(cookieParser());  // Middleware cho cookie parser
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
