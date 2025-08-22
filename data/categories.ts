import type { Category } from '../types';

/**
 * 기본 카테고리 데이터
 * - 퍼블리싱 단계용 임시 데이터
 */
export const CATEGORIES: Category[] = [
  {
    id: 'coffee',
    name: '커피',
    displayOrder: 1,
    isDefault: true,
    menuCount: 8,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'non-coffee',
    name: '논커피',
    displayOrder: 2,
    isDefault: true,
    menuCount: 5,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'tea',
    name: '차',
    displayOrder: 3,
    isDefault: true,
    menuCount: 4,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'ade',
    name: '에이드',
    displayOrder: 4,
    isDefault: true,
    menuCount: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: 'dessert',
    name: '디저트',
    displayOrder: 5,
    isDefault: true,
    menuCount: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
];
