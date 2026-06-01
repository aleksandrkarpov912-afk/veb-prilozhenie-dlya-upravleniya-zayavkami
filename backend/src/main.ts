import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // ✅ CORS (ПРОД + ЛОКАЛКА)
  app.enableCors({
    origin: [
      'http://localhost:5173', // dev frontend
      process.env.FRONTEND_URL, // Vercel frontend
    ].filter(Boolean),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // ✅ Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ✅ Static uploads
  app.use(
    '/uploads',
    express.static(join(__dirname, '..', 'uploads')),
  );

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

  // Railway port fix (ВАЖНО)
  const port = process.env.PORT || 3000;
  await app.listen(port);
}

bootstrap();