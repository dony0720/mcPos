/**
 * 직원 관리 관련 타입 정의
 */

// 직원 역할 타입
export type StaffRole = 'ADMIN' | 'STAFF' | 'PART_TIME';

// 직원 역할 옵션 (UI용)
export const STAFF_ROLES = [
  { value: 'ADMIN' as StaffRole, label: '관리자' },
  { value: 'STAFF' as StaffRole, label: '정직원' },
  { value: 'PART_TIME' as StaffRole, label: '파트타임' },
] as const;

// 직원 정보 인터페이스
export interface Staff {
  id: string;
  name: string;
  role: StaffRole;
  phone: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 직원 폼 데이터 인터페이스 (퍼블리싱용 - 간소화)
export interface StaffFormData {
  name: string;
}
