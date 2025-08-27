import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';

import { useButtonAnimation } from '../../hooks';
import type { OrderSectionProps } from '../../types';
import { calculateItemPrice } from '../../utils';
import OrderItem from './OrderItem';

export default function OrderSection({
  items,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
}: OrderSectionProps) {
  const paymentAnimation = useButtonAnimation();
  const router = useRouter();

  const handlePaymentPress = () => {
    router.push('/payment');
  };

  return (
    <View className='w-full flex-[7] box-border px-[5%] flex flex-col gap-2'>
      <View className='w-full h-full box-border py-4 flex flex-row gap-2'>
        <View className='w-[70%] bg-gray-100 rounded-lg p-4'>
          <ScrollView
            className='flex-1'
            showsVerticalScrollIndicator={false}
            contentContainerClassName='gap-4'
          >
            {items.map(item => {
              // 유틸리티 함수로 단위 가격 계산
              const itemUnitPrice = calculateItemPrice(item);

              return (
                <OrderItem
                  key={item.id}
                  menuName={`${item.menuItem.name} (${item.menuItem.temperature})`}
                  options={item.options}
                  quantity={item.quantity}
                  price={`${itemUnitPrice.toLocaleString()}원`}
                  onIncrease={() => onUpdateQuantity(item.id, 1)}
                  onDecrease={() => onUpdateQuantity(item.id, -1)}
                  onRemove={() => onRemoveItem(item.id)}
                />
              );
            })}
          </ScrollView>
        </View>
        <View className='w-[30%] h-full rounded-lg px-4'>
          <View className='w-full h-full flex flex-col justify-between gap-4'>
            <View className='w-full flex gap-2 text-gray-500'>
              <Text className='text-2xl'>총 결제 금액</Text>
              <Text className='text-4xl font-bold'>
                {totalAmount.toLocaleString()}원
              </Text>
            </View>
            <Pressable
              className='w-full h-[90px]'
              onPressIn={paymentAnimation.onPressIn}
              onPressOut={paymentAnimation.onPressOut}
              onPress={handlePaymentPress}
            >
              <Animated.View
                className='w-full h-full bg-primaryGreen rounded-lg flex items-center justify-center'
                style={{
                  transform: [{ scale: paymentAnimation.scaleAnim }],
                }}
              >
                <Text className='text-white text-3xl font-bold'>결제하기</Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
