import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text } from 'react-native';

interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  variant: 'outline' | 'filled';
  color?: string;
  onPress?: () => void;
}

export default function ActionButton({
  icon,
  title,
  variant,
  color = 'primaryGreen',
  onPress,
}: ActionButtonProps) {
  const isOutline = variant === 'outline';

  return (
    <Pressable
      className={clsx(
        'h-[40px] px-4 flex flex-row items-center gap-2 rounded-lg',
        {
          'bg-white border border-gray-300': isOutline,
          [`bg-${color}`]: !isOutline,
        }
      )}
      onPress={onPress}
    >
      <Ionicons name={icon} size={20} color={isOutline ? '#374151' : 'white'} />
      <Text
        className={clsx('font-semibold text-base', {
          'text-gray-700': isOutline,
          'text-white': !isOutline,
        })}
      >
        {title}
      </Text>
    </Pressable>
  );
}
