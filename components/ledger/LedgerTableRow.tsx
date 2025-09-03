import React from 'react';
import { Text, View } from 'react-native';

import { LedgerTableRowProps } from '../../types';
import { getPhoneLastFourDigits } from '../../utils';
import { LedgerActionButtons } from './index';

export default function LedgerTableRow({
  item,
  onCharge,
  onHistory,
  onDelete,
}: LedgerTableRowProps) {
  return (
    <View className='w-full flex-row items-center rounded-lg border-b border-gray-100'>
      <View className='w-[55%] py-3 flex flex-row items-center justify-between'>
        <View className='w-[20%]'>
          <Text className='text-base text-gray-800'>
            {getPhoneLastFourDigits(item.phoneNumber)}
          </Text>
        </View>
        <View className='w-[20%]'>
          <Text className='text-base text-gray-800'>{item.name}</Text>
        </View>
        <View className='w-[30%]'>
          <Text className='text-base text-gray-800'>
            {item.receptionist || '접수자 없음'}
          </Text>
        </View>
        <View className='w-[34%]'>
          <Text className='text-base text-gray-800 font-medium'>
            {item.chargeAmount}
          </Text>
        </View>
      </View>
      <View className='w-[45%] py-3 flex items-center justify-center'>
        <LedgerActionButtons
          item={item}
          onCharge={onCharge}
          onHistory={onHistory}
          onDelete={onDelete}
        />
      </View>
    </View>
  );
}
