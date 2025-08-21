import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import type { MenuItem } from '../types';

interface MenuStore {
  menus: MenuItem[];
  addMenu: (menu: Omit<MenuItem, 'id'>) => void;
  updateMenu: (id: string, menu: Partial<MenuItem>) => void;
  deleteMenu: (id: string) => void;
  getMenuById: (id: string) => MenuItem | undefined;
  clearAllMenus: () => void;
}

/**
 * 메뉴 상태 관리 Store
 * - 메뉴 CRUD 기능 제공
 * - 로컬 스토리지에 자동 저장
 */
export const useMenuStore = create<MenuStore>()(
  persist(
    (set, get) => ({
      menus: [],

      // 메뉴 추가
      addMenu: menu => {
        const newMenu: MenuItem = {
          ...menu,
          id: Date.now().toString(), // 임시 ID 생성
        };

        set(state => ({
          menus: [...state.menus, newMenu],
        }));
      },

      // 메뉴 수정
      updateMenu: (id, updatedMenu) => {
        set(state => ({
          menus: state.menus.map(menu =>
            menu.id === id ? { ...menu, ...updatedMenu } : menu
          ),
        }));
      },

      // 메뉴 삭제
      deleteMenu: id => {
        set(state => ({
          menus: state.menus.filter(menu => menu.id !== id),
        }));
      },

      // ID로 메뉴 조회
      getMenuById: id => {
        return get().menus.find(menu => menu.id === id);
      },

      // 모든 메뉴 삭제
      clearAllMenus: () => {
        set({ menus: [] });
      },
    }),
    {
      name: 'menu-store', // 로컬 스토리지 키
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
