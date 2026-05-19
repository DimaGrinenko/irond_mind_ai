import React from 'react';
import { Image, ImageStyle, View, ViewStyle } from 'react-native';
import { AppIcon, AppIconKey, IconForContext, IconContext } from '../../assets/iconRegistry';

type Props = {
  /** Either a direct icon key or a contextual mapping key */
  name?: AppIconKey;
  context?: IconContext;
  size?: number;
  /** Wrapper background (off by default — icons already include their own backdrop) */
  withFrame?: boolean;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

/**
 * NeonIcon — рендер одной PNG-иконки из набора Iron Mind.
 *
 * Преимущество перед Ionicons: использует кастомные неоновые иконки автора.
 * Если name/context не заданы, ничего не рендерит.
 */
export function NeonIcon({ name, context, size = 48, withFrame, style, imageStyle }: Props) {
  const source = name ? AppIcon[name] : context ? IconForContext[context] : null;
  if (!source) return null;

  const img = (
    <Image
      source={source}
      style={[
        {
          width: size,
          height: size,
          borderRadius: size * 0.18,
        },
        imageStyle,
      ]}
      resizeMode="contain"
    />
  );

  if (!withFrame) return <View style={style}>{img}</View>;

  return (
    <View
      style={[
        {
          width: size + 12,
          height: size + 12,
          borderRadius: (size + 12) * 0.22,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(15,15,26,0.55)',
          borderWidth: 1,
          borderColor: 'rgba(123,63,228,0.25)',
        },
        style,
      ]}
    >
      {img}
    </View>
  );
}
