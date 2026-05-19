import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

/**
 * Hook для голосового ввода через Web Speech API (только web).
 * На native — без эффекта (возвращает supported=false).
 *
 * Распознаёт фразы:
 *   "80 на 8" / "80 на восемь" / "80 кг 8 раз" / "восемьдесят на восемь"
 * и вызывает onResult({ weight, reps }).
 */
export type ParsedVoice = { weight?: number; reps?: number };

const WORD_NUMS: Record<string, number> = {
  ноль: 0, один: 1, одна: 1, два: 2, две: 2, три: 3, четыре: 4, пять: 5, шесть: 6, семь: 7, восемь: 8, девять: 9,
  десять: 10, одиннадцать: 11, двенадцать: 12, тринадцать: 13, четырнадцать: 14, пятнадцать: 15, шестнадцать: 16,
  семнадцать: 17, восемнадцать: 18, девятнадцать: 19, двадцать: 20, тридцать: 30, сорок: 40, пятьдесят: 50,
  шестьдесят: 60, семьдесят: 70, восемьдесят: 80, девяносто: 90, сто: 100, двести: 200,
};

function wordsToNum(text: string): number | null {
  const trimmed = text.trim().toLowerCase().replace(/[,.]/g, '');
  const direct = parseFloat(trimmed);
  if (Number.isFinite(direct)) return direct;
  const parts = trimmed.split(/\s+/);
  let total = 0;
  let found = false;
  for (const p of parts) {
    if (WORD_NUMS[p] !== undefined) {
      total += WORD_NUMS[p];
      found = true;
    }
  }
  return found ? total : null;
}

export function parseVoiceWeightReps(transcript: string): ParsedVoice {
  const t = transcript.toLowerCase();
  // паттерны: "X на Y", "X кг Y раз", "X by Y"
  const sepMatch = t.match(/^(.+?)\s+(на|по|by|×|x)\s+(.+)$/);
  if (sepMatch) {
    const w = wordsToNum(sepMatch[1]);
    const r = wordsToNum(sepMatch[3]);
    return { weight: w ?? undefined, reps: r ?? undefined };
  }
  // Просто число → reps
  const onlyNum = wordsToNum(t);
  if (onlyNum != null) return { reps: onlyNum };
  return {};
}

export function useVoiceInput(
  onResult: (v: ParsedVoice, raw: string) => void,
  opts: { continuous?: boolean } = {},
) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recRef = useRef<any>(null);
  const continuousRef = useRef(opts.continuous ?? false);
  continuousRef.current = opts.continuous ?? false;

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const rec = new SR();
    rec.lang = 'ru-RU';
    rec.continuous = continuousRef.current;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.onresult = (ev: any) => {
      const last = ev.results?.[ev.results.length - 1]?.[0]?.transcript ?? '';
      const parsed = parseVoiceWeightReps(last);
      onResult(parsed, last);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => {
      if (continuousRef.current) {
        try {
          rec.start();
          return;
        } catch {
          /* noop */
        }
      }
      setListening(false);
    };
    recRef.current = rec;
  }, [onResult]);

  const start = useCallback(() => {
    if (!recRef.current) return;
    try {
      recRef.current.continuous = continuousRef.current;
      recRef.current.start();
      setListening(true);
    } catch {
      /* already started */
    }
  }, []);

  const stop = useCallback(() => {
    if (!recRef.current) return;
    continuousRef.current = false;
    try {
      recRef.current.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  }, []);

  return { listening, supported, start, stop };
}

/** Hook hands-free режима — слушает команды и вызывает onCommand с распознанным действием. */
export type VoiceCommand =
  | { kind: 'next' }
  | { kind: 'prev' }
  | { kind: 'done' }
  | { kind: 'add_set' }
  | { kind: 'plus_kg'; kg: number }
  | { kind: 'minus_kg'; kg: number }
  | { kind: 'finish' };

export function parseCommand(raw: string): VoiceCommand | null {
  const t = raw.toLowerCase().trim();
  if (/(следующ|дальше|next)/.test(t)) return { kind: 'next' };
  if (/(назад|предыдущ|prev)/.test(t)) return { kind: 'prev' };
  if (/(готов|сделал|done|выполн)/.test(t)) return { kind: 'done' };
  if (/(добав.*подход|новый подход)/.test(t)) return { kind: 'add_set' };
  if (/(законч|финиш|стоп)/.test(t)) return { kind: 'finish' };
  const plus = t.match(/плюс\s+(\d+)/);
  if (plus) return { kind: 'plus_kg', kg: Number(plus[1]) };
  const minus = t.match(/минус\s+(\d+)/);
  if (minus) return { kind: 'minus_kg', kg: Number(minus[1]) };
  return null;
}
