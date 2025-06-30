// usePaymentLogic.ts - SRP: 결제 비즈니스 로직만 담당

import { useRouter } from "expo-router";
import {
  PaymentService,
  OrderService,
  DiscountService,
  PaymentServiceFactory,
  OrderDetails,
  OrderItem,
  PaymentResult,
} from "../services/PaymentService";

/**
 * 결제 비즈니스 로직 훅 (SRP: 비즈니스 로직만 담당)
 * - 결제 처리, 주문 생성, 할인 적용 등의 비즈니스 로직
 * - DIP: 서비스 추상화에 의존
 * - UI 상태 관리는 포함하지 않음
 */
export const usePaymentLogic = (
  orderService: OrderService,
  discountService: DiscountService
) => {
  const router = useRouter();

  // 결제 방법 목록 조회 (OCP: 확장 가능)
  const getPaymentMethods = () => {
    return PaymentServiceFactory.getPaymentMethods();
  };

  // 주문 방법 목록 조회
  const getOrderMethods = async () => {
    return await orderService.getOrderMethods();
  };

  // 더미 주문 아이템들 생성 (실제로는 상태나 props에서 가져올 것)
  const getMockOrderItems = (): OrderItem[] => {
    return Array.from({ length: 10 }, (_, index) => ({
      id: `item-${index}`,
      name: "아메리카노 (HOT)",
      options: "연하게, 샷추가, 휘핑추가",
      price: 6000,
      quantity: 1,
    }));
  };

  // 총 금액 계산
  const calculateTotalAmount = (
    items: OrderItem[],
    paymentMethod: string
  ): number => {
    const paymentService = PaymentServiceFactory.create(paymentMethod);
    return paymentService.calculateTotal(items);
  };

  // 고유번호 필요 여부 확인
  const requiresUniqueNumber = (paymentMethod: string): boolean => {
    const paymentService = PaymentServiceFactory.create(paymentMethod);
    return paymentService.requiresUniqueNumber();
  };

  // 할인 적용
  const applyDiscount = async (
    amount: number,
    discountCode?: string
  ): Promise<number> => {
    return await discountService.applyDiscount(amount, discountCode);
  };

  // 할인 검증
  const validateDiscount = async (discountCode: string): Promise<boolean> => {
    return await discountService.validateDiscount(discountCode);
  };

  // 결제 처리 (핵심 비즈니스 로직)
  const processPayment = async (
    paymentMethod: string,
    orderMethod: string,
    uniqueNumber?: string,
    pickupNumber?: string
  ): Promise<PaymentResult> => {
    try {
      // DIP: 결제 방법에 따른 서비스 선택
      const paymentService = PaymentServiceFactory.create(paymentMethod);

      const items = getMockOrderItems();
      const totalAmount = calculateTotalAmount(items, paymentMethod);

      const orderDetails: OrderDetails = {
        items,
        paymentMethod,
        orderMethod,
        uniqueNumber,
        pickupNumber,
        totalAmount,
      };

      // 결제 방법 검증
      if (!paymentService.validatePaymentMethod(paymentMethod)) {
        throw new Error("유효하지 않은 결제 방법입니다.");
      }

      // 결제 처리
      const paymentResult = await paymentService.processPayment(orderDetails);

      if (!paymentResult.success) {
        throw new Error(
          paymentResult.message || "결제 처리 중 오류가 발생했습니다."
        );
      }

      // 주문 생성
      const orderResult = await orderService.createOrder(orderDetails);

      if (!orderResult.success) {
        throw new Error(
          orderResult.message || "주문 생성 중 오류가 발생했습니다."
        );
      }

      return {
        success: true,
        transactionId: paymentResult.transactionId,
        message: "결제 및 주문이 성공적으로 완료되었습니다.",
      };
    } catch (error) {
      console.error("결제 처리 오류:", error);
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
      };
    }
  };

  // 결제 완료 후 네비게이션
  const handlePaymentSuccess = () => {
    router.push("/(tabs)");
  };

  // 뒤로가기 네비게이션
  const handleBackNavigation = () => {
    router.push("/(tabs)");
  };

  return {
    // 데이터 조회
    getPaymentMethods,
    getOrderMethods,
    getMockOrderItems,

    // 계산 로직
    calculateTotalAmount,
    requiresUniqueNumber,

    // 할인 관련
    applyDiscount,
    validateDiscount,

    // 핵심 비즈니스 로직
    processPayment,

    // 네비게이션
    handlePaymentSuccess,
    handleBackNavigation,
  };
};
