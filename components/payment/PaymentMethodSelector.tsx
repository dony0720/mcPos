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
  const renderIcon = (iconName: PaymentIconName, selected: boolean) => {
    return (
      <Ionicons
        name={iconName as keyof typeof Ionicons.glyphMap}
        size={20}
        color={selected ? '#fff' : '#8b95a1'}
      />
    );
  };
  return (
    // 결제 방법 선택 섹션 - 현금, 이체, 쿠폰, 장부 중 선택 (카드 그리드)
    <View>
      {/* 섹션 제목 */}
      <Text className='text-lg font-pretendard-bold text-[#191f28] mb-3'>
        결제수단
      </Text>

      {/* 결제 방법 선택 카드들 */}
      <View className='w-full flex-row flex-wrap gap-3'>
        {CASH_REGISTER_PAYMENTS.map((method: CashRegisterPayment) => {
          const selected = selectedPaymentMethod === method.id;
          return (
            <Pressable
              key={method.id}
              onPress={() => onPaymentMethodPress(method.id)}
              className={clsx(
                'w-[48%] h-[92px] rounded-2xl border-2 px-5 py-4 justify-between',
                {
                  'border-primaryGreen bg-[#f0faf6]': selected,
                  'border-gray-200 bg-white': !selected,
                }
              )}
            >
              <View
                className={clsx(
                  'w-9 h-9 rounded-[10px] flex items-center justify-center',
                  {
                    'bg-primaryGreen': selected,
                    'bg-gray-100': !selected,
                  }
                )}
              >
                {renderIcon(method.icon, selected)}
              </View>
              <Text
                className={clsx('text-base font-pretendard-bold', {
                  'text-primaryGreen': selected,
                  'text-gray-500': !selected,
                })}
              >
                {method.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
