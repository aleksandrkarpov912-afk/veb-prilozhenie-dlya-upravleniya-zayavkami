import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(
    ticketId: number,
    userId: number,
    text: string,
    fileUrl?: string,
  ) {
    const message = await this.prisma.message.create({
      data: {
        ticketId,
        userId,
        text: text || '',
        fileUrl: fileUrl ?? null,
      },
      include: {
        user: true,
      },
    });

    this.eventEmitter.emit('message.created', message);

    return message;
  }

  async findByTicket(ticketId: number) {
    return this.prisma.message.findMany({
      where: { ticketId },
      include: { user: true },
      orderBy: { createdAt: 'asc' },
    });
  }
}