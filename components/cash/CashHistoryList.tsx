import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

import { useCashStore } from '../../stores/useCashStore';

// 시재 거래 내역 리스트
export default function CashHistoryList() {
  const transactions = useCashStore(state => state.transactions);

  if (!transactions.length) {
    return (
      <View className='mt-8 bg-gray-50 border border-gray-200 rounded-xl p-6 items-center'>
        <Text className='text-gray-500'>시재 내역이 없습니다.</Text>
      </View>
    );
  }

  return (
    <View className='mt-8'>
      {/* 헤더 */}
      <View className='flex-row items-center justify-between mb-4'>
        <Text className='text-xl font-bold text-gray-800'>시재 내역</Text>
        <Text className='text-gray-500'>
          최근 {Math.min(transactions.length, 10)}건
        </Text>
      </View>

      <View className='bg-white border border-gray-200 rounded-xl'>
        {transactions.slice(0, 10).map((t, index) => {
          const isDeposit = t.type === 'deposit';
          const iconName = isDeposit ? 'arrow-down-circle' : 'arrow-up-circle';
          const iconColor = isDeposit ? '#059669' : '#DC2626';
          const amountColor = isDeposit ? 'text-emerald-700' : 'text-red-700';
          const sign = isDeposit ? '+' : '-';
          const date = new Date(t.timestamp);

          return (
            <View
              key={t.id}
              className={`flex-row items-center justify-between px-4 py-3 ${
                index !== transactions.slice(0, 10).length - 1
                  ? 'border-b border-gray-100'
                  : ''
              }`}
            >
              <View className='flex-row items-center gap-3'>
                <Ionicons name={iconName as any} size={20} color={iconColor} />
                <View>
                  <Text className='text-gray-900 font-medium'>
                    {t.description || (isDeposit ? '현금 입금' : '현금 출금')}
                  </Text>
                  <Text className='text-gray-400 text-xs'>
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                  </Text>
                </View>
              </View>
              <Text className={`${amountColor} font-semibold`}>
                {sign}
                {t.amount.toLocaleString()}원
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
