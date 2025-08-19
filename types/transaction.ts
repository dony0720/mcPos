import { OrderItem } from './menu';
import { CashRegisterPaymentId, OrderReceiptMethodId } from './payment';
import {
  TransactionStatus as TransactionStatusEnum,
  PaymentDetailsType,
  TransactionType,
} from './enums';

// 거래내역 기본 인터페이스
export interface Transaction {
  id: string;
  timestamp: Date;
  type: TransactionType; // 거래 타입 추가

  // 주문 관련 (ORDER 타입에서만 사용)
  orderItems?: OrderItem[];
  paymentMethod?: CashRegisterPaymentId;
  orderMethod?: OrderReceiptMethodId;
  pickupNumber?: string;
  paymentDetails?: PaymentDetails;
  paymentBreakdown?: {
    cash?: number;
    transfer?: number;
    coupon?: number;
    ledger?: number;
  };

  // 공통 필드
  totalAmount: number;
  status: TransactionStatusEnum;

  // 입출금 관련 (CASH_DEPOSIT/CASH_WITHDRAWAL 타입에서만 사용)
  description?: string; // 입출금 메모
  cashBreakdown?: Array<{
    denomination: number;
    quantity: number;
    total: number;
  }>;
}

// 결제 세부 정보 (결제 방법에 따라 다름)
export type PaymentDetails =
  | CashPaymentDetails
  | CouponPaymentDetails
  | CouponCashPaymentDetails
  | TransferPaymentDetails
  | LedgerPaymentDetails;

// 현금 결제 정보
export interface CashPaymentDetails {
  type: PaymentDetailsType.CASH;
  receivedAmount: number;
  changeAmount: number;
}

// 쿠폰 전액 결제 정보
export interface CouponPaymentDetails {
  type: PaymentDetailsType.COUPON;
  couponAmount: number;
}

// 쿠폰+현금 조합 결제 정보
export interface CouponCashPaymentDetails {
  type: PaymentDetailsType.COUPON_CASH;
  couponAmount: number;
  remainingAmount: number;
  receivedAmount: number;
  changeAmount: number;
}

// 이체 결제 정보
export interface TransferPaymentDetails {
  type: PaymentDetailsType.TRANSFER;
}

// 장부 결제 정보
export interface LedgerPaymentDetails {
  type: PaymentDetailsType.LEDGER;
  phoneNumber: string;
}

// TransactionStatus는 enums.ts에서 enum으로 정의됨

// 거래내역 스토어 액션들
export interface TransactionStoreActions {
  addTransaction: (
    transaction: Omit<Transaction, 'id' | 'timestamp'>
  ) => string;
  addCashTransaction: (
    type: TransactionType.CASH_DEPOSIT | TransactionType.CASH_WITHDRAWAL,
    amount: number,
    description: string,
    cashBreakdown: Array<{
      denomination: number;
      quantity: number;
      total: number;
    }>
  ) => string;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByDate: (date: Date) => Transaction[];
  updateTransactionStatus: (id: string, status: TransactionStatusEnum) => void;
  getTodayTransactions: () => Transaction[];
  getTotalSalesAmount: (date?: Date) => number;
  getTransactionCount: (date?: Date) => number;
  getFilteredTransactions: (filter: TransactionFilter) => Transaction[];
  getTransactionStats: (filter?: TransactionFilter) => TransactionStats;
  deleteTransaction: (id: string) => void;
  clearAllTransactions: () => void;
}

// 거래내역 스토어 상태
export interface TransactionState extends TransactionStoreActions {
  transactions: Transaction[];
}

// 거래내역 필터링 옵션
export interface TransactionFilter {
  startDate?: Date;
  endDate?: Date;
  paymentMethod?: CashRegisterPaymentId;
  orderMethod?: OrderReceiptMethodId;
  status?: TransactionStatusEnum;
  pickupNumber?: string;
}

// 거래내역 통계
export interface TransactionStats {
  totalSales: number;
  totalTransactions: number;
  averageOrderValue: number;
  paymentMethodBreakdown: Record<CashRegisterPaymentId, number>;
  orderMethodBreakdown: Record<OrderReceiptMethodId, number>;
}
