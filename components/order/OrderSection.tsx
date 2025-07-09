import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';

import { useButtonAnimation } from '../../hooks';
import OrderItem from './OrderItem';

export default function OrderSection() {
  const paymentAnimation = useButtonAnimation();
  const router = useRouter();

  // 임시 주문 데이터
  const orderItems = [
    {
      id: 1,
      menuName: '자몽 허니 블랙티 (ICE)',
      options: ['연하게', '샷추가', '휘핑추가', '휘핑추가'],
      quantity: 1,
      price: '6000원',
    },
    {
      id: 2,
      menuName: '아메리카노 (HOT)',
      options: ['샷추가'],
      quantity: 2,
      price: '3000원',
    },
    {
      id: 3,
      menuName: '카페라떼 (ICE)',
      options: ['연하게', '시럽추가'],
      quantity: 1,
      price: '4500원',
    },
    {
      id: 4,
      menuName: '바닐라라떼 (HOT)',
      options: ['휘핑추가', '시럽추가', '샷추가'],
      quantity: 3,
      price: '5500원',
    },
  ];

  const handleQuantityIncrease = (id: number) => {
    console.log('Increase quantity for item:', id);
  };

  const handleQuantityDecrease = (id: number) => {
    console.log('Decrease quantity for item:', id);
  };

  const handleRemoveItem = (id: number) => {
    console.log('Remove item:', id);
  };

  const handlePaymentPress = () => {
    router.push('/payment');
  };

  return (
    <View className='w-full h-[20%] box-border px-[5%] py-2 flex flex-col gap-2'>
      <View className='w-full h-full box-border py-4 flex flex-row gap-2'>
        <View className='w-[65%] bg-gray-100 rounded-lg p-4'>
          <ScrollView
            className='flex-1'
            showsVerticalScrollIndicator={false}
            contentContainerClassName='gap-4'
          >
            {orderItems.map(item => (
              <OrderItem
                key={item.id}
                menuName={item.menuName}
                options={item.options}
                quantity={item.quantity}
                price={item.price}
                onIncrease={() => handleQuantityIncrease(item.id)}
                onDecrease={() => handleQuantityDecrease(item.id)}
                onRemove={() => handleRemoveItem(item.id)}
              />
            ))}
          </ScrollView>
        </View>
        <View className='w-[35%] h-full rounded-lg px-4'>
          <View className='w-full h-full flex flex-col justify-between gap-4'>
            <View className='w-full flex gap-2 text-gray-500'>
              <Text className='text-2xl'>총 결제 금액</Text>
              <Text className='text-4xl font-bold'>10,000원</Text>
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
                <Text className='text-white text-4xl font-bold'>결제하기</Text>
              </Animated.View>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}
