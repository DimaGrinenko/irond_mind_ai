import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';

class SetRoleDto {
  @IsEnum(UserRole) role!: UserRole;
}

class AssignCoachDto {
  @IsString() coachId!: string;
  @IsOptional() @IsString() notes?: string;
}

@Controller('admin')
@UseGuards(JwtGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('users')
  users() {
    return this.admin.listUsers();
  }

  @Patch('users/:id/role')
  setRole(@Param('id') id: string, @Body() dto: SetRoleDto) {
    return this.admin.setRole(id, dto.role);
  }

  @Post('clients/:clientId/coach')
  assignCoach(@Param('clientId') clientId: string, @Body() dto: AssignCoachDto) {
    return this.admin.assignCoach(clientId, dto.coachId, dto.notes);
  }
}
