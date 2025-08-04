// payment.ts - 결제 관련 타입 정의

// ===== 기본 엔티티 타입들 =====

/**
 * 결제 수단 정보
 */
export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

/**
 * 주문 방법 정보
 */
export interface OrderMethod {
  id: string;
  name: string;
  icon: string;
}

/**
 * 주문 아이템 정보
 */
export interface OrderItem {
  id: number;
  name: string;
  options: string[];
  price: number;
}

/**
 * 할인 정보
 */
export interface Discount {
  id: string;
  name: string;
  value: number; // 할인 금액 (고정가)
  description?: string;
}

// ===== 컴포넌트 Props 타입들 =====

/**
 * 결제 수단 선택기 Props
 */
export interface PaymentMethodSelectorProps {
  selectedPaymentMethod: string | null;
  onPaymentMethodPress: (methodId: string) => void;
}

/**
 * 주문 방법 선택기 Props
 */
export interface OrderMethodSelectorProps {
  selectedOrderMethod: string | null;
  onOrderMethodPress: (methodId: string) => void;
}

/**
 * 결제 메뉴 아이템 Props
 */
export interface PaymentMenuItemProps {
  isChecked: boolean;
  onCheckboxPress: () => void;
  menuName: string;
  options: string;
  price: string;
  onDeletePress: () => void;
}

/**
 * 할인 모달 Props
 */
export interface DiscountModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDiscount: (discount: Discount) => void;
}

/**
 * 번호 입력 모달 Props
 */
export interface NumberInputModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (number: string) => void;
  type?: NumberInputType;
}

/**
 * 전체 선택 체크박스 Props
 */
export interface SelectAllCheckboxProps {
  isChecked: boolean;
  onCheckboxPress: () => void;
  title?: string;
}

/**
 * 결제 헤더 Props
 */
export interface PaymentHeaderProps {
  onBack: () => void;
}

// ===== 유틸리티 타입들 =====

/**
 * 번호 입력 타입
 */
export type NumberInputType = 'phone' | 'pickup';

/**
 * 결제 수단 ID 타입
 */
export type PaymentMethodId = 'cash' | 'transfer' | 'coupon' | 'ledger';

/**
 * 주문 방법 ID 타입
 */
export type OrderMethodId = 'takeout' | 'dine-in';

/**
 * 할인 ID 타입
 */
export type DiscountId =
  | 'senior'
  | 'student'
  | 'employee'
  | 'special1'
  | 'special2'
  | 'special3';

// ===== 상태 관리 타입들 =====

/**
 * 결제 페이지 상태
 */
export interface PaymentState {
  isChecked: boolean;
  selectedPaymentMethod: PaymentMethodId | null;
  selectedOrderMethod: OrderMethodId | null;
  orderItems: OrderItem[];
  appliedDiscounts: Discount[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
}

/**
 * 모달 상태
 */
export interface PaymentModalState {
  isNumberInputOpen: boolean;
  isDiscountModalOpen: boolean;
  numberInputType: NumberInputType;
  isLedgerFirstStep: boolean;
}

// ===== 상수 타입들 =====

/**
 * 결제 수단 목록
 */
export const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cash', name: '현금', icon: 'cash-outline' },
  { id: 'transfer', name: '이체', icon: 'card-outline' },
  { id: 'coupon', name: '쿠폰', icon: 'ticket-outline' },
  { id: 'ledger', name: '장부', icon: 'book-outline' },
] as const;

/**
 * 주문 방법 목록
 */
export const ORDER_METHODS: OrderMethod[] = [
  { id: 'takeout', name: '테이크아웃', icon: 'bag-outline' },
  { id: 'dine-in', name: '매장', icon: 'restaurant-outline' },
] as const;

/**
 * 할인 옵션 목록
 */
export const DISCOUNT_OPTIONS: Discount[] = [
  {
    id: 'senior',
    name: '경로우대',
    value: 3000,
    description: '65세 이상 3,000원 고정가',
  },
  {
    id: 'student',
    name: '학생할인',
    value: 4000,
    description: '학생증 제시 시 4,000원 고정가',
  },
  {
    id: 'employee',
    name: '직원할인',
    value: 2000,
    description: '직원 2,000원 고정가',
  },
  {
    id: 'special1',
    name: '특가 5,000원',
    value: 5000,
    description: '특별 할인가 5,000원',
  },
  {
    id: 'special2',
    name: '특가 6,000원',
    value: 6000,
    description: '특별 할인가 6,000원',
  },
  {
    id: 'special3',
    name: '특가 7,000원',
    value: 7000,
    description: '특별 할인가 7,000원',
  },
] as const;

// ===== 유틸리티 함수 타입들 =====

/**
 * 결제 금액 계산 함수 타입
 */
export type CalculatePaymentAmount = (
  orderItems: OrderItem[],
  discounts: Discount[]
) => {
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
};

/**
 * 결제 처리 함수 타입
 */
export type ProcessPayment = (
  paymentMethod: PaymentMethodId,
  orderItems: OrderItem[],
  finalAmount: number,
  phoneNumber?: string,
  pickupNumber?: string
) => Promise<{ success: boolean; message: string }>;
