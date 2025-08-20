/**
 * 직원 관리 관련 타입 정의
 */

// 직원 역할 타입
export type StaffRole = 'ADMIN' | 'STAFF' | 'PART_TIME';

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
