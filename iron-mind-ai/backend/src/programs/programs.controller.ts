import { Controller, Get, Param } from '@nestjs/common';
import { ProgramsService } from './programs.service';

@Controller('programs')
export class ProgramsController {
  constructor(private readonly programs: ProgramsService) {}

  @Get()
  list() {
    return this.programs.list();
  }

  @Get(':id')
  one(@Param('id') id: string) {
    return this.programs.byId(id);
  }
}
