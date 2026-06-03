import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from './jwt/jwt.module';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(), // 👈 добавили event emitter
    AuthModule,
    PrismaModule,
    JwtModule,
    TicketsModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}