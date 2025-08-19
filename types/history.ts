/**
 * 거래내역 관련 타입 정의
 */

/**
 * 필터 타입 enum
 */
export enum FilterType {
  ALL = 'all',
  CASH = '현금',
  TRANSFER = '이체',
  COUPON = '쿠폰',
  LEDGER = '장부',
  DEPOSIT = '입금',
  WITHDRAWAL = '출금',
}

/**
 * 필터 옵션 인터페이스
 */
export interface FilterOption {
  key: FilterType;
  label: string;
  icon: string;
  color: string;
}

/**
 * FilterTabs 컴포넌트 props
 */
export interface FilterTabsProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}
