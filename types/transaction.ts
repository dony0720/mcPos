import { OrderItem } from './menu';
import { CashRegisterPaymentId, OrderReceiptMethodId } from './payment';

// 거래내역 기본 인터페이스
export interface Transaction {
  id: string;
  timestamp: Date;
  orderItems: OrderItem[];
  paymentMethod: CashRegisterPaymentId;
  orderMethod: OrderReceiptMethodId;
  totalAmount: number;
  pickupNumber: string;

  // 결제 방법별 세부 정보
  paymentDetails: PaymentDetails;

  // 결제 방법별 실제 금액 (조합 결제 대응)
  paymentBreakdown: {
    cash?: number;
    transfer?: number;
    coupon?: number;
    ledger?: number;
  };

  // 상태
  status: TransactionStatus;
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
  type: 'cash';
  receivedAmount: number;
  changeAmount: number;
}

// 쿠폰 전액 결제 정보
export interface CouponPaymentDetails {
  type: 'coupon';
  couponAmount: number;
}

// 쿠폰+현금 조합 결제 정보
export interface CouponCashPaymentDetails {
  type: 'coupon_cash';
  couponAmount: number;
  remainingAmount: number;
  receivedAmount: number;
  changeAmount: number;
}

// 이체 결제 정보
export interface TransferPaymentDetails {
  type: 'transfer';
}

// 장부 결제 정보
export interface LedgerPaymentDetails {
  type: 'ledger';
  phoneNumber: string;
}

// 거래 상태
export type TransactionStatus =
  | 'completed' // 완료
  | 'preparing' // 준비중
  | 'ready' // 준비완료
  | 'picked_up' // 수령완료
  | 'cancelled'; // 취소됨

// 거래내역 스토어 액션들
export interface TransactionStoreActions {
  addTransaction: (
    transaction: Omit<Transaction, 'id' | 'timestamp'>
  ) => string;
  getTransactionById: (id: string) => Transaction | undefined;
  getTransactionsByDate: (date: Date) => Transaction[];
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
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
  status?: TransactionStatus;
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
