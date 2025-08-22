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
  /** 할인 고유 ID */
  id: string;
  /** 할인명 */
  name: string;
  /** 할인 유형 (퍼센트 또는 고정금액) */
  type: DiscountType;
  /** 할인값 (퍼센트면 1-100, 고정금액이면 원 단위) */
  value: number;
  /** 할인 활성화 여부 */
  isActive: boolean;
  /** 최소 주문 금액 (선택적) */
  minOrderAmount?: number;
  /** 최대 할인 금액 (퍼센트 할인 시 선택적) */
  maxDiscountAmount?: number;
  /** 할인 설명 */
  description: string;
  /** 생성일시 */
  createdAt: string;
  /** 수정일시 */
  updatedAt: string;
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
