import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import {
  ORDER_RECEIPT_METHODS,
  OrderReceiptMethodSelectorProps,
} from '../../types';

export default function OrderMethodSelector({
  selectedOrderMethod,
  onOrderMethodPress,
}: OrderReceiptMethodSelectorProps) {
  return (
    // 주문 방법 선택 섹션 - 매장, 포장 중 선택
    <View className='mt-6'>
      {/* 섹션 제목 */}
      <Text className='text-lg font-pretendard-bold text-[#191f28] mb-3'>
        주문 방식
      </Text>

      {/* 주문 방식 선택 버튼들 */}
      <View className='w-full flex-row gap-3'>
        {ORDER_RECEIPT_METHODS.map(method => {
          const selected = selectedOrderMethod === method.id;
          return (
            <Pressable
              key={method.id}
              onPress={() => onOrderMethodPress(method.id)}
              className={clsx(
                'flex-1 h-14 rounded-2xl border flex-row items-center justify-center gap-2',
                {
                  'border-primaryGreen bg-[#f0faf6]': selected,
                  'border-gray-200 bg-white': !selected,
                }
              )}
            >
              <Ionicons
                name={method.icon as keyof typeof Ionicons.glyphMap}
                size={18}
                color={selected ? '#03b26c' : '#8b95a1'}
              />
              <Text
                className={clsx('text-sm font-pretendard-bold', {
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
