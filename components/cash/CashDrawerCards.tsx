import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { useCashStore } from '../../stores';
import { CashDrawerCardsProps, CashTransactionType } from '../../types';
import CashDrawerCard from './CashDrawerCard';
import CashTransactionModal from './CashTransactionModal';

export default function CashDrawerCards({
  cashDrawerData,
}: CashDrawerCardsProps) {
  const [isDepositModalVisible, setIsDepositModalVisible] = useState(false);
  const [isWithdrawModalVisible, setIsWithdrawModalVisible] = useState(false);

  // 현금 스토어에서 필요한 함수들 가져오기
  const { calculateOptimalBreakdown, applyCashBreakdown } = useCashStore();

  const handleCashDeposit = () => {
    setIsDepositModalVisible(true);
  };

  const handleCashWithdraw = () => {
    setIsWithdrawModalVisible(true);
  };

  // 입금 확인 처리
  const handleDepositConfirm = (amount: number, memo: string) => {
    // 입금 금액을 권종별로 자동 분리
    const breakdown = calculateOptimalBreakdown(amount);

    // 현금 서랍에 반영 (입금이므로 양수로 적용)
    applyCashBreakdown(breakdown, [], CashTransactionType.MANUAL_DEPOSIT, memo);
  };

  // 출금 확인 처리
  const handleWithdrawConfirm = (amount: number, memo: string) => {
    // 출금 금액을 권종별로 자동 분리
    const breakdown = calculateOptimalBreakdown(amount);

    // 현금 서랍에서 차감 (출금이므로 음수로 적용)
    const negativeBreakdown = breakdown.map(item => ({
      ...item,
      quantity: -item.quantity, // 음수로 변환
      total: -item.total, // 음수로 변환
    }));

    applyCashBreakdown(
      [],
      negativeBreakdown,
      CashTransactionType.MANUAL_WITHDRAW,
      memo
    );
  };

  return (
    <View className='mt-8'>
      {/* 헤더 - 제목과 버튼들 */}
      <View className='flex flex-row justify-between items-center mb-6'>
        <Text className='text-2xl font-bold text-gray-800'>현금 서랍 현황</Text>

        {/* 현금 입출금 버튼 */}
        <View className='flex flex-row gap-4'>
          <Pressable
            role='button'
            className='bg-emerald-50 border border-emerald-200 rounded-lg justify-center items-center px-3 py-1 min-h-[45px] min-w-[90px] flex-row'
            onPress={handleCashDeposit}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Ionicons name='add-circle-outline' size={20} color='#059669' />
            <Text className='text-emerald-700 font-semibold text-sm ml-2'>
              입금
            </Text>
          </Pressable>

          <Pressable
            role='button'
            className='bg-red-50 border border-red-200 rounded-lg justify-center items-center px-3 py-1 min-h-[45px] min-w-[90px] flex-row'
            onPress={handleCashWithdraw}
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Ionicons name='remove-circle-outline' size={20} color='#DC2626' />
            <Text className='text-red-700 font-semibold text-sm ml-2'>
              출금
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 권종별 현금 현황 카드 */}
      {/* SalesInfoCards처럼 한 줄에 2개씩 일정하게 배치 */}
      <View className='flex flex-col gap-4'>
        {Array.from({ length: Math.ceil(cashDrawerData.length / 2) }).map(
          (_, rowIndex) => (
            <View key={rowIndex} className='flex flex-row gap-4'>
              {cashDrawerData
                .slice(rowIndex * 2, rowIndex * 2 + 2)
                .map((card, cardIndex) => (
                  <View key={cardIndex} className='flex-1'>
                    <CashDrawerCard
                      type={card.type}
                      title={card.title}
                      theme={card.theme}
                      quantity={`${card.quantity}${
                        card.type === '지폐'
                          ? '장'
                          : card.type === '동전'
                            ? '개'
                            : '매'
                      }`}
                      totalAmount={`${(
                        card.quantity * card.unitValue
                      ).toLocaleString()}원`}
                    />
                  </View>
                ))}
            </View>
          )
        )}
      </View>

      {/* 입금 모달 */}
      <CashTransactionModal
        visible={isDepositModalVisible}
        onClose={() => setIsDepositModalVisible(false)}
        onConfirm={handleDepositConfirm}
        type='deposit'
      />

      {/* 출금 모달 */}
      <CashTransactionModal
        visible={isWithdrawModalVisible}
        onClose={() => setIsWithdrawModalVisible(false)}
        onConfirm={handleWithdrawConfirm}
        type='withdraw'
      />
    </View>
  );
}
