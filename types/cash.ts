// cash.ts - 현금 관리 관련 타입 정의

import { Ionicons } from '@expo/vector-icons';

// ===== Enum 정의 =====

/**
 * 현금 서랍 카드 테마 enum
 */
export enum CashTheme {
  YELLOW = 'yellow',
  GREEN = 'green',
  ORANGE = 'orange',
  BLUE = 'blue',
  GRAY = 'gray',
}

/**
 * 매출 정보 카드 테마 enum
 */
export enum SalesTheme {
  GRAY = 'gray',
  BLUE = 'blue',
  EMERALD = 'emerald',
  RED = 'red',
  GREEN = 'green',
  PURPLE = 'purple',
  ORANGE = 'orange',
  INDIGO = 'indigo',
}

// ===== 기본 엔티티 타입들 =====

/**
 * 현금 서랍 화폐 아이템 정보
 * @description 현금 서랍에 있는 지폐/동전 정보
 */
export interface CashDrawerMoneyItem {
  type: string;
  title: string;
  theme: CashTheme;
  quantity: number;
  unitValue: number;
}

/**
 * 현금 카드 테마 타입
 */
export type CashCardTheme = CashTheme;

/**
 * 매출 정보 카드 테마 타입
 */
export type SalesInfoCardTheme = SalesTheme;

/**
 * 현금 서랍 거래 타입
 * @description 현금 서랍에서 발생하는 거래 유형 (입금, 출금)
 */
export type CashDrawerTransactionType = 'deposit' | 'withdraw';

// ===== 컴포넌트 Props 타입들 =====

export interface CashInspectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (updatedData: CashDrawerMoneyItem[]) => void;
  initialData: CashDrawerMoneyItem[];
}

export interface CashTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  type: CashDrawerTransactionType;
}

export interface CashDrawerCardsProps {
  cashDrawerData: CashDrawerMoneyItem[];
}

export interface CashDrawerCardProps {
  type: string;
  title: string;
  quantity: string;
  totalAmount: string;
  theme: CashCardTheme;
}

export interface CashHeaderProps {
  onInspection?: () => void;
  onDailySettlement?: () => void;
}

export interface CashInfoCardHeaderProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  iconColor: string;
  titleColor: string;
}

export interface ActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  variant: 'outline' | 'filled';
  color?: string;
  onPress?: () => void;
}

export interface SalesInfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  amount: string;
  theme: SalesInfoCardTheme;
}
