// enums.ts - 공통 enum 정의

/**
 * 결제 방법 enum
 */
export enum PaymentMethod {
  CASH = 'cash',
  TRANSFER = 'transfer',
  COUPON = 'coupon',
  LEDGER = 'ledger',
}

/**
 * 거래 상태 enum
 */
export enum TransactionStatus {
  COMPLETED = 'completed',
  PREPARING = 'preparing',
  READY = 'ready',
  PICKED_UP = 'picked_up',
  CANCELLED = 'cancelled',
}

/**
 * 현금 거래 타입 enum
 */
export enum CashTransactionType {
  SALE = 'sale',
  CHANGE = 'change',
  ADJUSTMENT = 'adjustment',
  MANUAL_DEPOSIT = 'manual_deposit',
  MANUAL_WITHDRAW = 'manual_withdraw',
}

/**
 * 결제 세부정보 타입 enum
 */
export enum PaymentDetailsType {
  CASH = 'cash',
  COUPON = 'coupon',
  TRANSFER = 'transfer',
  LEDGER = 'ledger',
  COUPON_CASH = 'coupon_cash',
}

/**
 * 할인 타입 enum
 */
export enum DiscountType {
  FIXED = 'fixed',
  DEDUCTION = 'deduction',
}

/**
 * 주문 수령 방법 enum
 */
export enum OrderReceiptMethod {
  TAKEOUT = 'takeout',
  DINE_IN = 'dine-in',
}
