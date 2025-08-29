import React from 'react';
import { Text, View } from 'react-native';

import { LedgerTableRowProps } from '../../types';
import { LedgerActionButtons } from './index';

export default function LedgerTableRow({
  item,
  onCharge,
  onHistory,
  onDelete,
}: LedgerTableRowProps) {
  return (
    <View className='w-full flex-row rounded-lg border-b border-gray-100'>
      <View className='w-[55%] py-3 flex flex-row items-center justify-between'>
        <View className='w-[18%]'>
          <Text className='text-base text-gray-800'>{item.memberNumber}</Text>
        </View>
        <View className='w-[18%]'>
          <Text className='text-base text-gray-800'>{item.name}</Text>
        </View>
        <View className='w-[30%] flex-col justify-center'>
          {item.receptionist.includes('(') ? (
            <>
              <Text className='text-sm text-gray-800 font-medium leading-tight'>
                {item.receptionist.split(' (')[0]}
              </Text>
              <Text className='text-xs text-gray-500 leading-tight'>
                {item.receptionist.split(' (')[1]?.replace(')', '') || ''}
              </Text>
            </>
          ) : (
            <Text className='text-sm text-gray-800'>{item.receptionist}</Text>
          )}
        </View>
        <View className='w-[34%]'>
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
