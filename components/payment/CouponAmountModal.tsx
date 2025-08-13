import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import Keypad from './Keypad';

interface CouponAmountModalProps {
  visible: boolean;
  totalAmount: number;
  onClose: () => void;
  onConfirm: (couponAmount: number, remainingAmount: number) => void;
}

export default function CouponAmountModal({
  visible,
  totalAmount,
  onClose,
  onConfirm,
}: CouponAmountModalProps) {
  const [inputAmount, setInputAmount] = useState<string>('');

  const handleNumberPress = (number: string) => {
    setInputAmount(prev => prev + number);
  };

  const handleBackspace = () => {
    setInputAmount(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    const couponAmount = parseInt(inputAmount) || 0;
    if (couponAmount > 0 && couponAmount <= totalAmount) {
      const remainingAmount = totalAmount - couponAmount;
      setInputAmount('');
      onConfirm(couponAmount, remainingAmount);
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

  // 입력된 쿠폰 금액
  const couponAmount = parseInt(inputAmount) || 0;
  const remainingAmount = totalAmount - couponAmount;
  const isValidAmount = couponAmount > 0 && couponAmount <= totalAmount;

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
            쿠폰 금액을 입력해주세요
          </Text>

          {/* 결제 금액 표시 */}
          <View className='mb-6'>
            <Text className='text-center text-lg text-gray-600 mb-2'>
              총 결제 금액
            </Text>
            <Text className='text-center text-3xl font-bold text-gray-800'>
              {totalAmount.toLocaleString()}원
            </Text>
          </View>

          {/* 입력된 쿠폰 금액 표시 섹션 */}
          <View className='mb-4'>
            <Text className='text-center text-lg text-gray-600 mb-2'>
              쿠폰 금액
            </Text>
            <Text className='text-center text-4xl font-bold text-blue-600'>
              {couponAmount.toLocaleString()}원
            </Text>
          </View>

          {/* 남은 금액 표시 */}
          {couponAmount > 0 && (
            <View className='mb-6'>
              <Text className='text-center text-lg text-gray-600 mb-2'>
                {remainingAmount > 0 ? '남은 금액 (현금 결제)' : '완료'}
              </Text>
              <Text
                className={clsx('text-center text-3xl font-bold', {
                  'text-green-600': isValidAmount,
                  'text-red-500': !isValidAmount,
                })}
              >
                {remainingAmount >= 0
                  ? `${remainingAmount.toLocaleString()}원`
                  : `${Math.abs(remainingAmount).toLocaleString()}원 초과`}
              </Text>

              {/* 안내 메시지 */}
              {isValidAmount && remainingAmount > 0 && (
                <Text className='text-center text-sm text-gray-500 mt-2'>
                  남은 금액은 현금으로 결제됩니다
                </Text>
              )}
              {isValidAmount && remainingAmount === 0 && (
                <Text className='text-center text-sm text-green-600 mt-2'>
                  쿠폰으로 전액 결제 완료
                </Text>
              )}
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

            {/* 확인 버튼 - 유효한 쿠폰 금액인지에 따라 활성화/비활성화 */}
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
