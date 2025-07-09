import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { LedgerData } from './types';

interface ActionButtonsProps {
  item: LedgerData;
  onCharge: (item: LedgerData) => void;
  onHistory: (item: LedgerData) => void;
  onDelete: (item: LedgerData) => void;
}

export default function ActionButtons({
  item,
  onCharge,
  onHistory,
  onDelete,
}: ActionButtonsProps) {
  return (
    <View className='w-[40%] py-3 flex flex-row items-center justify-between gap-2'>
      {/* 충전 버튼 */}
      <Pressable
        onPress={() => onCharge(item)}
        className='flex-1 h-12 max-h-12 flex-row items-center justify-center gap-1 bg-green-500 rounded-lg'
      >
        <Ionicons name='wallet' size={14} color='white' />
        <Text className='text-white font-semibold text-base'>충전</Text>
      </Pressable>

      {/* 내역 버튼 */}
      <Pressable
        onPress={() => onHistory(item)}
        className='flex-1 h-12 max-h-12 flex-row items-center justify-center gap-1 bg-blue-500 rounded-lg'
      >
        <Ionicons name='receipt' size={14} color='white' />
        <Text className='text-white font-semibold text-base'>내역</Text>
      </Pressable>

      {/* 삭제 버튼 */}
      <Pressable
        onPress={() => onDelete(item)}
        className='flex-1 h-12 max-h-12 flex-row items-center justify-center gap-1 bg-red-500 rounded-lg'
      >
        <Ionicons name='trash' size={14} color='white' />
        <Text className='text-white font-semibold text-base'>삭제</Text>
      </Pressable>
    </View>
  );
}
