import type { Lang } from '../i18n';

const QUOTES_RU = [
  'Дисциплина важнее мотивации.',
  'Боль временна — гордость навсегда.',
  'Слабость покидает тело, когда ты не сдаёшься.',
  'Не жди настроения — действуй.',
  'Сделай сегодня минимум, но сделай.',
  'Прогресс — это сумма маленьких шагов.',
  'Ты сильнее, чем думаешь.',
  'Результат любит регулярность.',
  'Техника важнее веса.',
  'Восстановление — часть тренировки.',
];

const QUOTES_EN = [
  'Discipline beats motivation.',
  'Pain is temporary, pride is forever.',
  'Weakness leaves the body when you refuse to quit.',
  "Don't wait for the mood — act.",
  'Do the minimum today, but do it.',
  'Progress is the sum of small steps.',
  "You're stronger than you think.",
  'Results love consistency.',
  'Technique matters more than weight.',
  'Recovery is part of training.',
];

/** Localized motivational quotes. */
export function motivationQuotes(lang: Lang): string[] {
  return lang === 'en' ? QUOTES_EN : QUOTES_RU;
}
