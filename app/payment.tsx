import React, { useState } from 'react';
import { View, ScrollView, Text, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import PaymentMenuItem from '../components/payment/PaymentMenuItem';
import PaymentHeader from '../components/payment/PaymentHeader';
import SelectAllCheckbox from '../components/payment/SelectAllCheckbox';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import OrderMethodSelector from '../components/payment/OrderMethodSelector';
import DiscountSection from '../components/payment/DiscountSection';
import NumberInputModal from '../components/payment/NumberInputModal';
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
  const [showUniqueNumberModal, setShowUniqueNumberModal] = useState(false);
  const [showPickupNumberModal, setShowPickupNumberModal] = useState(false);
  const [uniqueNumber, setUniqueNumber] = useState<string>('');

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
    if (selectedPaymentMethod === 'ledger') {
      // 장부 결제일 때는 먼저 고유 번호 입력
      setShowUniqueNumberModal(true);
    } else {
      // 다른 결제 방법일 때는 바로 픽업 번호 입력
      setShowPickupNumberModal(true);
    }
  };

  const handleUniqueNumberModalClose = () => {
    setShowUniqueNumberModal(false);
  };

  const handleUniqueNumberConfirm = (number: string) => {
    console.log('선택된 고유 번호:', number);
    setUniqueNumber(number);
    setShowUniqueNumberModal(false);
    // 고유 번호 입력 후 픽업 번호 입력 모달 표시
    setShowPickupNumberModal(true);
  };

  const handlePickupNumberModalClose = () => {
    setShowPickupNumberModal(false);
  };

  const handlePickupNumberConfirm = (number: string) => {
    console.log('선택된 픽업 번호:', number);
    if (selectedPaymentMethod === 'ledger') {
      console.log('장부 결제 - 고유번호:', uniqueNumber, '픽업번호:', number);
      // 장부 결제 로직: 고유번호와 픽업번호를 모두 사용
    } else {
      console.log('일반 결제 - 픽업번호:', number);
      // 일반 결제 로직: 픽업번호만 사용
    }

    // 결제 처리 완료 후 초기화
    setUniqueNumber('');

    // 메뉴 선택 페이지로 이동
    router.push('/(tabs)');
  };

  return (
    <View className='h-full w-full box-border bg-white flex flex-col'>
      {/* 상단 헤더 섹션 - 뒤로가기 버튼과 제목 */}
      <PaymentHeader onBackPress={handleBackPress} />

      {/* 전체 선택 체크박스 섹션 - 모든 메뉴 아이템 선택/해제 */}
      <SelectAllCheckbox
        isChecked={isChecked}
        onCheckboxPress={handleCheckboxPress}
        title='결제 정보'
      />

      {/* 주문 메뉴 목록 섹션 - 선택된 메뉴 아이템들 표시 및 개별 삭제 가능 */}
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

      {/* 구분선 */}
      <View className='w-full h-[1px] bg-gray-300' />

      <View className='w-full h-[50%] px-[5%] box-border'>
        {/* 결제 방법 선택 섹션 - 현금, 이체, 쿠폰, 장부 중 선택 */}
        <PaymentMethodSelector
          selectedPaymentMethod={selectedPaymentMethod}
          onPaymentMethodPress={handlePaymentMethodPress}
        />

        {/* 주문 방법 선택 섹션 - 매장, 포장, 배달 중 선택 */}
        <OrderMethodSelector
          selectedOrderMethod={selectedOrderMethod}
          onOrderMethodPress={handleOrderMethodPress}
        />

        {/* 할인 적용 섹션 - 할인 쿠폰이나 할인율 적용 */}
        <DiscountSection
          onDiscountSelect={handleDiscountSelect}
          onDiscountDelete={handleDiscountDelete}
        />

        {/* 최종 결제 버튼 섹션 - 총 금액과 결제 실행 */}
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

        {/* 모달 섹션 - 결제 과정에서 필요한 번호 입력 */}
        {/* 고유 번호 입력 모달 - 장부 결제 시 고객 식별용 번호 입력 */}
        <NumberInputModal
          visible={showUniqueNumberModal}
          onClose={handleUniqueNumberModalClose}
          onConfirm={handleUniqueNumberConfirm}
          type='phone'
        />

        {/* 픽업 번호 입력 모달 - 주문 완료 후 픽업 시 사용할 번호 입력 */}
        <NumberInputModal
          visible={showPickupNumberModal}
          onClose={handlePickupNumberModalClose}
          onConfirm={handlePickupNumberConfirm}
          type='pickup'
        />
      </View>
    </View>
  );
}
