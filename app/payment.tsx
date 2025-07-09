// payment.tsx - 퍼블리싱 작업용 간소화된 결제 페이지

import React, { useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';

import DiscountSection from '../components/payment/DiscountSection';
import NumberInputModal from '../components/payment/NumberInputModal';
import OrderMethodSelector from '../components/payment/OrderMethodSelector';
import PaymentHeader from '../components/payment/PaymentHeader';
import PaymentMenuItem from '../components/payment/PaymentMenuItem';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import SelectAllCheckbox from '../components/payment/SelectAllCheckbox';
import { useButtonAnimation } from '../hooks';

export default function Payment() {
  // 간단한 상태 관리
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('cash');
  const [selectedOrderMethod, setSelectedOrderMethod] =
    useState<string>('store');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'phone' | 'pickup'>('pickup');
  const [isLedgerFirstStep, setIsLedgerFirstStep] = useState(false);

  const paymentButtonAnimation = useButtonAnimation();

  // 간단한 핸들러들
  const handleBack = () => {
    console.log('뒤로가기');
  };

  const handleDelete = () => {
    console.log('삭제');
  };

  const handleDiscountSelect = () => {
    console.log('할인 선택');
  };

  const handleDiscountDelete = () => {
    console.log('할인 삭제');
  };

  const handlePaymentPress = () => {
    if (selectedPaymentMethod === 'ledger') {
      setModalType('phone');
      setIsLedgerFirstStep(true);
      setShowModal(true);
    } else {
      setModalType('pickup');
      setIsLedgerFirstStep(false);
      setShowModal(true);
    }
  };

  const handleModalConfirm = (number: string) => {
    if (isLedgerFirstStep) {
      // 장부 번호 입력 완료 → 픽업 번호 입력으로 이동
      console.log('장부 번호:', number);
      setIsLedgerFirstStep(false);
      setModalType('pickup');
      // 첫 번째 단계 완료 후 모달 상태 유지하여 바로 픽업 번호 입력으로 이동
    } else {
      // 픽업 번호 입력 완료 또는 일반 결제 완료
      console.log('픽업 번호:', number);
      setShowModal(false);
    }
  };

  // 목업 데이터
  const mockOrderItems = [
    {
      id: 1,
      name: '아메리카노',
      options: ['HOT', 'Regular'],
      price: 4500,
    },
    {
      id: 2,
      name: '카페라떼',
      options: ['ICE', 'Large'],
      price: 5500,
    },
    {
      id: 3,
      name: '카푸치노',
      options: ['HOT', 'Regular'],
      price: 5000,
    },
    {
      id: 4,
      name: '바닐라라떼',
      options: ['ICE', 'Large', '시럽 추가'],
      price: 6000,
    },
    {
      id: 5,
      name: '카라멜마키아토',
      options: ['HOT', 'Regular', '휘핑크림'],
      price: 6500,
    },
  ];

  const totalAmount = mockOrderItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <View className='h-full w-full box-border bg-white flex flex-col'>
      {/* 상단 헤더 섹션 */}
      <PaymentHeader onBack={handleBack} />

      {/* 전체 선택 체크박스 섹션 */}
      <SelectAllCheckbox
        isChecked={isChecked}
        onCheckboxPress={() => setIsChecked(!isChecked)}
        title='결제 정보'
      />

      {/* 주문 메뉴 목록 섹션 */}
      <ScrollView
        className='w-full h-[50%] px-6 box-border overflow-hidden'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16, paddingVertical: 16 }}
      >
        {mockOrderItems.map(item => (
          <PaymentMenuItem
            key={item.id}
            isChecked={isChecked}
            onCheckboxPress={() => setIsChecked(!isChecked)}
            menuName={item.name}
            options={item.options.join(', ')}
            price={`${item.price.toLocaleString()}원`}
            onDeletePress={handleDelete}
          />
        ))}
      </ScrollView>

      {/* 구분선 */}
      <View className='w-full h-[1px] bg-gray-300' />

      <View className='w-full h-[50%] px-6 box-border'>
        {/* 결제 방법 선택 섹션 */}
        <PaymentMethodSelector
          selectedPaymentMethod={selectedPaymentMethod}
          onPaymentMethodPress={setSelectedPaymentMethod}
        />

        {/* 주문 방법 선택 섹션 */}
        <OrderMethodSelector
          selectedOrderMethod={selectedOrderMethod}
          onOrderMethodPress={setSelectedOrderMethod}
        />

        {/* 할인 적용 섹션 */}
        <DiscountSection
          onDiscountSelect={handleDiscountSelect}
          onDiscountDelete={handleDiscountDelete}
        />

        {/* 최종 결제 버튼 섹션 */}
        <Pressable
          onPressIn={paymentButtonAnimation.onPressIn}
          onPressOut={paymentButtonAnimation.onPressOut}
          onPress={handlePaymentPress}
        >
          <Animated.View
            className='w-full h-16 sm:h-20 lg:h-24 min-h-16 max-h-28 bg-primaryGreen flex items-center justify-center rounded-lg'
            style={{
              transform: [{ scale: paymentButtonAnimation.scaleAnim }],
            }}
          >
            <Text className='text-white text-3xl font-bold'>
              {totalAmount.toLocaleString()}원 결제하기
            </Text>
          </Animated.View>
        </Pressable>

        {/* 단일 모달 - props 간소화 */}
        <NumberInputModal
          visible={showModal}
          onClose={() => {
            if (!isLedgerFirstStep) {
              setShowModal(false);
            }
          }}
          onConfirm={handleModalConfirm}
          type={modalType}
        />
      </View>
    </View>
  );
}
