import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface PaymentMethodSelectorProps {
  selectedPaymentMethod: string | null;
  onPaymentMethodPress: (methodId: string) => void;
}

// 결제 수단 옵션 데이터 - 현금, 카드, 쿠폰, 장부 결제
const paymentMethods = [
  { id: 'cash', name: '현금', icon: 'cash-outline' },
  { id: 'transfer', name: '이체', icon: 'card-outline' },
  { id: 'coupon', name: '쿠폰', icon: 'ticket-outline' },
  { id: 'ledger', name: '장부', icon: 'book-outline' },
];

export default function PaymentMethodSelector({
  selectedPaymentMethod,
  onPaymentMethodPress,
}: PaymentMethodSelectorProps) {
  return (
    // 결제 방법 선택 섹션 - 현금, 이체, 쿠폰, 장부 중 선택
    <View>
      {/* 섹션 제목 */}
      <Text className='text-3xl font-medium mt-6 mb-6'>결제수단</Text>

      {/* 결제 방법 선택 버튼들 */}
      <View className='w-full flex flex-row gap-4'>
        {paymentMethods.map(method => (
          <Pressable
            key={method.id}
            onPress={() => onPaymentMethodPress(method.id)}
            className={clsx(
              'flex-1 h-24 rounded-lg border flex items-center justify-center gap-2',
              {
                'border-black bg-gray-100': selectedPaymentMethod === method.id,
                'border-gray-300 bg-white': selectedPaymentMethod !== method.id,
              }
            )}
          >
            <Ionicons
              name={method.icon as any}
              size={24}
              color={
                selectedPaymentMethod === method.id ? '#000000' : '#6B7280'
              }
            />
            <Text
              className={clsx('text-lg font-medium', {
                'text-black': selectedPaymentMethod === method.id,
                'text-gray-500': selectedPaymentMethod !== method.id,
              })}
            >
              {method.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
