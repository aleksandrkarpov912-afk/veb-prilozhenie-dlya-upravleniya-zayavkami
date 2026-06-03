import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { join } from 'path';
import * as express from 'express';
import * as fs from 'fs';

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.getHttpAdapter().getInstance().set('trust proxy', 1);

  app.useWebSocketAdapter(new IoAdapter(app));

  app.enableCors({
    origin: [FRONTEND_URL, 'http://localhost:5173'],
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ===== uploads safety =====
  const uploadsPath = join(__dirname, '..', 'uploads');

  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }

  app.use('/uploads', express.static(uploadsPath));

  // ===== port fix =====
  const port = process.env.PORT ? Number(process.env.PORT) : 8080;

  await app.listen(port, '0.0.0.0');

  console.log(`SERVER STARTED ON PORT: ${port}`);
}

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

bootstrap();