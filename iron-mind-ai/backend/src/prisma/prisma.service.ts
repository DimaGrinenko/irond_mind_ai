import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (e) {
      this.logger.warn(
        'Prisma не смог подключиться к БД. Backend продолжит работу в режиме без БД (моки/AI заглушка).',
      );
      this.logger.debug(e);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

