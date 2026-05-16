import { Injectable } from '@nestjs/common';
import { ChatRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const RULES: Array<{ regex: RegExp; reply: string }> = [
  { regex: /масс|набор/i, reply: 'Для набора массы важны: прогрессия нагрузок, профицит ~300–500 ккал, белок 1.6–2.2 г/кг и сон 7.5–9 ч. Подобрать план на неделю?' },
  { regex: /питан|калор|кбжу/i, reply: 'Базово держи небольшой профицит и цель по белку 1.6–2.2 г/кг. Скажи свой вес и активность — рассчитаю КБЖУ.' },
  { regex: /программ/i, reply: 'Могу подобрать программу под цель и уровень. Тебе важнее: масса, рельеф, сила, выносливость или пресс?' },
  { regex: /сон/i, reply: 'Сон — главный анаболик. Цель: 7.5–9 часов, стабильный график, минимум экранов за час до сна.' },
  { regex: /мотив/i, reply: 'Дисциплина важнее мотивации. Сделай сегодня минимум — и ты уже выигрываешь.' },
];

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, limit = 50) {
    return this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: Math.min(limit, 200),
    });
  }

  async send(userId: string, content: string) {
    const userMsg = await this.prisma.chatMessage.create({
      data: { userId, role: ChatRole.USER, content },
    });

    const reply = this.replyFor(content);
    const aiMsg = await this.prisma.chatMessage.create({
      data: { userId, role: ChatRole.ASSISTANT, content: reply },
    });

    return { userMsg, aiMsg };
  }

  private replyFor(text: string): string {
    for (const r of RULES) if (r.regex.test(text)) return r.reply;
    return 'Расскажи подробнее — я помогу подобрать решение.';
  }
}
