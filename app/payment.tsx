// payment.tsx - 퍼블리싱 작업용 간소화된 결제 페이지

import { router } from 'expo-router';
import React, { useState } from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';

import {
  DiscountSection,
  NumberInputModal,
  OrderMethodSelector,
  PaymentHeader,
  PaymentMenuItem,
  PaymentMethodSelector,
  SelectAllCheckbox,
} from '../components';
import { useButtonAnimation, useModal } from '../hooks';
import { useOrderStore } from '../stores';
import {
  CashRegisterPaymentId,
  NumberInputType,
  OrderReceiptMethodId,
} from '../types';
import { calculateUnitPrice } from '../utils';

export default function Payment() {
  // Zustand 스토어에서 주문 데이터 가져오기
  const { orderItems, totalAmount } = useOrderStore();

  // 간단한 상태 관리
  const [isChecked, setIsChecked] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<CashRegisterPaymentId>('cash');
  const [selectedOrderMethod, setSelectedOrderMethod] =
    useState<OrderReceiptMethodId>('dine-in');

  // 모달 관리
  const { openModal, closeModal, isModalOpen } = useModal();
  const [modalType, setModalType] = useState<NumberInputType>('pickup');
  const [isLedgerFirstStep, setIsLedgerFirstStep] = useState(false);

  const paymentButtonAnimation = useButtonAnimation();

  // 간단한 핸들러들
  const handleBack = () => {
    router.push('/(tabs)');
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

  // 결제 처리 핸들러
  const handlePaymentPress = () => {
    if (selectedPaymentMethod === 'ledger') {
      setModalType('phone');
      setIsLedgerFirstStep(true);
      openModal('numberInput');
    } else {
      setModalType('pickup');
      setIsLedgerFirstStep(false);
      openModal('numberInput');
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
      closeModal();
    }
  };

  const handleModalClose = () => {
    if (!isLedgerFirstStep) {
      closeModal();
    }
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      <View className='flex-1 max-w-7xl mx-auto w-full'>
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
          className='w-full h-[50%] px-[5%] box-border overflow-hidden'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingVertical: 16 }}
        >
          {orderItems.map(item => {
            // 옵션 포함 단위 가격 계산
            const unitPrice = calculateUnitPrice(
              item.menuItem.price,
              item.options
            );
            const itemTotalPrice = unitPrice * item.quantity;

            return (
              <PaymentMenuItem
                key={item.id}
                isChecked={isChecked}
                onCheckboxPress={() => setIsChecked(!isChecked)}
                menuName={`${item.menuItem.name} (${item.menuItem.temperature}) x${item.quantity}`}
                options={item.options.join(', ')}
                price={`${itemTotalPrice.toLocaleString()}원`}
                onDeletePress={handleDelete}
              />
            );
          })}
        </ScrollView>

        {/* 구분선 */}
        <View className='w-full h-[1px] bg-gray-300' />

        <View className='w-full h-[50%] px-[5%] pb-10 box-border flex flex-col justify-between'>
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

          {/* 번호 입력 모달 */}
          <NumberInputModal
            visible={isModalOpen('numberInput')}
            onClose={handleModalClose}
            onConfirm={handleModalConfirm}
            type={modalType}
          />
        </View>
      </View>
    </View>
  );
}
