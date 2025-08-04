import clsx from 'clsx';
import React from 'react';
import { Text, View } from 'react-native';

import { SalesInfoCardProps } from '../../types';
import { salesCardThemeStyles } from './cardThemes';
import CashInfoCardHeader from './CashInfoCardHeader';

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
        className={clsx('text-2xl font-bold mt-2', styles.amountColor)}
        numberOfLines={1}
        adjustsFontSizeToFit
        minimumFontScale={0.6}
      >
        {amount}
      </Text>
    </View>
  );
}
