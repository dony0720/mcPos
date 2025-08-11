import { BaseItem, ModalProps, Optionable } from './common';

// ===== 기본 엔티티 타입들 =====

export interface CashRegisterPayment extends Pick<BaseItem, 'id' | 'name'> {
  id: CashRegisterPaymentId;
  icon: string;
}

export interface OrderReceiptMethod extends Pick<BaseItem, 'id' | 'name'> {
  id: OrderReceiptMethodId;
  icon: string;
}

export interface PaymentOrderItem extends Optionable {
  id: number;
  name: string;
  price: number;
}

export interface Discount extends Pick<BaseItem, 'id' | 'name'> {
  value: number;
  description?: string;
}

// ===== 컴포넌트 Props 타입들 =====

export interface CashRegisterPaymentSelectorProps {
  selectedPaymentMethod: CashRegisterPaymentId | null;
  onPaymentMethodPress: (methodId: CashRegisterPaymentId) => void;
}

export interface OrderReceiptMethodSelectorProps {
  selectedOrderMethod: OrderReceiptMethodId | null;
  onOrderMethodPress: (methodId: OrderReceiptMethodId) => void;
}

export interface PaymentMenuItemProps {
  isChecked: boolean;
  onCheckboxPress: () => void;
  menuName: string;
  options: string;
  price: string;
  onDeletePress: () => void;
}

export interface DiscountModalProps extends ModalProps {
  onSelectDiscount: (discount: Discount) => void;
}

export interface NumberInputModalProps extends ModalProps {
  onConfirm: (number: string) => void;
  type?: NumberInputType;
}

export interface SelectAllCheckboxProps {
  isChecked: boolean;
  onCheckboxPress: () => void;
  title?: string;
}

export interface PaymentHeaderProps {
  onBack: () => void;
}

export interface KeypadProps {
  onNumberPress: (number: string) => void;
  onBackspace: () => void;
  maxLength?: number;
  currentInput?: string;
}

export interface DiscountSectionProps {
  onDiscountSelect: (discount: Discount | null) => void;
  onDiscountDelete: () => void;
}

// ===== 유틸리티 타입들 =====

export type NumberInputType = 'phone' | 'pickup';
export type CashRegisterPaymentId = 'cash' | 'transfer' | 'coupon' | 'ledger';
export type OrderReceiptMethodId = 'takeout' | 'dine-in';
export type DiscountId =
  | 'senior'
  | 'student'
  | 'employee'
  | 'special1'
  | 'special2'
  | 'special3';

// ===== 상태 관리 타입들 =====

export interface PaymentState {
  isChecked: boolean;
  selectedPaymentMethod: CashRegisterPaymentId | null;
  selectedOrderMethod: OrderReceiptMethodId | null;
  orderItems: PaymentOrderItem[];
  appliedDiscounts: Discount[];
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
}

export interface PaymentModalState {
  isNumberInputOpen: boolean;
  isDiscountModalOpen: boolean;
  numberInputType: NumberInputType;
  isLedgerFirstStep: boolean;
}

// ===== 상수 데이터 =====

export const CASH_REGISTER_PAYMENTS: CashRegisterPayment[] = [
  { id: 'cash', name: '현금', icon: 'cash-outline' },
  { id: 'transfer', name: '이체', icon: 'card-outline' },
  { id: 'coupon', name: '쿠폰', icon: 'ticket-outline' },
  { id: 'ledger', name: '장부', icon: 'book-outline' },
] as const;

export const ORDER_RECEIPT_METHODS: OrderReceiptMethod[] = [
  { id: 'takeout', name: '테이크아웃', icon: 'bag-outline' },
  { id: 'dine-in', name: '매장', icon: 'restaurant-outline' },
] as const;

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

export type CalculatePaymentAmount = (
  orderItems: PaymentOrderItem[],
  discounts: Discount[]
) => {
  totalAmount: number;
  discountAmount: number;
  finalAmount: number;
};

export type ProcessPayment = (
  paymentMethod: CashRegisterPaymentId,
  orderItems: PaymentOrderItem[],
  finalAmount: number,
  phoneNumber?: string,
  pickupNumber?: string
) => Promise<{ success: boolean; message: string }>;
