import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { Category } from '../types';

interface CategoryStore {
  categories: Category[];
  addCategory: (
    category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>
  ) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  getCategoryById: (id: string) => Category | undefined;
}

const initialCategories: Category[] = [
  { id: 'All', name: '전체', displayOrder: 1, menuCount: 0 },
];

/**
 * 카테고리 상태 관리 Store
 * - 카테고리 CRUD 기능 제공
 * - 로컬 스토리지에 자동 저장
 */
export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: initialCategories,

      // 카테고리 추가
      addCategory: category => {
        const newCategory: Category = {
          ...category,
          name: category.name,
          displayOrder: category.displayOrder,
          id: `category-${Date.now()}`, // 커스텀 카테고리 ID 생성
          menuCount: 0, // 초기 메뉴 개수는 0
        };

        set(state => ({
          categories: [...state.categories, newCategory].sort(
            (a, b) => a.displayOrder - b.displayOrder
          ),
        }));
      },

      // 카테고리 수정
      updateCategory: (id, updatedCategory) => {
        set(state => ({
          categories: state.categories
            .map(category =>
              category.id === id
                ? { ...category, ...updatedCategory }
                : category
            )
            .sort((a, b) => a.displayOrder - b.displayOrder),
        }));
      },

      // 카테고리 삭제 (기본 카테고리는 삭제 불가)
      deleteCategory: id => {
        set(state => ({
          categories: state.categories.filter(category => category.id !== id),
        }));
      },

      // ID로 카테고리 조회
      getCategoryById: id => {
        return get().categories.find(category => category.id === id);
      },
    }),
    {
      name: 'category-store', // 로컬 스토리지 키
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
