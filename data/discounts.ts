import type { Discount } from '../types';

/**
 * 기본 할인 데이터
 * - 퍼블리싱 단계용 임시 데이터
 */
export const DISCOUNTS: Discount[] = [
  {
    id: 'student-discount',
    name: '학생 할인',
    type: 'PERCENTAGE',
    value: 10,
    isActive: true,
    minOrderAmount: 5000,
    maxDiscountAmount: 2000,
    description: '학생증 제시 시 10% 할인 (최대 2,000원)',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'senior-discount',
    name: '시니어 할인',
    type: 'PERCENTAGE',
    value: 15,
    isActive: true,
    minOrderAmount: 3000,
    maxDiscountAmount: 3000,
    description: '만 65세 이상 15% 할인 (최대 3,000원)',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'happy-hour',
    name: '해피아워',
    type: 'FIXED_AMOUNT',
    value: 1000,
    isActive: false,
    minOrderAmount: 8000,
    description: '오후 2-4시 모든 음료 1,000원 할인',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'bulk-order',
    name: '대량 주문 할인',
    type: 'PERCENTAGE',
    value: 20,
    isActive: true,
    minOrderAmount: 50000,
    maxDiscountAmount: 15000,
    description: '5만원 이상 주문 시 20% 할인 (최대 15,000원)',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'first-order',
    name: '첫 주문 할인',
    type: 'FIXED_AMOUNT',
    value: 3000,
    isActive: true,
    description: '첫 주문 고객 3,000원 할인',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];
