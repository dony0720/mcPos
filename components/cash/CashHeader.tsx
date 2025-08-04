import React from 'react';
import { Text, View } from 'react-native';

import { CashHeaderProps } from '../../types';
import ActionButton from './ActionButton';

export default function CashHeader({
  onInspection,
  onDailySettlement,
}: CashHeaderProps) {
  return (
    <View className='w-full flex flex-row gap-2 justify-between items-center mt-[20px]'>
      <View className='flex flex-col gap-3'>
        <Text className='text-3xl font-bold'>시재관리</Text>
        <Text className='text-xl text-gray-500'>시재 내역을 관리하세요</Text>
      </View>
      <View className='flex flex-row gap-2'>
        <ActionButton
          icon='calculator'
          title='시재 점검'
          variant='outline'
          onPress={onInspection}
        />
        <ActionButton
          icon='document-text'
          title='일일정산'
          variant='filled'
          onPress={onDailySettlement}
        />
      </View>
    </View>
  );
}
