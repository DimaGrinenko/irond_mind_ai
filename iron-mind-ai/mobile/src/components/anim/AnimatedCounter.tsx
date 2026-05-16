import React from 'react';
import { Platform, Text, type TextProps } from 'react-native';

type Props = TextProps & {
  /** Целевое число */
  to: number;
  /** Длительность анимации, мс */
  duration?: number;
  /** Форматирование (например, форматирование с пробелами) */
  format?: (n: number) => string;
};

/**
 * Текст-счётчик: плавно анимирует число от 0 до `to` при маунте.
 * Без Reanimated worklets — простой setInterval, потому что это просто текст.
 */
export function AnimatedCounter({ to, duration = 900, format, style, ...props }: Props) {
  const [value, setValue] = React.useState(Platform.OS === 'web' ? to : 0);

  React.useEffect(() => {
    if (Platform.OS === 'web') {
      setValue(to);
      return;
    }

    let raf = 0;
    const start = Date.now();
    const from = 0;
    const tick = () => {
      const t = Math.min(1, (Date.now() - start) / duration);
      // ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(from + (to - from) * eased);
      setValue(current);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, duration]);

  return (
    <Text {...props} style={style}>
      {format ? format(value) : value.toLocaleString('ru-RU')}
    </Text>
  );
}
