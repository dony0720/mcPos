/**
 * 카테고리 관련 타입 정의
 */

/**
 * 카테고리 인터페이스
 */
export interface Category {
  /** 카테고리 고유 ID */
  id: string;
  /** 카테고리명 */
  name: string;
  /** 카테고리 표시 순서 (낮을수록 앞에 표시) */
  displayOrder: number;
  /** 기본 카테고리 여부 (삭제 불가) */
  isDefault: boolean;
  /** 해당 카테고리의 메뉴 개수 (선택적) */
  menuCount?: number;
  /** 생성일시 */
  createdAt: string;
  /** 수정일시 */
  updatedAt: string;
}

/**
 * 카테고리 생성/수정을 위한 폼 데이터 타입
 */
export interface CategoryFormData {
  /** 카테고리명 */
  name: string;
  /** 표시 순서 */
  displayOrder: number;
}
