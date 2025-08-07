// ledger.ts - 장부 관리 관련 타입 정의

// ===== Enum 정의 =====

/**
 * 고객 계정 거래 타입 enum
 */
export enum CustomerAccountTransactionType {
  REGISTER = '등록',
  USE = '사용',
  CHARGE = '충전',
  EDIT = '수정',
}

/**
 * 고객 계정 결제 방법 enum
 */
export enum CustomerAccountPaymentMethod {
  CASH = '현금',
  LEDGER = '장부',
  BANK_TRANSFER = '계좌이체',
  CARD = '카드',
}

// ===== 기본 엔티티 타입들 =====

/**
 * 거래 내역 정보
 */
export interface CustomerTransaction {
  id: string;
  date: string;
  type: CustomerAccountTransactionType;
  amount: string;
  receptionist: string;
  paymentMethod: CustomerAccountPaymentMethod;
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
 * @deprecated - ledgerSchema.ts의 LedgerRegistrationFormData를 사용하세요
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
 * @note - onConfirm의 data는 ledgerSchema.ts의 LedgerRegistrationFormData 타입을 사용합니다
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
 * Ledger 결제 방법 ID 타입
 */
export type CustomerAccountPaymentMethodId =
  | 'cash'
  | 'ledger'
  | 'bankTransfer'
  | 'card';

/**
 * 거래 타입 ID 타입
 */
export type CustomerAccountTransactionTypeId =
  | 'register'
  | 'use'
  | 'charge'
  | 'edit';

// ===== 상수 데이터 =====

/**
 * Ledger 결제 방법 목록
 */
export const CUSTOMER_ACCOUNT_PAYMENT_METHODS = [
  { id: 'cash', name: '현금', value: CustomerAccountPaymentMethod.CASH },
  { id: 'ledger', name: '장부', value: CustomerAccountPaymentMethod.LEDGER },
  {
    id: 'bankTransfer',
    name: '계좌이체',
    value: CustomerAccountPaymentMethod.BANK_TRANSFER,
  },
  { id: 'card', name: '카드', value: CustomerAccountPaymentMethod.CARD },
] as const;

/**
 * 거래 타입 목록
 */
export const CUSTOMER_ACCOUNT_TRANSACTION_TYPES = [
  {
    id: 'register',
    name: '등록',
    value: CustomerAccountTransactionType.REGISTER,
  },
  { id: 'use', name: '사용', value: CustomerAccountTransactionType.USE },
  { id: 'charge', name: '충전', value: CustomerAccountTransactionType.CHARGE },
  { id: 'edit', name: '수정', value: CustomerAccountTransactionType.EDIT },
] as const;

// ===== 유틸리티 함수 타입들 =====

/**
 * 장부 금액 계산 함수 타입
 */
export type CalculateLedgerAmount = (transactions: CustomerTransaction[]) => {
  totalAmount: number;
  usedAmount: number;
  remainingAmount: number;
};

/**
 * 거래 처리 함수 타입
 */
export type ProcessTransaction = (
  customerInfo: CustomerInfo,
  transactionData: Partial<CustomerTransaction>
) => Promise<{ success: boolean; message: string }>;
