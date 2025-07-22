import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

interface CashInfoCardHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  iconColor: string;
  titleColor: string;
}

export default function CashInfoCardHeader({
  icon,
  title,
  iconColor,
  titleColor,
}: CashInfoCardHeaderProps) {
  return (
    <View className='flex flex-row items-center gap-2'>
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text className={`${titleColor} text-base font-medium`}>{title}</Text>
    </View>
  );
}
