import React from 'react';
import { Text, View } from 'react-native';

import { LedgerActionButtons, LedgerData } from './index';

interface LedgerTableRowProps {
  item: LedgerData;
  onCharge: (item: LedgerData) => void;
  onHistory: (item: LedgerData) => void;
  onDelete: (item: LedgerData) => void;
}

export default function LedgerTableRow({
  item,
  onCharge,
  onHistory,
  onDelete,
}: LedgerTableRowProps) {
  return (
    <View className='w-full flex-row rounded-lg border-b border-gray-100'>
      <View className='w-[60%] py-3 flex flex-row items-center justify-between'>
        <View className='w-[20%]'>
          <Text className='text-base text-gray-800'>{item.memberNumber}</Text>
        </View>
        <View className='w-[20%]'>
          <Text className='text-base text-gray-800'>{item.name}</Text>
        </View>
        <View className='w-[20%]'>
          <Text className='text-base text-gray-800'>{item.receptionist}</Text>
        </View>
        <View className='w-[30%]'>
          <Text className='text-base text-gray-800 font-medium'>
            {item.chargeAmount}
          </Text>
        </View>
      </View>

      <LedgerActionButtons
        item={item}
        onCharge={onCharge}
        onHistory={onHistory}
        onDelete={onDelete}
      />
    </View>
  );
}
