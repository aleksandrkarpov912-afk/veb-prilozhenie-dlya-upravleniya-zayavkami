import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from './jwt/jwt.module';
import { TicketsService } from './tickets/tickets.service';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';

@Module({
  imports: [AuthModule, PrismaModule, JwtModule, TicketsModule, MessagesModule],
  controllers: [AppController],
  providers: [AppService, TicketsService],
  
})
export class AppModule {}