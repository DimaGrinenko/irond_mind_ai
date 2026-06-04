import { dayTitle, programLabel, t } from '../i18n';

/** Авто-тесты / мусор в name из dev-прогонов. */
const DEV_WORKOUT_NAME =
  /^(smoke|playwright|e2e|test\b|ach\b)/i;

type ProgramRef = { id: string; title: string } | null | undefined;

/** Человеческое название завершённой тренировки для истории. */
export function workoutDisplayName(
  name: string | null | undefined,
  program?: ProgramRef,
): string {
  const raw = name?.trim() ?? '';

  if (!raw) {
    if (program?.id) return programLabel(program.id, program.title);
    return t('history.workoutSession');
  }

  if (DEV_WORKOUT_NAME.test(raw) || /smoke\s*ach/i.test(raw)) {
    if (program?.id) return programLabel(program.id, program.title);
    return t('history.devWorkout');
  }

  const localizedDay = dayTitle(raw);
  if (localizedDay !== raw) return localizedDay;

  if (program?.id) {
    const progTitle = programLabel(program.id, program.title);
    if (raw === program.title || raw === program.id) return progTitle;
  }

  if (/^c[a-z0-9]{18,}$/i.test(raw) || /^usr_/.test(raw)) {
    if (program?.id) return programLabel(program.id, program.title);
    return t('history.workoutSession');
  }

  if (/^[\s?\uFFFD]+$/.test(raw) || raw === '?') {
    if (program?.id) return programLabel(program.id, program.title);
    return t('history.workoutSession');
  }

  return raw;
}

/** Подзаголовок: программа, если не совпадает с заголовком карточки. */
export function workoutProgramSubtitle(
  displayTitle: string,
  program?: ProgramRef,
): string | null {
  if (!program?.id) return null;
  const prog = programLabel(program.id, program.title);
  if (!prog || prog === displayTitle) return null;
  return prog;
}
