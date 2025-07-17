import React from 'react';
import { ScrollView, Text, View } from 'react-native';

import LedgerTableHeader from './LedgerTableHeader';
import LedgerTableRow from './LedgerTableRow';
import { LedgerData } from './types';

interface LedgerTableProps {
  ledgerData: LedgerData[];
  onCharge: (item: LedgerData) => void;
  onHistory: (item: LedgerData) => void;
  onDelete: (item: LedgerData) => void;
}

export default function LedgerTable({
  ledgerData,
  onCharge,
  onHistory,
  onDelete,
}: LedgerTableProps) {
  return (
    <View className='w-full h-[70%] mt-[20px] rounded-xl border border-gray-300 box-border p-6'>
      <Text className='text-2xl font-medium mb-4'>고객 장부 목록</Text>

      <LedgerTableHeader />

      {/* 테이블 구분선 */}
      <View className='w-full h-[1px] bg-gray-200' />

      {/* 테이블 데이터 목록 */}
      <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
        {ledgerData.map(item => (
          <LedgerTableRow
            key={item.id}
            item={item}
            onCharge={onCharge}
            onHistory={onHistory}
            onDelete={onDelete}
          />
        ))}
      </ScrollView>
    </View>
  );
}
