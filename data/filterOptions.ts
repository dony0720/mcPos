import { FilterOption, FilterType } from '../types/history';

/**
 * 거래내역 필터 옵션 데이터
 */
export const FILTER_OPTIONS: FilterOption[] = [
  {
    key: FilterType.ALL,
    label: '전체',
    icon: 'apps-outline',
    color: '#6B7280',
  },
  {
    key: FilterType.CASH,
    label: '현금',
    icon: 'cash-outline',
    color: '#10B981',
  },
  {
    key: FilterType.TRANSFER,
    label: '이체',
    icon: 'card-outline',
    color: '#3B82F6',
  },
  {
    key: FilterType.COUPON,
    label: '쿠폰',
    icon: 'ticket-outline',
    color: '#F59E0B',
  },
  {
    key: FilterType.LEDGER,
    label: '장부',
    icon: 'book-outline',
    color: '#8B5CF6',
  },
  {
    key: FilterType.DEPOSIT,
    label: '입금',
    icon: 'add-circle-outline',
    color: '#10B981',
  },
  {
    key: FilterType.WITHDRAWAL,
    label: '출금',
    icon: 'remove-circle-outline',
    color: '#EF4444',
  },
] as const;
