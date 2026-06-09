import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';

import { TicketStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: number,
    title: string,
    description: string,
  ) {
    return this.prisma.ticket.create({
      data: {
        title,
        description,
        userId,
      },
    });
  }

  async myTickets(userId: number) {
    return this.prisma.ticket.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [data, total] = await this.prisma.ticket.findAndCount({
      skip,
      take: limit,
      include: { user: true },
      orderBy: { id: 'DESC' },
    });

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findAllLegacy() {
    return this.prisma.ticket.findMany({
      include: { user: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return ticket;
  }

  async update(
    id: number,
    data: any,
    user: any,
  ) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (
      ticket.userId !== user.id &&
      user.role !== 'ADMIN'
    ) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.ticket.update({
      where: { id },
      data,
    });
  }

  async updateStatus(
    id: number,
    status: TicketStatus,
  ) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return this.prisma.ticket.update({
      where: { id },
      data: {
        status,
      },
    });
  }

  async remove(id: number, user: any) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (
      ticket.userId !== user.id &&
      user.role !== 'ADMIN'
    ) {
      throw new ForbiddenException('Access denied');
    }

    return this.prisma.ticket.delete({
      where: { id },
    });
  }
}
