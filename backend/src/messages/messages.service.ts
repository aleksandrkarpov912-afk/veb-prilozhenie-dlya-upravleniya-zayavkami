import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessagesGateway } from './messages.gateway';

@Injectable()
export class MessagesService {
  constructor(
    private prisma: PrismaService,
    private gateway: MessagesGateway,
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

    this.gateway.sendMessage(ticketId, message);

    return message;
  }

  async findByTicket(ticketId: number) {
    return this.prisma.message.findMany({
      where: {
        ticketId,
      },
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
