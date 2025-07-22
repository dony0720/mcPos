import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { SalesCardTheme, salesCardThemeStyles } from './cardThemes';
import CashInfoCardHeader from './CashInfoCardHeader';

interface SalesInfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  amount: string;
  theme: SalesCardTheme;
}

export default function SalesInfoCard({
  icon,
  title,
  amount,
  theme,
}: SalesInfoCardProps) {
  const styles = salesCardThemeStyles[theme];

  return (
    <View className='flex-1 bg-white border border-gray-200 rounded-xl p-6 min-h-[90px] justify-center'>
      <CashInfoCardHeader
        icon={icon}
        title={title}
        iconColor={styles.iconColor}
        titleColor={styles.titleColor}
      />

      <Text
        className={`text-2xl font-bold ${styles.amountColor} mt-2`}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
      >
        {amount}
      </Text>
    </View>
  );
}
