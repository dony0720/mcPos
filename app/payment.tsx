// payment.tsx - SOLID 원칙이 적용된 결제 페이지

import React from 'react';
import { Animated, Pressable, ScrollView, Text, View } from 'react-native';

import DiscountSection from '../components/payment/DiscountSection';
import NumberInputModal from '../components/payment/NumberInputModal';
import OrderMethodSelector from '../components/payment/OrderMethodSelector';
import PaymentHeader from '../components/payment/PaymentHeader';
// 컴포넌트 임포트 (ISP: 각 컴포넌트는 필요한 props만 받음)
import PaymentMenuItem from '../components/payment/PaymentMenuItem';
import PaymentMethodSelector from '../components/payment/PaymentMethodSelector';
import SelectAllCheckbox from '../components/payment/SelectAllCheckbox';
// 훅 임포트 (SRP: 각 훅은 하나의 책임만 가짐)
import { useButtonAnimation } from '../hooks/useButtonAnimation';
import { usePaymentLogic } from '../hooks/usePaymentLogic';
import { usePaymentState } from '../hooks/usePaymentState';
// 서비스 임포트 (DIP: 추상화에 의존)
import {
  DefaultDiscountService,
  DefaultOrderService,
} from '../services/PaymentService';

/**
 * SOLID 원칙이 적용된 결제 컴포넌트 (SRP: UI 렌더링만 담당)
 *
 * 🎯 S - Single Responsibility Principle (단일 책임 원칙)
 * - Payment: UI 렌더링만 담당
 * - usePaymentState: 상태 관리만 담당
 * - usePaymentLogic: 비즈니스 로직만 담당
 * - 각 서비스: 특정 도메인 로직만 담당
 *
 * 🔓 O - Open/Closed Principle (개방/폐쇄 원칙)
 * - 새로운 결제방법 추가 시 기존 코드 수정 불필요
 * - PaymentServiceFactory에서 새 케이스만 추가
 * - PaymentService 인터페이스를 구현하는 새 클래스 생성
 *
 * 🔄 L - Liskov Substitution Principle (리스코프 치환 원칙)
 * - 모든 결제 서비스가 PaymentService 인터페이스 구현
 * - CashPaymentService와 LedgerPaymentService 서로 교체 가능
 * - 동일한 메서드 시그니처로 일관된 동작 보장
 *
 * 🧩 I - Interface Segregation Principle (인터페이스 분리 원칙)
 * - PaymentService, OrderService, DiscountService 분리
 * - 각 컴포넌트가 필요한 props만 받음
 * - usePaymentState와 usePaymentLogic 분리
 *
 * 🔗 D - Dependency Inversion Principle (의존성 역전 원칙)
 * - 컴포넌트가 구체적 구현이 아닌 인터페이스에 의존
 * - 서비스 의존성 주입으로 테스트 용이성 향상
 * - 추상화된 훅을 통한 비즈니스 로직 분리
 */

// DIP: 서비스 의존성 주입 (컴포넌트 외부에서 생성)
const createServices = () => {
  return {
    orderService: new DefaultOrderService(),
    discountService: new DefaultDiscountService(),
  };
};

export default function Payment() {
  // SRP: 각 훅이 하나의 책임만 담당
  const paymentButtonAnimation = useButtonAnimation();
  const { state, actions } = usePaymentState();

  // DIP: 서비스 의존성 주입
  const services = createServices();
  const paymentLogic = usePaymentLogic(
    services.orderService,
    services.discountService
  );

  // 이벤트 핸들러들 (SRP: 각 핸들러는 하나의 책임)
  const handleBackPress = () => {
    paymentLogic.handleBackNavigation();
  };

  const handleDeletePress = () => {
    console.log('Delete menu item');
    // 여기에 메뉴 아이템 삭제 로직 추가 (실제로는 별도 서비스나 훅으로 분리)
  };

  const handleDiscountSelect = () => {
    console.log('할인 선택');
    // 할인 선택 로직 (실제로는 별도 할인 관리 훅으로 분리)
  };

  const handleDiscountDelete = () => {
    console.log('할인 삭제');
    // 할인 삭제 로직 (실제로는 별도 할인 관리 훅으로 분리)
  };

  // 결제 처리 핸들러 (SRP: 결제 플로우 조정만 담당)
  const handlePaymentPress = () => {
    const paymentMethod = state.selectedPaymentMethod || 'cash';

    // DIP: 비즈니스 로직은 서비스에 위임
    if (paymentLogic.requiresUniqueNumber(paymentMethod)) {
      actions.showUniqueNumberModal();
    } else {
      actions.showPickupNumberModal();
    }
  };

  // 고유번호 확인 핸들러
  const handleUniqueNumberConfirm = (number: string) => {
    actions.setUniqueNumber(number);
    actions.hideUniqueNumberModal();
    actions.showPickupNumberModal();
  };

  // 픽업번호 확인 및 최종 결제 처리
  const handlePickupNumberConfirm = async (pickupNumber: string) => {
    // DIP: 결제 로직은 비즈니스 레이어에 위임
    const result = await paymentLogic.processPayment(
      state.selectedPaymentMethod || 'cash',
      state.selectedOrderMethod || 'store',
      state.uniqueNumber,
      pickupNumber
    );

    if (result.success) {
      console.log('결제 성공:', result);
      actions.resetState();
      paymentLogic.handlePaymentSuccess();
    } else {
      console.error('결제 실패:', result.message);
      // 에러 처리 (실제로는 에러 모달이나 토스트 표시)
    }

    actions.hidePickupNumberModal();
  };

  // 계산된 값들 (비즈니스 로직은 서비스에서 처리)
  const orderItems = paymentLogic.getMockOrderItems();
  const totalAmount = paymentLogic.calculateTotalAmount(
    orderItems,
    state.selectedPaymentMethod || 'cash'
  );

  return (
    <View className='h-full w-full box-border bg-white flex flex-col'>
      {/* 상단 헤더 섹션 - 뒤로가기 버튼과 제목 */}
      <PaymentHeader onBackPress={handleBackPress} />

      {/* 전체 선택 체크박스 섹션 - 모든 메뉴 아이템 선택/해제 */}
      <SelectAllCheckbox
        isChecked={state.isChecked}
        onCheckboxPress={actions.toggleCheckbox}
        title='결제 정보'
      />

      {/* 주문 메뉴 목록 섹션 - 선택된 메뉴 아이템들 표시 및 개별 삭제 가능 */}
      <ScrollView
        className='w-full h-[50%] px-[5%] box-border overflow-hidden'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        {orderItems.map(item => (
          <PaymentMenuItem
            key={item.id}
            isChecked={state.isChecked}
            onCheckboxPress={actions.toggleCheckbox}
            menuName={item.name}
            options={item.options}
            price={`${item.price.toLocaleString()}원`}
            onDeletePress={handleDeletePress}
          />
        ))}
      </ScrollView>

      {/* 구분선 */}
      <View className='w-full h-[1px] bg-gray-300' />

      <View className='w-full h-[50%] px-[5%] box-border'>
        {/* 결제 방법 선택 섹션 - 현금, 이체, 쿠폰, 장부 중 선택 */}
        <PaymentMethodSelector
          selectedPaymentMethod={state.selectedPaymentMethod}
          onPaymentMethodPress={actions.setPaymentMethod}
        />

        {/* 주문 방법 선택 섹션 - 매장, 포장, 배달 중 선택 */}
        <OrderMethodSelector
          selectedOrderMethod={state.selectedOrderMethod}
          onOrderMethodPress={actions.setOrderMethod}
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
              {totalAmount.toLocaleString()}원 결제하기
            </Text>
          </Animated.View>
        </Pressable>

        {/* 모달 섹션 - 결제 과정에서 필요한 번호 입력 */}
        {/* 고유 번호 입력 모달 - 장부 결제 시 고객 식별용 번호 입력 */}
        <NumberInputModal
          visible={state.showUniqueNumberModal}
          onClose={actions.hideUniqueNumberModal}
          onConfirm={handleUniqueNumberConfirm}
          type='phone'
        />

        {/* 픽업 번호 입력 모달 - 주문 완료 후 픽업 시 사용할 번호 입력 */}
        <NumberInputModal
          visible={state.showPickupNumberModal}
          onClose={actions.hidePickupNumberModal}
          onConfirm={handlePickupNumberConfirm}
          type='pickup'
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
