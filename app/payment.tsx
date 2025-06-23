import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import PaymentMenuItem from '../components/payment/PaymentMenuItem';
import PaymentHeader from '../components/payment/PaymentHeader';
import SelectAllCheckbox from '../components/payment/SelectAllCheckbox';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import OrderMethodSelector from '../components/payment/OrderMethodSelector';
import DiscountSection from '../components/payment/DiscountSection';
import { useButtonAnimation } from '../hooks/useButtonAnimation';

export default function Payment() {
  const router = useRouter();
  const paymentButtonAnimation = useButtonAnimation();
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);
  const [selectedOrderMethod, setSelectedOrderMethod] = useState<string | null>(
    null
  );

  const paymentMethods = [
    { id: 'cash', name: '현금', icon: 'cash-outline' },
    { id: 'transfer', name: '이체', icon: 'card-outline' },
    { id: 'coupon', name: '쿠폰', icon: 'ticket-outline' },
    { id: 'ledger', name: '장부', icon: 'book-outline' },
  ];

  const handleBackPress = () => {
    router.push('/(tabs)');
  };

  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
  };

  const handleDeletePress = () => {
    console.log('Delete menu item');
    // 여기에 메뉴 아이템 삭제 로직 추가
  };

  const handlePaymentMethodPress = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleOrderMethodPress = (methodId: string) => {
    setSelectedOrderMethod(methodId);
  };

  const handleDiscountSelect = () => {
    console.log('할인 선택');
    // 할인 선택 로직 추가
  };

  const handleDiscountDelete = () => {
    console.log('할인 삭제');
    // 할인 삭제 로직 추가
  };

  const handlePaymentPress = () => {
    console.log('결제 진행');
    // 결제 로직 추가
    // 여기서 다음 결제 단계나 결제 완료 페이지로 이동할 수 있습니다
  };

  return (
    <View className='h-full w-full box-border bg-white flex flex-col'>
      <PaymentHeader onBackPress={handleBackPress} />

      <SelectAllCheckbox
        isChecked={isChecked}
        onCheckboxPress={handleCheckboxPress}
        title='결제 정보'
      />

      {/* 메뉴 아이템 */}
      <ScrollView
        className='w-full h-[50%] px-[5%] box-border overflow-hidden'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        {Array.from({ length: 10 }).map((_, index) => (
          <PaymentMenuItem
            key={index}
            isChecked={isChecked}
            onCheckboxPress={handleCheckboxPress}
            menuName='아메리카노 (HOT)'
            options='연하게, 샷추가, 휘핑추가'
            price='6000원'
            onDeletePress={handleDeletePress}
          />
        ))}
      </ScrollView>

      <View className='w-full h-[1px] bg-gray-300' />

      <View className='w-full h-[50%] px-[5%] box-border'>
        <PaymentMethodSelector
          selectedPaymentMethod={selectedPaymentMethod}
          onPaymentMethodPress={handlePaymentMethodPress}
        />

        <OrderMethodSelector
          selectedOrderMethod={selectedOrderMethod}
          onOrderMethodPress={handleOrderMethodPress}
        />

        <DiscountSection
          onDiscountSelect={handleDiscountSelect}
          onDiscountDelete={handleDiscountDelete}
        />

        <Pressable
          onPressIn={paymentButtonAnimation.onPressIn}
          onPressOut={paymentButtonAnimation.onPressOut}
          onPress={handlePaymentPress}
        >
          <Animated.View
            className='w-full h-[80px] bg-primaryGreen flex items-center justify-center rounded-lg'
            style={{
              transform: [{ scale: paymentButtonAnimation.scaleAnim }],
            }}
          >
            <Text className='text-white text-3xl font-bold'>
              14,000원 결제하기
            </Text>
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}
