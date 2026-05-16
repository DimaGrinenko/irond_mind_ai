import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  list() {
    return this.prisma.program.findMany({ orderBy: { id: 'asc' } });
  }

  async byId(id: string) {
    const p = await this.prisma.program.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Программа не найдена');
    return p;
  }
}
