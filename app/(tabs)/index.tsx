import React from 'react';
import {
  Pressable,
  Text,
  View,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CategoryTabs from '../../components/menuSelection/CategoryTabs';
import PaginationButtons from '../../components/menuSelection/menuSelction';
import McPosLogo from '../../assets/icon/mcPosLogo.svg';
import OrderItem from '../../components/order/OrderItem';
import { useButtonAnimation } from '../../hooks/useButtonAnimation';

export default function MenuSelection() {
  const adminAnimation = useButtonAnimation();
  const paymentAnimation = useButtonAnimation();

  const handleUpPress = () => {
    // 위쪽 페이지네이션 로직
    console.log('Up button pressed');
  };

  const handleDownPress = () => {
    // 아래쪽 페이지네이션 로직
    console.log('Down button pressed');
  };

  // 임시 메뉴 데이터
  const menuItems = Array(12)
    .fill(null)
    .map((_, index) => ({
      id: index,
      name: '아메리카노',
      price: '1,500원',
    }));

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

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      {/* 헤더 */}
      <View className='w-full h-[80px] box-border px-[5%] mt-[25px] flex flex-row justify-between items-center '>
        <McPosLogo width={150} height={150} />
        <Pressable
          onPressIn={adminAnimation.onPressIn}
          onPressOut={adminAnimation.onPressOut}
        >
          <Animated.View
            className='flex justify-center items-center bg-primaryGreen rounded-lg w-[150px] h-[40px]'
            style={{
              transform: [{ scale: adminAnimation.scaleAnim }],
            }}
          >
            <Text className='text-white text-[16px] font-bold'>
              관리자 모드
            </Text>
          </Animated.View>
        </Pressable>
      </View>
      {/* 카테고리 탭 */}
      <CategoryTabs />
      {/* 메뉴 리스트 */}
      <View className='flex flex-row w-full h-[65%] box-border px-[5%] py-[3%] items-center'>
        <View className='flex-1 h-full'>
          <View className='flex-row flex-wrap h-full justify-between content-between'>
            {menuItems.map(item => (
              <View key={item.id} className='w-1/4 pr-3 pl-0 box-border'>
                <View className='w-full flex flex-col rounded-lg gap-2'>
                  <View className='overflow-hidden rounded-lg aspect-square'>
                    <Image
                      source={require('../../assets/images/coffeeTest.png')}
                      className='w-full h-full'
                      resizeMode='cover'
                    />
                  </View>
                  <View className='px-1'>
                    <Text className='font-medium text-base'>{item.name}</Text>
                    <Text className='text-gray-600 text-sm mt-1'>
                      {item.price}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
        {/* 페이지네이션 버튼 */}
        <PaginationButtons
          onUpPress={handleUpPress}
          onDownPress={handleDownPress}
        />
      </View>
      <Text className='w-full box-border px-[5%] text-2xl font-bold'>
        주문 내역
      </Text>

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
            <View className='w-full h-full flex flex-col justify-between gap-2'>
              <View className='w-full flex gap-2 text-gray-500'>
                <Text className='text-xl'>총 결제 금액</Text>
                <Text className='text-3xl font-bold'>10,000원</Text>
              </View>
              <Pressable
                className='w-full h-[100px]'
                onPressIn={paymentAnimation.onPressIn}
                onPressOut={paymentAnimation.onPressOut}
              >
                <Animated.View
                  className='w-full h-full bg-primaryGreen rounded-lg flex items-center justify-center'
                  style={{
                    transform: [{ scale: paymentAnimation.scaleAnim }],
                  }}
                >
                  <Text className='text-white text-4xl font-bold'>
                    결제하기
                  </Text>
                </Animated.View>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
