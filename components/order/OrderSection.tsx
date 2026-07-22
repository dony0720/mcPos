import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';

import { useButtonAnimation } from '../../hooks';
import type { OrderSectionProps } from '../../types';
import { calculateItemPrice, calculateMenuUnitPrice } from '../../utils';
import OrderItem from './OrderItem';

export default function OrderSection({
  items,
  itemCount,
  totalAmount,
  onUpdateQuantity,
  onRemoveItem,
  onClearAll,
}: OrderSectionProps) {
  const paymentAnimation = useButtonAnimation();
  const router = useRouter();

  const handlePaymentPress = () => {
    router.push('/payment');
  };

  // 할인 전 상품금액 합계 및 할인 금액 계산
  const subtotal = items.reduce(
    (sum, item) =>
      sum + calculateMenuUnitPrice(item.menuItem, item.options) * item.quantity,
    0
  );
  const discountAmount = Math.max(0, subtotal - totalAmount);

  return (
    <View className='w-[404px] h-full bg-white flex flex-col'>
      {/* 주문서 헤더 */}
      <View className='flex-row items-baseline gap-2 px-6 pt-5 pb-3 border-b border-gray-100'>
        <Text className='font-pretendard-bold text-gray-900 text-xl'>
          주문서
        </Text>
        <Text className='font-pretendard-bold text-primaryGreen text-base'>
          총 {itemCount}개
        </Text>
        <Pressable className='ml-auto' onPress={onClearAll}>
          <Text className='text-gray-400 font-pretendard text-sm'>
            전체삭제
          </Text>
        </Pressable>
      </View>

      {/* 장바구니 리스트 */}
      <ScrollView className='flex-1 px-6' showsVerticalScrollIndicator={false}>
        {items.map(item => {
          const itemTotalPrice = calculateItemPrice(item);

          let originalTotalPrice = null;
          if (item.discount) {
            const originalUnitPrice = calculateMenuUnitPrice(
              item.menuItem,
              item.options
            );
            originalTotalPrice = originalUnitPrice * item.quantity;
          }

          return (
            <OrderItem
              key={item.id}
              menuName={`${item.menuItem.name} (${item.menuItem.temperature})`}
              options={item.options}
              quantity={item.quantity}
              price={`${itemTotalPrice.toLocaleString()}원`}
              discount={item.discount}
              originalPrice={
                originalTotalPrice
                  ? `${originalTotalPrice.toLocaleString()}원`
                  : undefined
              }
              onIncrease={() => onUpdateQuantity(item.id, 1)}
              onDecrease={() => onUpdateQuantity(item.id, -1)}
              onRemove={() => onRemoveItem(item.id)}
            />
          );
        })}
      </ScrollView>

      {/* 합계 및 결제 버튼 */}
      <View className='px-6 pt-4 pb-6 border-t border-gray-100'>
        <View className='flex-row justify-between mb-2'>
          <Text className='text-gray-500 text-[15px]'>상품금액</Text>
          <Text className='text-gray-500 text-[15px]'>
            {subtotal.toLocaleString()}원
          </Text>
        </View>
        <View className='flex-row justify-between mb-4'>
          <Text className='text-gray-500 text-[15px]'>할인</Text>
          <Text className='text-[#f04452] text-[15px]'>
            −{discountAmount.toLocaleString()}원
          </Text>
        </View>
        <View className='flex-row justify-between items-baseline mb-5'>
          <Text className='font-pretendard-bold text-gray-900 text-lg'>
            결제금액
          </Text>
          <Text className='font-pretendard-bold text-gray-900 text-[26px]'>
            {totalAmount.toLocaleString()}원
          </Text>
        </View>
        <Pressable
          className='w-full h-[60px]'
          onPressIn={paymentAnimation.onPressIn}
          onPressOut={paymentAnimation.onPressOut}
          onPress={handlePaymentPress}
        >
          <Animated.View
            className='w-full h-full bg-primaryGreen rounded-2xl flex items-center justify-center'
            style={{
              transform: [{ scale: paymentAnimation.scaleAnim }],
            }}
          >
            <Text className='text-white text-lg font-pretendard-bold'>
              결제하기
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}
