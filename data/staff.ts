import type { Staff } from '../types';

/**
 * 퍼블리싱용 샘플 직원 데이터
 */
export const STAFF: Staff[] = [
  {
    id: '1',
    name: '김철수',
    role: 'ADMIN',
    phone: '010-1234-5678',
    isActive: true,
    createdAt: '2023-01-15T09:00:00Z',
    updatedAt: '2023-01-15T09:00:00Z',
  },
  {
    id: '2',
    name: '이영희',
    role: 'STAFF',
    phone: '010-2345-6789',
    isActive: true,
    createdAt: '2023-02-01T09:00:00Z',
    updatedAt: '2023-02-01T09:00:00Z',
  },
  {
    id: '3',
    name: '박민수',
    role: 'PART_TIME',
    phone: '010-3456-7890',
    isActive: true,
    createdAt: '2023-02-15T09:00:00Z',
    updatedAt: '2023-02-15T09:00:00Z',
  },
  {
    id: '4',
    name: '최지은',
    role: 'STAFF',
    phone: '010-4567-8901',
    isActive: false,
    createdAt: '2023-01-20T09:00:00Z',
    updatedAt: '2023-03-01T09:00:00Z',
  },
  {
    id: '5',
    name: '정우진',
    role: 'PART_TIME',
    phone: '010-5678-9012',
    isActive: true,
    createdAt: '2023-03-01T09:00:00Z',
    updatedAt: '2023-03-01T09:00:00Z',
  },
  {
    id: '6',
    name: '홍길동',
    role: 'ADMIN',
    phone: '010-6789-0123',
    isActive: true,
    createdAt: '2023-01-01T09:00:00Z',
    updatedAt: '2023-01-01T09:00:00Z',
  },
];
