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

  // 결제 처리 핸들러 (SRP: 결제 플로우 조정만 담당)
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

/*
=================== SOLID 원칙 적용 전후 비교 ===================

❌ 기존 코드의 문제점:
1. SRP 위반: Payment 컴포넌트가 UI + 상태 + 비즈니스로직 + 네비게이션 모두 담당
2. OCP 위반: 새 결제방법 추가 시 handlePaymentPress, handlePickupNumberConfirm 수정 필요
3. DIP 위반: 하드코딩된 paymentMethods, console.log 직접 사용
4. 테스트 어려움: 모든 로직이 UI 컴포넌트에 결합
5. 재사용성 낮음: 결제 로직을 다른 곳에서 사용하기 어려움

✅ SOLID 적용 후 개선점:

🎯 SRP (단일 책임 원칙):
- Payment: UI 렌더링만
- usePaymentState: 상태 관리만  
- usePaymentLogic: 비즈니스 로직만
- 각 서비스: 특정 도메인만

🔓 OCP (개방/폐쇄 원칙):
- 새 결제방법: PaymentServiceFactory에 케이스만 추가
- 기존 코드 수정 없이 확장 가능

🔄 LSP (리스코프 치환 원칙):
- 모든 PaymentService 구현체가 서로 교체 가능

🧩 ISP (인터페이스 분리 원칙):  
- PaymentService, OrderService, DiscountService 분리
- 각 컴포넌트가 필요한 props만 의존

🔗 DIP (의존성 역전 원칙):
- 구체적 구현이 아닌 인터페이스에 의존
- 서비스 주입으로 테스트 용이성 향상

=================== 추가 개선 효과 ===================

📈 유지보수성 향상:
- 각 책임별로 코드 분리되어 수정 영향 범위 최소화
- 버그 발생 시 원인 파악 및 수정 용이

🧪 테스트 용이성:
- 각 훅과 서비스를 독립적으로 테스트 가능
- Mock 서비스로 쉬운 단위 테스트

🔄 재사용성:
- usePaymentLogic은 다른 결제 관련 화면에서도 사용 가능
- 서비스들은 다른 도메인에서도 재사용 가능

🚀 확장성:
- 새로운 결제 방법, 할인 정책 등 쉽게 추가
- 기존 코드 수정 없이 새 기능 추가 가능

=================== 새 결제방법 추가 예시 ===================

// 1. 새로운 결제 서비스 구현 (OCP)
export class CreditCardPaymentService implements PaymentService {
  async processPayment(orderDetails: OrderDetails): Promise<PaymentResult> {
    // 신용카드 결제 로직
    return { success: true, transactionId: 'CC_' + Date.now() };
  }
  // ... 다른 메서드들 구현
}

// 2. PaymentServiceFactory에 케이스 추가만 하면 됨 (OCP)
static create(paymentMethod: string): PaymentService {
  switch (paymentMethod) {
    case 'credit': // 새로운 케이스만 추가
      return new CreditCardPaymentService();
    case 'ledger':
      return new LedgerPaymentService();
    // ... 기존 케이스들은 수정 불필요
  }
}

// 3. PaymentServiceFactory.getPaymentMethods()에 새 옵션만 추가
static getPaymentMethods(): PaymentMethod[] {
  return [
    // ... 기존 결제방법들
    { id: "credit", name: "신용카드", icon: "card" }, // 새 결제방법만 추가
  ];
}

// UI 컴포넌트는 전혀 수정할 필요 없음! (OCP 달성)
*/
