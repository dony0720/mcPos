import { BaseItem, ModalProps, Optionable } from './common';
import {
  PaymentMethod,
  PaymentDetailsType,
  DiscountType,
  OrderReceiptMethod as OrderReceiptMethodEnum,
} from './enums';

// ===== 기본 엔티티 타입들 =====

export interface CashRegisterPayment extends Pick<BaseItem, 'id' | 'name'> {
  id: CashRegisterPaymentId;
  icon: string;
}

// OrderReceiptMethod는 enums.ts에서 enum으로 정의됨

export interface PaymentOrderItem extends Optionable {
  id: number;
  name: string;
  price: number;
}

export interface Discount extends Pick<BaseItem, 'id' | 'name'> {
  value: number;
  type: DiscountType; // fixed: 고정가격으로 변경, deduction: 차감
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
  onDeletePress: () => void;
  hasSelectedItems: boolean;
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
export type CashRegisterPaymentId = PaymentMethod;
export type OrderReceiptMethodId = OrderReceiptMethodEnum;
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
  { id: PaymentMethod.CASH, name: '현금', icon: 'cash-outline' },
  { id: PaymentMethod.TRANSFER, name: '이체', icon: 'card-outline' },
  { id: PaymentMethod.COUPON, name: '쿠폰', icon: 'ticket-outline' },
  { id: PaymentMethod.LEDGER, name: '장부', icon: 'book-outline' },
] as const;

export const ORDER_RECEIPT_METHODS: Array<{
  id: OrderReceiptMethodId;
  name: string;
  icon: string;
}> = [
  {
    id: OrderReceiptMethodEnum.TAKEOUT,
    name: '테이크아웃',
    icon: 'bag-outline',
  },
  {
    id: OrderReceiptMethodEnum.DINE_IN,
    name: '매장',
    icon: 'restaurant-outline',
  },
] as const;

export const DISCOUNT_OPTIONS: Discount[] = [
  {
    id: 'fixed-1500',
    name: '1500원 고정가',
    value: 1500,
    type: DiscountType.FIXED,
    description: '선택된 메뉴를 1,500원으로 변경',
  },
  {
    id: 'deduction-1000',
    name: '1000원 차감',
    value: 1000,
    type: DiscountType.DEDUCTION,
    description: '선택된 메뉴에서 1,000원 차감',
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
