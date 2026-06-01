import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  console.log('BOOTSTRAP START');

  console.log('ENV CHECK', {
    DATABASE_URL: process.env.DATABASE_URL ? 'OK' : 'MISSING',
    FRONTEND_URL: process.env.FRONTEND_URL,
  });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ WebSocket adapter (обязательно для Railway)
  app.useWebSocketAdapter(new IoAdapter(app));

  console.log('APP CREATED');

  // ✅ CORS (очищенный и безопасный)
  app.enableCors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        'http://localhost:5173',
        process.env.FRONTEND_URL,
      ].filter(Boolean);

      // Railway + Vercel fix (разрешаем null origin для websocket)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  });

  // ✅ Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ static uploads
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('HelpDesk API')
    .setDescription('API для системы заявок')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  await app.listen(port, '0.0.0.0');

  console.log('SERVER STARTED ON PORT:', port);
}

process.on('uncaughtException', (err) => {
  console.error('UNCUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

bootstrap();