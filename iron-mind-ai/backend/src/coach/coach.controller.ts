import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { IsString } from 'class-validator';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { CoachService } from './coach.service';

class NoteDto {
  @IsString() notes!: string;
}

@Controller('coach')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.COACH, UserRole.ADMIN)
export class CoachController {
  constructor(private readonly coach: CoachService) {}

  @Get('clients')
  clients(@CurrentUser() user: { id: string }) {
    return this.coach.listClients(user.id);
  }

  @Get('clients/:id')
  client(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.coach.clientDetail(user.id, id);
  }

  @Patch('clients/:id/notes')
  notes(@CurrentUser() user: { id: string }, @Param('id') id: string, @Body() dto: NoteDto) {
    return this.coach.addNote(user.id, id, dto.notes);
  }
}
