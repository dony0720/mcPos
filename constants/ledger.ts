// 장부 관련 상수 및 enum 정의

// 거래 타입 enum
export enum TransactionType {
  REGISTER = '등록',
  USE = '사용',
  CHARGE = '충전',
  EDIT = '수정',
}

// 결제 방법 enum
export enum PaymentMethod {
  CASH = '현금',
  LEDGER = '장부',
  BANK_TRANSFER = '계좌이체',
  CARD = '카드',
}

// 거래 내역 타입 정의
export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: string;
  receptionist: string;
  paymentMethod: PaymentMethod;
}

// 고객 정보 타입
export interface CustomerInfo {
  name: string;
  memberNumber: string;
  phoneNumber: string;
}
