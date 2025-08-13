// payment.tsx - 퍼블리싱 작업용 간소화된 결제 페이지

import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
  Discount,
  NumberInputType,
  OrderReceiptMethodId,
} from '../types';
import { calculateDiscountedUnitPrice } from '../utils';

export default function Payment() {
  // Zustand 스토어에서 주문 데이터 가져오기
  const {
    orderItems,
    totalAmount,
    removeItem,
    applyDiscount,
    removeDiscount,
    clearAllDiscounts,
  } = useOrderStore();

  // 간단한 상태 관리
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<CashRegisterPaymentId>('cash');
  const [selectedOrderMethod, setSelectedOrderMethod] =
    useState<OrderReceiptMethodId>('dine-in');

  // 모달 관리
  const { openModal, closeModal, isModalOpen } = useModal();
  const [modalType, setModalType] = useState<NumberInputType>('pickup');
  const [isLedgerFirstStep, setIsLedgerFirstStep] = useState(false);

  const paymentButtonAnimation = useButtonAnimation();

  // 페이지 포커스 시 모든 할인 제거
  useFocusEffect(
    useCallback(() => {
      clearAllDiscounts();
      // 선택 상태도 초기화
      setCheckedItems(new Set());
      setIsAllChecked(false);
    }, [clearAllDiscounts])
  );

  // 간단한 핸들러들
  const handleBack = () => {
    router.push('/(tabs)');
  };

  // 전체 선택/해제 핸들러
  const handleAllCheckboxPress = () => {
    if (isAllChecked) {
      // 전체 해제
      setIsAllChecked(false);
      setCheckedItems(new Set());
    } else {
      // 전체 선택
      setIsAllChecked(true);
      const allItemIds = new Set(orderItems.map(item => item.id));
      setCheckedItems(allItemIds);
    }
  };

  // 개별 아이템 체크박스 핸들러
  const handleItemCheckboxPress = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);

    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }

    setCheckedItems(newCheckedItems);

    // 전체 선택 상태 업데이트
    const isAllSelected =
      newCheckedItems.size === orderItems.length && orderItems.length > 0;
    setIsAllChecked(isAllSelected);
  };

  // 선택된 아이템들 삭제 핸들러
  const handleDeleteSelected = () => {
    // 선택된 아이템들을 삭제
    checkedItems.forEach(itemId => {
      removeItem(itemId);
    });

    // 상태 초기화
    setCheckedItems(new Set());
    setIsAllChecked(false);
  };

  const handleDiscountSelect = (discount: Discount | null) => {
    if (discount && checkedItems.size > 0) {
      const selectedItemIds = Array.from(checkedItems);
      applyDiscount(selectedItemIds, {
        id: discount.id,
        name: discount.name,
        value: discount.value,
        type: discount.type,
      });

      // 할인 적용 후 선택 해제
      setCheckedItems(new Set());
      setIsAllChecked(false);
    }
  };

  const handleDiscountDelete = () => {
    if (checkedItems.size > 0) {
      const selectedItemIds = Array.from(checkedItems);
      removeDiscount(selectedItemIds);

      // 할인 제거 후 선택 해제
      setCheckedItems(new Set());
      setIsAllChecked(false);
    }
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
          isChecked={isAllChecked}
          onCheckboxPress={handleAllCheckboxPress}
          onDeletePress={handleDeleteSelected}
          hasSelectedItems={checkedItems.size > 0}
          title='결제 정보'
        />

        {/* 주문 메뉴 목록 섹션 */}
        <ScrollView
          className='w-full h-[50%] px-[5%] box-border overflow-hidden'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingVertical: 16 }}
        >
          {orderItems.map(item => {
            // 할인이 적용된 단위 가격 계산
            const unitPrice = calculateDiscountedUnitPrice(item);
            const itemTotalPrice = unitPrice * item.quantity;

            // 메뉴명에 할인 정보 추가
            const menuName = item.discount
              ? `${item.menuItem.name} (${item.menuItem.temperature}) x${item.quantity} [${item.discount.name}]`
              : `${item.menuItem.name} (${item.menuItem.temperature}) x${item.quantity}`;

            return (
              <PaymentMenuItem
                key={item.id}
                isChecked={checkedItems.has(item.id)}
                onCheckboxPress={() => handleItemCheckboxPress(item.id)}
                menuName={menuName}
                options={item.options.join(', ')}
                price={`${itemTotalPrice.toLocaleString()}원`}
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
            hasSelectedItems={checkedItems.size > 0}
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
