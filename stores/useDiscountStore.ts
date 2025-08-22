import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { DiscountFormSchemaType } from '../schemas';
import type { Discount } from '../types';

interface DiscountStore {
  discounts: Discount[];
  addDiscount: (
    discount: DiscountFormSchemaType & {
      isActive?: boolean;
      description?: string;
    }
  ) => void;
  updateDiscount: (id: string, discount: Partial<Discount>) => void;
  deleteDiscount: (id: string) => void;
  getDiscountById: (id: string) => Discount | undefined;
}

/**
 * 할인 상태 관리 Store
 * - 할인 CRUD 기능 제공
 * - 로컬 스토리지에 자동 저장
 */
export const useDiscountStore = create<DiscountStore>()(
  persist(
    (set, get) => ({
      discounts: [],

      // 할인 추가
      addDiscount: discount => {
        const newDiscount: Discount = {
          ...discount,
          id: `discount-${Date.now()}`, // 할인 ID 생성
          isActive: discount.isActive ?? true, // 기본값: 활성화
        };

        set(state => ({
          discounts: [...state.discounts, newDiscount],
        }));
      },

      // 할인 수정
      updateDiscount: (id, updatedDiscount) => {
        const now = new Date().toISOString();
        set(state => ({
          discounts: state.discounts.map(discount =>
            discount.id === id
              ? { ...discount, ...updatedDiscount, updatedAt: now }
              : discount
          ),
        }));
      },

      // 할인 삭제
      deleteDiscount: id => {
        set(state => ({
          discounts: state.discounts.filter(discount => discount.id !== id),
        }));
      },

      // ID로 할인 조회
      getDiscountById: id => {
        return get().discounts.find(discount => discount.id === id);
      },
    }),
    {
      name: 'discount-store', // 로컬 스토리지 키
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
