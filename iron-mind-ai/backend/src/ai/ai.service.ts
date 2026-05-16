import { Injectable } from '@nestjs/common';
import { SetHistoryItemDto } from './dto/set-history.dto';
import { AiRecommendation } from './types';

function roundTo2(x: number) {
  return Math.round(x * 100) / 100;
}

@Injectable()
export class AiService {
  // TODO: Подключим Claude позже (ANTHROPIC_API_KEY).
  // Пока — детерминированная “умная” заглушка.
  recommendFromHistory(sets: SetHistoryItemDto[]): AiRecommendation {
    const byExercise = new Map<
      string,
      { lastWeight: number; lastReps: number; lastRpe: number; totalSets: number }
    >();

    for (const s of sets) {
      byExercise.set(s.exerciseId, {
        lastWeight: s.weight,
        lastReps: s.reps,
        lastRpe: s.rpeLevel,
        totalSets: (byExercise.get(s.exerciseId)?.totalSets ?? 0) + 1,
      });
    }

    const exercises = [...byExercise.entries()].map(([exerciseId, v]) => {
      const targetRpe = 8;
      const tooEasy = v.lastRpe <= 6 && v.lastReps >= 8;
      const tooHard = v.lastRpe >= 9 || v.lastReps <= 4;

      const deltaWeight = tooEasy ? Math.max(1.25, v.lastWeight * 0.025) : tooHard ? -Math.max(1.25, v.lastWeight * 0.025) : 0;
      const suggestedWeight = Math.max(0, roundTo2(v.lastWeight + deltaWeight));

      const suggestedSets = tooHard ? Math.max(2, Math.min(4, v.totalSets - 1)) : tooEasy ? Math.min(6, v.totalSets + 1) : v.totalSets;
      const suggestedReps = tooHard ? Math.max(4, Math.min(8, v.lastReps + 1)) : tooEasy ? Math.min(12, v.lastReps) : v.lastReps;

      const reasoning =
        tooEasy
          ? 'Последний подход был лёгким по RPE — можно добавить вес/объём.'
          : tooHard
            ? 'Последний подход был тяжёлым — снижаем нагрузку, удерживаем технику.'
            : 'Нагрузка в норме — сохраняем параметры и стремимся к стабильности.';

      return {
        exerciseId,
        deltaWeight: roundTo2(deltaWeight),
        suggestedWeight,
        suggestedSets,
        suggestedReps,
        reasoning,
      };
    });

    return {
      summary: 'Рекомендация рассчитана на основе истории подходов (заглушка AI).',
      nextSession: {
        targetRpe: 8,
        notes: [
          'Разминка: 5–10 мин + 2 разминочных подхода на упражнение.',
          'Оставляй 1–2 повтора в запасе на первых рабочих сетах.',
          'Если техника “плывёт” — не добавляй вес, снизь RPE.',
        ],
        exercises,
      },
    };
  }
}

