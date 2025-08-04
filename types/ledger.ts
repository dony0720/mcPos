// ledger.ts - 장부 관리 관련 타입 정의

import { PaymentMethod, TransactionType } from '../constants/ledger';

// Re-export enums from constants
export { PaymentMethod, TransactionType };

// ===== 기본 엔티티 타입들 =====

/**
 * 거래 내역 정보
 */
export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  amount: string;
  receptionist: string;
  paymentMethod: PaymentMethod;
}

/**
 * 고객 정보
 */
export interface CustomerInfo {
  name: string;
  memberNumber: string;
  phoneNumber: string;
}

/**
 * 장부 데이터 정보
 */
export interface LedgerData {
  id: number;
  memberNumber: string;
  name: string;
  phoneNumber: string;
  receptionist: string;
  chargeAmount: string;
  paymentMethod: string;
}

/**
 * 장부 등록 데이터
 */
export interface LedgerRegistrationData {
  name: string;
  phoneNumber: string;
  initialAmount: string;
  receptionist: string;
  paymentMethod: string;
}

/**
 * 충전 데이터
 */
export interface ChargeData {
  chargeAmount: string;
  receptionist: string;
  paymentMethod: string;
}

// ===== 컴포넌트 Props 타입들 =====

/**
 * 장부 테이블 Props
 */
export interface LedgerTableProps {
  ledgerData: LedgerData[];
  onCharge: (item: LedgerData) => void;
  onHistory: (item: LedgerData) => void;
  onDelete: (item: LedgerData) => void;
}

/**
 * 장부 테이블 행 Props
 */
export interface LedgerTableRowProps {
  item: LedgerData;
  onCharge: (item: LedgerData) => void;
  onHistory: (item: LedgerData) => void;
  onDelete: (item: LedgerData) => void;
}

/**
 * 액션 버튼 Props
 */
export interface ActionButtonsProps {
  item: LedgerData;
  onCharge: (item: LedgerData) => void;
  onHistory: (item: LedgerData) => void;
  onDelete: (item: LedgerData) => void;
}

/**
 * 장부 헤더 Props
 */
export interface LedgerHeaderProps {
  onShowRegistrationModal: () => void;
}

/**
 * 장부 등록 모달 Props
 */
export interface LedgerRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: LedgerRegistrationData) => void;
}

/**
 * 충전 모달 Props
 */
export interface ChargeModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: ChargeData) => void;
  customerInfo: CustomerInfo;
}

/**
 * 히스토리 모달 Props
 */
export interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onDeleteTransaction: (transactionId: string) => void;
  customerInfo: CustomerInfo;
}

// ===== 상태 관리 타입들 =====

/**
 * 장부 페이지 상태
 */
export interface LedgerState {
  ledgerData: LedgerData[];
  isRegistrationModalVisible: boolean;
  isChargeModalVisible: boolean;
  isHistoryModalVisible: boolean;
  selectedCustomer: CustomerInfo | null;
}

/**
 * 모달 상태
 */
export interface LedgerModalState {
  isRegistrationOpen: boolean;
  isChargeOpen: boolean;
  isHistoryOpen: boolean;
  selectedCustomer: CustomerInfo | null;
}

// ===== 유틸리티 타입들 =====

/**
 * 결제 방법 ID 타입
 */
export type PaymentMethodId = 'cash' | 'ledger' | 'bankTransfer' | 'card';

/**
 * 거래 타입 ID 타입
 */
export type TransactionTypeId = 'register' | 'use' | 'charge' | 'edit';

// ===== 상수 데이터 =====

/**
 * 결제 방법 목록
 */
export const PAYMENT_METHODS = [
  { id: 'cash', name: '현금', value: PaymentMethod.CASH },
  { id: 'ledger', name: '장부', value: PaymentMethod.LEDGER },
  { id: 'bankTransfer', name: '계좌이체', value: PaymentMethod.BANK_TRANSFER },
  { id: 'card', name: '카드', value: PaymentMethod.CARD },
] as const;

/**
 * 거래 타입 목록
 */
export const TRANSACTION_TYPES = [
  { id: 'register', name: '등록', value: TransactionType.REGISTER },
  { id: 'use', name: '사용', value: TransactionType.USE },
  { id: 'charge', name: '충전', value: TransactionType.CHARGE },
  { id: 'edit', name: '수정', value: TransactionType.EDIT },
] as const;

// ===== 유틸리티 함수 타입들 =====

/**
 * 장부 금액 계산 함수 타입
 */
export type CalculateLedgerAmount = (transactions: Transaction[]) => {
  totalAmount: number;
  usedAmount: number;
  remainingAmount: number;
};

/**
 * 거래 처리 함수 타입
 */
export type ProcessTransaction = (
  customerInfo: CustomerInfo,
  transactionData: Partial<Transaction>
) => Promise<{ success: boolean; message: string }>;
