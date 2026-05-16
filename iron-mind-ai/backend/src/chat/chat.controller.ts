import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { ChatService } from './chat.service';
import { SendChatDto } from './dto/send.dto';

@UseGuards(JwtGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Get()
  list(@CurrentUser() user: CurrentUserPayload, @Query('limit') limit?: string) {
    return this.chat.list(user.id, limit ? Number(limit) : undefined);
  }

  @Post()
  send(@CurrentUser() user: CurrentUserPayload, @Body() dto: SendChatDto) {
    return this.chat.send(user.id, dto.content);
  }
}
