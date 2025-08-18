import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { FilterType } from '../../types';

interface EmptyStateProps {
  selectedFilter: FilterType;
}

export default function EmptyState({ selectedFilter }: EmptyStateProps) {
  return (
    <View className='flex-1 justify-center items-center py-20'>
      <Ionicons name='receipt-outline' size={64} color='#D1D5DB' />
      <Text className='text-gray-500 text-lg mt-4'>
        {selectedFilter === FilterType.ALL
          ? '거래내역이 없습니다'
          : `${selectedFilter} 거래내역이 없습니다`}
      </Text>
    </View>
  );
}
