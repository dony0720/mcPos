import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface OrderMethod {
  id: string;
  name: string;
  icon: string;
}

interface OrderMethodSelectorProps {
  selectedOrderMethod: string | null;
  onOrderMethodPress: (methodId: string) => void;
}

// 주문 방식 옵션 데이터 - 테이크아웃, 매장 내 식사
const orderMethods: OrderMethod[] = [
  { id: 'takeout', name: '테이크아웃', icon: 'bag-outline' },
  { id: 'dine-in', name: '매장', icon: 'restaurant-outline' },
];

export default function OrderMethodSelector({
  selectedOrderMethod,
  onOrderMethodPress,
}: OrderMethodSelectorProps) {
  return (
    // 주문 방법 선택 섹션 - 매장, 포장, 배달 중 선택
    <View>
      {/* 섹션 제목 */}
      <Text className='text-3xl font-medium my-6'>주문 방식</Text>

      {/* 주문 방식 선택 버튼들 */}
      <View className='w-full flex flex-row gap-4'>
        {orderMethods.map(method => (
          <Pressable
            key={method.id}
            onPress={() => onOrderMethodPress(method.id)}
            className={clsx(
              'flex-1 h-24 rounded-lg border flex items-center justify-center gap-2',
              {
                'border-black bg-gray-100': selectedOrderMethod === method.id,
                'border-gray-300 bg-white': selectedOrderMethod !== method.id,
              }
            )}
          >
            <Ionicons
              name={method.icon as any}
              size={24}
              color={selectedOrderMethod === method.id ? '#000000' : '#6B7280'}
            />
            <Text
              className={clsx('text-lg font-medium', {
                'text-black': selectedOrderMethod === method.id,
                'text-gray-500': selectedOrderMethod !== method.id,
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
