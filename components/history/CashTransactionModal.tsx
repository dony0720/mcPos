import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Transaction, TransactionType } from '../../types';

/**
 * 입출금 거래 전용 모달 컴포넌트
 * - 입금/출금 거래의 상세 정보를 표시하는 모달
 * - 메모와 금액 정보에 집중한 단순한 UI 제공
 */

interface CashTransactionModalProps {
  visible: boolean;
  transaction?: Transaction | null;
  onClose: () => void;
  onPrint: () => void;
}

export default function CashTransactionModal({
  visible,
  transaction,
  onClose,
  onPrint,
}: CashTransactionModalProps) {
  // 거래 정보가 없으면 빈 모달 표시
  if (!transaction) {
    return null;
  }

  // 입출금 거래가 아닌 경우 null 반환
  if (
    transaction.type !== TransactionType.CASH_DEPOSIT &&
    transaction.type !== TransactionType.CASH_WITHDRAWAL
  ) {
    return null;
  }

  const isDeposit = transaction.type === TransactionType.CASH_DEPOSIT;
  const transactionTypeLabel = isDeposit ? '현금 입금' : '현금 출금';
  const amountColor = isDeposit ? 'text-green-600' : 'text-red-600';
  const amountPrefix = isDeposit ? '+' : '-';

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50 px-8'>
        <View className='bg-white rounded-2xl p-6 w-full max-w-md h-[60%]'>
          {/* 모달 헤더 */}
          <View className='flex-row justify-end mb-4'>
            <Pressable onPress={onClose} className='p-2'>
              <Ionicons name='close' size={24} color='#666' />
            </Pressable>
          </View>

          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {/* 입출금 거래 정보 */}
            <View className='items-center mb-6'>
              <Text className='text-lg font-bold mb-2'>
                목천카페{' '}
                {new Date(transaction.timestamp).toLocaleDateString('ko-KR')}{' '}
                {new Date(transaction.timestamp).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text className='text-base font-medium mb-1'>
                거래번호: #{transaction.id.substring(4, 12)}
              </Text>
              <View className='bg-gray-100 px-3 py-1 rounded-full'>
                <Text className='text-sm text-gray-700 font-medium'>
                  {transactionTypeLabel}
                </Text>
              </View>
            </View>

            {/* 구분선 */}
            <View className='w-full h-px bg-gray-300 mb-6' />

            {/* 금액 정보 - 강조 표시 */}
            <View className='items-center mb-6'>
              <Text className='text-sm text-gray-600 mb-2'>거래 금액</Text>
              <Text className={`text-3xl font-bold ${amountColor}`}>
                {amountPrefix}
                {transaction.totalAmount.toLocaleString()}원
              </Text>
            </View>

            {/* 구분선 */}
            <View className='w-full h-px bg-gray-300 mb-6' />

            {/* 메모 내용 */}
            <View className='mb-6'>
              <Text className='text-base font-medium mb-3 text-gray-800'>
                메모
              </Text>
              <View className='bg-gray-50 rounded-lg p-4 min-h-[80px]'>
                <Text className='text-gray-700 text-base leading-6'>
                  {transaction.description || '메모가 없습니다.'}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* 출력 버튼 */}
          <Pressable
            onPress={onPrint}
            className='bg-blue-500 rounded-lg py-3 px-6 items-center'
          >
            <View className='flex-row items-center'>
              <Ionicons name='print' size={20} color='white' />
              <Text className='text-white font-medium ml-2'>출력하기</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
