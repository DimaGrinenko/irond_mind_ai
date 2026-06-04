import { Injectable } from '@nestjs/common';
import { ChatRole, WorkoutStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AiProvider, type AiSource } from '../ai/ai-provider';
import { CycleService, type CyclePhase } from '../cycle/cycle.service';

const CYCLE_ADVICE: Record<CyclePhase, string> = {
  menstrual:
    'Сейчас менструальная фаза — энергия ниже. Лёгкие тренировки, мобилити, прогулки. Не урезай калории, добавь железо.',
  follicular:
    'Сейчас фолликулярная фаза — пик энергии и восстановления. Лучшее окно для силовых PR и интенсивности.',
  ovulation:
    'Сейчас овуляция — связки слабее, риск травм выше. Избегай максимальных весов, следи за техникой.',
  luteal:
    'Сейчас лютеиновая фаза — работоспособность снижается. Умеренная нагрузка, больше кардио, сложные углеводы и магний.',
};

const RULES: Array<{ regex: RegExp; reply: string }> = [
  // Питание
  {
    regex: /белк|протеин|protein/i,
    reply:
      'Норма белка для силовых: 1.6–2.2 г/кг массы тела. При весе 80 кг — 130-175 г белка в день. Распределяй на 3-5 приёмов.',
  },
  {
    regex: /углевод|carb/i,
    reply:
      'Углеводы — 3-6 г/кг в зависимости от объёма тренировок. На массе больше, на сушке меньше. Основные источники: овсянка, рис, картофель, гречка.',
  },
  {
    regex: /жир|fat/i,
    reply:
      'Жиры — 0.8-1.2 г/кг. Минимум 20% от калорий — нужны для гормонов. Источники: рыба, авокадо, орехи, оливковое масло.',
  },
  {
    regex: /масс|набор/i,
    reply:
      'Для набора массы: профицит ~300-500 ккал, белок 1.6-2.2 г/кг, 3-5 силовых в неделю, сон 7.5-9 ч. Прогрессия каждую неделю — +1-2.5 кг или +1-2 повтора.',
  },
  {
    regex: /сушк|похуд|жиросжиган|cut|сжига/i,
    reply:
      'На сушке: дефицит 300-500 ккал, белок 2.0-2.5 г/кг (выше!), много овощей. Силовые сохраняй — иначе сожжёшь мышцы. +20-30 мин кардио 3 раза в неделю.',
  },
  {
    regex: /питан|калор|кбжу|диет/i,
    reply:
      'Базово: вес × 30-35 = калории на поддержку. Профицит/дефицит ±300-500. Белок 1.6-2.2 г/кг, жиры 0.8-1.2 г/кг, остальное — углеводы.',
  },

  // Тренировки
  {
    regex: /программ|план/i,
    reply:
      'Подберу под цель. Новичкам — фулбади 3×/нед. Продвинутым — Push-Pull-Legs или Upper/Lower 4-6 раз. Скажи цель и уровень опыта.',
  },
  {
    regex: /сколько раз|как часто/i,
    reply:
      'Новичкам — 3 тренировки в неделю с разделением по 48 часов. После года опыта — 4-5. Меньше 3 — медленный прогресс, больше 6 — риск перетренировки.',
  },
  {
    regex: /разминк|разогрев/i,
    reply:
      'Разминка: 5-10 мин кардио лёгкого + динамическая растяжка + 2 разминочных подхода на основное упражнение (40% и 60% рабочего веса).',
  },
  {
    regex: /техник|форм|правильно/i,
    reply:
      'Главное — контроль негатива (2-3 сек на опускание), полная амплитуда, стабильный кор. Лучше меньше веса с идеальной техникой.',
  },

  // Упражнения
  {
    regex: /присед|squat/i,
    reply:
      'Присед: упор в пятки, колени по линии носков, корпус стабилен, опускаться ниже параллели. Начни с 60-70% от 1ПМ на 5×5.',
  },
  {
    regex: /жим лежа|жим штанги|bench|жим лёжа/i,
    reply:
      'Жим лёжа: лопатки сведены, ноги в упор, штанга к низу груди, локти ~45°. Контроль негатива 2-3 сек.',
  },
  {
    regex: /становая|тяг|deadlift/i,
    reply:
      'Становая: нейтральная спина, гриф над серединой стопы, толчок ногами + бёдра вперёд. Сначала отработай технику с пустым грифом.',
  },
  {
    regex: /подтягиван|pull/i,
    reply:
      'Подтягивания: полное растяжение внизу, грудь к турнику, лопатки вниз. Если не получается — гравитрон или резинки.',
  },
  {
    regex: /бицепс|biceps/i,
    reply:
      'Бицепс растёт от объёма (12-20 подходов в неделю). Главные: подъёмы штанги, гантелей, молоты, скамья Скотта. Веса прогрессируй малыми шагами.',
  },
  {
    regex: /трицепс|triceps/i,
    reply:
      'Трицепс — 60% объёма руки. Лучшие: жим узким хватом, отжимания на брусьях, французский жим, разгибания на блоке.',
  },

  // Прогресс
  {
    regex: /плато|stuck/i,
    reply:
      'Плато? Попробуй: 1) недельный deload (50% объёма), 2) поменять упражнение на аналог, 3) добавить дроп-сет или паузы, 4) проверить сон/калории.',
  },
  {
    regex: /прогресс|расти/i,
    reply:
      'Прогрессия: +1-2.5 кг каждую неделю на жимы, +5 кг на присед/становую. Если не получается прибавить вес — добавь повтор. Прогресс шажками.',
  },

  // Восстановление
  {
    regex: /сон|спать/i,
    reply:
      'Сон — главный анаболик. 7.5-9 часов. Тёмная комната, прохладно (18-20°C), без экранов за час, без кофе после 14:00.',
  },
  {
    regex: /восстановл|устал|перетрен/i,
    reply:
      'Признаки перетренировки: тяжёлый сон, падение силы, нет мотивации. Решение: deload-неделя (50% объёма), больше еды, больше сна.',
  },
  {
    regex: /крепатур|болят мышц|doms/i,
    reply:
      'Крепатура нормальна 24-72 ч после новых упражнений. Лёгкое кардио + растяжка + достаточно белка ускоряют восстановление.',
  },

  // Добавки
  {
    regex: /креатин|creatin/i,
    reply:
      'Креатин моногидрат — самая изученная добавка. 5 г в день постоянно. +5-10% силы и +1-2 повтора. Безопасен для здоровых почек.',
  },
  {
    regex: /протеин (порош|шейк)|whey/i,
    reply:
      'Whey-протеин — 20-40 г после тренировки. Помогает добрать норму белка. Если ешь достаточно мяса/яиц/творога — не обязателен.',
  },
  {
    regex: /кофеин|caffe/i,
    reply:
      'Кофеин — 3-6 мг/кг за 30-60 мин до тренировки (200-400 мг). +2-7% силы, лучше фокус, отдаляет утомление. Не позднее 14:00.',
  },
  {
    regex: /добав|saplem|supple/i,
    reply:
      'Топ добавок: креатин (5 г), сывороточный протеин (20-40 г), витамин D3 (2000 МЕ), омега-3 (2-3 г EPA+DHA), магний (400 мг). Открой раздел «Добавки» в Профиле — там полный гайд.',
  },

  // Мотивация
  {
    regex: /мотив|лень|не хочу/i,
    reply:
      'Дисциплина важнее мотивации. Сделай минимум — 1 рабочий подход. Чаще всего после первого подхода идёт продолжение. И ты уже не зря пришёл.',
  },
  {
    regex: /начать|новичок/i,
    reply:
      'Начни с фулбади 3 раза в неделю по 45-60 минут. 5-7 базовых упражнений, 3 подхода по 8-12 повторений. Главное — стабильность 3+ месяца.',
  },

  // Цели
  {
    regex: /пресс|abs|кубики/i,
    reply:
      'Кубики видны при низком % жира (мужчинам <12-14%). Качай корпус 2 раза в неделю + дефицит калорий + кардио. Скручиваниями жир не уберёшь.',
  },
  {
    regex: /сила|strength/i,
    reply:
      'Сила растёт от малых повторений (3-6) с большими весами (80-90% 1ПМ). Долгий отдых 3-5 минут. Прогрессия каждую тренировку.',
  },
];

const SYSTEM_PROMPT = `Ты — Iron Mind, AI-тренер по силовым тренировкам и питанию. Ты говоришь на русском, дружелюбно и по делу.

Принципы ответов:
- Конкретика > общие слова. Если вопрос про вес/повторы — давай числа.
- Безопасность: при болевых ощущениях направляй к врачу.
- Учитывай уровень: новичкам объясняй проще, продвинутым — без воды.
- Краткость: 2–4 предложения по умолчанию, длиннее только если просят план.
- Запрещено: давать медицинские диагнозы, советовать запрещённые препараты.

Если пользователь спрашивает что-то вне фитнеса/питания/восстановления — мягко возвращай к теме.`;

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly ai: AiProvider,
    private readonly cycle: CycleService,
  ) {}

  list(userId: string, limit = 50) {
    return this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
      take: Math.min(limit, 200),
    });
  }

  status() {
    return this.ai.getInfo();
  }

  async send(userId: string, content: string) {
    const userMsg = await this.prisma.chatMessage.create({
      data: { userId, role: ChatRole.USER, content },
    });

    const { text: reply, source, llmError } = await this.generateReply(
      userId,
      content,
    );
    const aiMsg = await this.prisma.chatMessage.create({
      data: { userId, role: ChatRole.ASSISTANT, content: reply },
    });

    const info = this.ai.getInfo();
    return {
      userMsg,
      aiMsg,
      meta: {
        source,
        provider: info.label,
        model: info.model,
        llmError: llmError ?? null,
      },
    };
  }

  private async generateReply(
    userId: string,
    message: string,
  ): Promise<{ text: string; source: AiSource; llmError?: string }> {
    // Pull the user's cycle phase (only set for users who opted in) so advice
    // can be tailored — both for the live AI and the rule-based fallback.
    let phase: CyclePhase | null = null;
    try {
      const c = await this.cycle.get(userId);
      if (c.enabled) phase = c.phase;
    } catch {
      /* cycle unavailable — ignore */
    }

    if (this.ai.isEnabled()) {
      const history = await this.prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' },
        take: 20,
      });
      const historyForAi = history
        .filter(
          (m, i, arr) =>
            !(
              i === arr.length - 1 &&
              m.role === ChatRole.USER &&
              m.content === message
            ),
        )
        .slice(-18);
      const systemPrompt = await this.buildSystemPrompt(userId, phase);
      const result = await this.ai.complete({
        systemPrompt,
        history: historyForAi.map((m) => ({
          role:
            m.role === ChatRole.USER ? ('user' as const) : ('assistant' as const),
          content: m.content,
        })),
        userMessage: message,
      });
      if (result) return { text: result, source: 'llm' };
      return {
        text: this.fallbackReply(message, phase),
        source: 'rules',
        llmError: this.ai.getLastError() ?? 'llm_unavailable',
      };
    }
    return { text: this.fallbackReply(message, phase), source: 'rules' };
  }

  private async buildSystemPrompt(
    userId: string,
    phase: CyclePhase | null,
  ): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        goalKey: true,
        goal: true,
        weightKg: true,
        heightCm: true,
        age: true,
        level: true,
        dailyCaloriesGoal: true,
        dailyProteinGoal: true,
        currentProgramId: true,
      },
    });

    let programTitle: string | null = null;
    if (user?.currentProgramId) {
      const prog = await this.prisma.program.findUnique({
        where: { id: user.currentProgramId },
        select: { title: true, daysPerWeek: true, weeks: true },
      });
      if (prog) {
        programTitle = `${prog.title} (${prog.daysPerWeek}×/нед, ${prog.weeks} нед)`;
      }
    }

    const since = new Date();
    since.setDate(since.getDate() - 30);
    const workouts30d = await this.prisma.workout.count({
      where: {
        userId,
        status: WorkoutStatus.COMPLETED,
        date: { gte: since },
      },
    });

    const parts = [SYSTEM_PROMPT, '\n\n--- Контекст пользователя ---'];
    if (user) {
      parts.push(`Имя: ${user.name}`);
      if (user.goalKey || user.goal) {
        parts.push(`Цель: ${user.goalKey ?? user.goal}`);
      }
      if (user.level) parts.push(`Уровень: ${user.level}`);
      if (user.weightKg) parts.push(`Вес: ${user.weightKg} кг`);
      if (user.heightCm) parts.push(`Рост: ${user.heightCm} см`);
      if (user.age) parts.push(`Возраст: ${user.age}`);
      if (user.dailyCaloriesGoal) {
        parts.push(`Калории/день (цель): ${user.dailyCaloriesGoal}`);
      }
      if (user.dailyProteinGoal) {
        parts.push(`Белок/день (цель): ${user.dailyProteinGoal} г`);
      }
    }
    if (programTitle) parts.push(`Текущая программа: ${programTitle}`);
    parts.push(`Завершённых тренировок за 30 дней: ${workouts30d}`);

    if (phase) {
      parts.push(
        `\nМенструальный цикл: фаза ${phase}. ${CYCLE_ADVICE[phase]} Учитывай при нагрузке, если вопрос про тренировки/самочувствие.`,
      );
    }

    return parts.join('\n');
  }

  private fallbackReply(text: string, phase: CyclePhase | null): string {
    // Cycle-related questions get phase-aware advice when tracking is on.
    if (/цикл|месячн|менструал|овуляц|period|menstrual|cycle/i.test(text)) {
      if (phase) return CYCLE_ADVICE[phase];
      return 'Если включишь трекинг цикла в профиле, я буду подстраивать советы по нагрузке и питанию под текущую фазу. В целом: фолликулярная фаза — пик силы, лютеиновая — умереннее, овуляция — осторожнее с максимальными весами.';
    }
    for (const r of RULES) if (r.regex.test(text)) return r.reply;
    return 'Я могу помочь по темам: тренировки, упражнения и техника, питание (КБЖУ, белок), восстановление и сон, добавки, мотивация. Что интересует?';
  }
}
