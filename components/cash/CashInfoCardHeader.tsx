import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Text, View } from 'react-native';

import { CashInfoCardHeaderProps } from '../../types';

export default function CashInfoCardHeader({
  icon,
  title,
  iconColor,
  titleColor,
}: CashInfoCardHeaderProps) {
  return (
    <View className='flex flex-row items-center gap-2'>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text className={clsx(titleColor, 'text-base font-medium')}>{title}</Text>
    </View>
  );
}
