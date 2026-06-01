import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    console.log('🟡 Prisma init started');

    try {
      await this.$connect();
      console.log('🟢 Prisma connected OK');
    } catch (e) {
      console.error('🔴 Prisma connection FAILED');
      console.error(e);
      throw e;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}