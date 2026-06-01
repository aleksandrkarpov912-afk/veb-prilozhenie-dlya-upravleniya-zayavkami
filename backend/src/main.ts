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

  app.useWebSocketAdapter(new IoAdapter(app));

  console.log('DATABASE URL CHECK:', !!process.env.DATABASE_URL);

  console.log('APP CREATED');

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://veb-prilozhenie-dlya-upravleniya-zayavkami-5ydt-b8e0uijdl.vercel.app',
      process.env.FRONTEND_URL,
    ].filter(Boolean),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

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

  console.log('SERVER STARTED');
}

process.on('uncaughtException', (err) => {
  console.error('UNCUGHT EXCEPTION:', err);
});

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);
});

bootstrap();