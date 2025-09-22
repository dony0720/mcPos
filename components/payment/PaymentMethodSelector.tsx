import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  CASH_REGISTER_PAYMENTS,
  CashRegisterPayment,
  CashRegisterPaymentSelectorProps,
  PaymentIconName,
} from '../../types';

/**
 * 결제 방법 선택 컴포넌트
 * - SRP: 결제 방법 선택 UI만 담당
 * - 타입 안전성: PaymentIconName으로 아이콘 타입 보장
 */
export default function PaymentMethodSelector({
  selectedPaymentMethod,
  onPaymentMethodPress,
}: CashRegisterPaymentSelectorProps) {
  /**
   * 타입 안전한 아이콘 렌더링 함수
   * @param iconName - PaymentIconName 타입의 아이콘 이름
   * @param selected - 선택된 상태 여부
   */
  const renderIcon = (iconName: PaymentIconName, selected: boolean) => {
    return (
      <Ionicons
        name={iconName as keyof typeof Ionicons.glyphMap}
        size={24}
        color={selected ? '#000000' : '#6B7280'}
      />
    );
  };
  return (
    // 결제 방법 선택 섹션 - 현금, 이체, 쿠폰, 장부 중 선택
    <View>
      {/* 섹션 제목 */}
      <Text className='text-2xl font-medium mt-6 mb-6'>결제수단</Text>

      {/* 결제 방법 선택 버튼들 */}
      <View className='w-full flex flex-row gap-4'>
        {CASH_REGISTER_PAYMENTS.map((method: CashRegisterPayment) => (
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
            {renderIcon(method.icon, selectedPaymentMethod === method.id)}
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
