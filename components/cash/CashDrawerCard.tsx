import React from 'react';
import { Text, View } from 'react-native';

import { CardTheme, cardThemeStyles } from './cardThemes';

interface CashDrawerCardProps {
  type: string;
  title: string;
  quantity: string;
  totalAmount: string;
  theme: CardTheme;
}

export default function CashDrawerCard({
  type,
  title,
  quantity,
  totalAmount,
  theme,
}: CashDrawerCardProps) {
  const styles = cardThemeStyles[theme];

  return (
    <View
      className={`w-full ${styles.bg} border ${styles.border} rounded-xl p-5 max-h-[130px] justify-center`}
    >
      <View className='flex flex-row items-center justify-between'>
        <Text className={`text-2xl font-bold ${styles.titleColor}`}>
          {title}
        </Text>
        <View className='flex flex-row items-center gap-1'>
          <View className='w-2 h-2 rounded-full bg-gray-400'></View>
          <Text className='text-base font-medium text-gray-500 uppercase tracking-wider'>
            {type}
          </Text>
        </View>
      </View>

      <View className='mt-3'>
        <View className='flex flex-row justify-between items-center mb-1'>
          <Text className={`text-base ${styles.titleColor}`}>수량</Text>
          <Text className={`text-base font-medium ${styles.amountColor}`}>
            {quantity}
          </Text>
        </View>
        <View className='flex flex-row justify-between items-center'>
          <Text className={`text-base ${styles.titleColor}`}>금액</Text>
          <Text className={`text-xl font-bold ${styles.amountColor}`}>
            {totalAmount}
          </Text>
        </View>
      </View>
    </View>
  );
}
