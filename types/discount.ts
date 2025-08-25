/**
 * 할인 관련 타입 정의
 */

/**
 * 할인 유형
 */

import { DiscountType } from './enums';

/**
 * 할인 인터페이스
 */
export interface Discount {
  id: string;
  name: string;
  value: number;
  type: DiscountType; // fixed: 고정가격으로 변경, deduction: 차감
  isActive?: boolean | undefined;
}

/**
 * 할인 생성/수정을 위한 폼 데이터 타입
 */
export interface DiscountFormData {
  /** 할인명 */
  name: string;
  /** 할인 유형 */
  type: DiscountType;
  /** 할인값 */
  value: number;
  /** 할인 활성화 여부 */
  isActive: boolean;
  /** 최소 주문 금액 */
  minOrderAmount?: number;
  /** 최대 할인 금액 */
  maxDiscountAmount?: number;
  /** 할인 설명 */
  description: string;
}
