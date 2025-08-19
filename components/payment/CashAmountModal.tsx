import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import Keypad from './Keypad';

interface CashAmountModalProps {
  visible: boolean;
  totalAmount: number;
  onClose: () => void;
  onConfirm: (receivedAmount: number, changeAmount: number) => void;
}

export default function CashAmountModal({
  visible,
  totalAmount,
  onClose,
  onConfirm,
}: CashAmountModalProps) {
  const [inputAmount, setInputAmount] = useState<string>('');

  const handleNumberPress = (number: string) => {
    setInputAmount(prev => prev + number);
  };

  const handleBackspace = () => {
    setInputAmount(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    const receivedAmount = parseInt(inputAmount) || 0;
    if (receivedAmount >= totalAmount) {
      const changeAmount = receivedAmount - totalAmount;
      setInputAmount('');
      onConfirm(receivedAmount, changeAmount);
    }
  };

  const handleCancel = () => {
    setInputAmount('');
    onClose();
  };

  const handleClose = () => {
    setInputAmount('');
    onClose();
  };

  // 입력된 금액
  const receivedAmount = parseInt(inputAmount) || 0;
  const changeAmount = receivedAmount - totalAmount;
  const isValidAmount = receivedAmount >= totalAmount;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='none'
      onRequestClose={handleClose}
    >
      <Pressable
        className='flex-1 bg-black/50 justify-center items-center'
        onPress={handleClose}
      >
        <Pressable
          className='bg-white rounded-3xl w-full max-w-xl px-12 py-8'
          onPress={e => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <View className='flex-row justify-end mb-4'>
            <Pressable
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name='close' size={24} color='#374151' />
            </Pressable>
          </View>

          {/* 모달 제목 섹션 */}
          <Text className='text-xl font-medium text-center mb-6 text-gray-800'>
            받은 금액을 입력해주세요
          </Text>

          {/* 결제 금액 표시 */}
          <View className='mb-6'>
            <Text className='text-center text-lg text-gray-600 mb-2'>
              결제 금액
            </Text>
            <Text className='text-center text-3xl font-bold text-gray-800'>
              {totalAmount.toLocaleString()}원
            </Text>
          </View>

          {/* 입력된 금액 표시 섹션 */}
          <View className='mb-4'>
            <Text className='text-center text-lg text-gray-600 mb-2'>
              받은 금액
            </Text>
            <Text className='text-center text-4xl font-bold text-blue-600'>
              {receivedAmount.toLocaleString()}원
            </Text>
          </View>

          {/* 거스름돈 표시 */}
          {receivedAmount > 0 && (
            <View className='mb-6'>
              <Text className='text-center text-lg text-gray-600 mb-2'>
                거스름돈
              </Text>
              <Text
                className={clsx('text-center text-3xl font-bold', {
                  'text-green-600': isValidAmount,
                  'text-red-500': !isValidAmount,
                })}
              >
                {changeAmount >= 0
                  ? `${changeAmount.toLocaleString()}원`
                  : `${Math.abs(changeAmount).toLocaleString()}원 부족`}
              </Text>
            </View>
          )}

          {/* 번호 입력 키패드 섹션 */}
          <Keypad
            onNumberPress={handleNumberPress}
            onBackspace={handleBackspace}
            currentInput={inputAmount}
          />

          {/* 하단 확인/취소 버튼 섹션 */}
          <View className='flex-row gap-4'>
            {/* 취소 버튼 */}
            <Pressable onPress={handleCancel} className='flex-1'>
              <View className='bg-gray-400 rounded-xl py-4 flex items-center justify-center'>
                <Text className='text-white text-lg font-medium'>취소</Text>
              </View>
            </Pressable>

            {/* 확인 버튼 - 충분한 금액인지에 따라 활성화/비활성화 */}
            <Pressable
              onPress={handleConfirm}
              className='flex-1'
              disabled={!isValidAmount}
            >
              <View
                className={clsx(
                  'rounded-xl py-4 flex items-center justify-center',
                  {
                    'bg-green-500': isValidAmount,
                    'bg-gray-300': !isValidAmount,
                  }
                )}
              >
                <Text
                  className={clsx('text-lg font-medium', {
                    'text-white': isValidAmount,
                    'text-gray-500': !isValidAmount,
                  })}
                >
                  확인
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
