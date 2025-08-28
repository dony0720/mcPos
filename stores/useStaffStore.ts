import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { StaffFormSchemaType } from '../schemas';
import { Staff } from '../types';

interface StaffStore {
  staffs: Staff[];
  addStaff: (staff: StaffFormSchemaType) => void;
  updateStaff: (id: string, staff: Partial<StaffFormSchemaType>) => void;
  deleteStaff: (id: string) => void;
  getStaffById: (id: string) => Staff | undefined;
}

/**
 * 직원 상태 관리 Store
 * - 직원 CRUD 기능 제공
 * - 로컬 스토리지에 자동 저장
 */
export const useStaffStore = create<StaffStore>()(
  persist(
    (set, get) => ({
      staffs: [],

      // 직원 추가
      addStaff: staff => {
        const newStaff: Staff = {
          ...staff,
          id: `staff-${Date.now()}`, // 직원 ID 생성
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set(state => ({
          staffs: [...state.staffs, newStaff],
        }));
      },

      // 직원 수정
      updateStaff: (id, updatedStaff) => {
        const now = new Date().toISOString();
        set(state => ({
          staffs: state.staffs.map(staff =>
            staff.id === id
              ? { ...staff, ...updatedStaff, updatedAt: now }
              : staff
          ),
        }));
      },

      // 직원 삭제
      deleteStaff: id => {
        set(state => ({
          staffs: state.staffs.filter(staff => staff.id !== id),
        }));
      },

      // ID로 직원 조회
      getStaffById: id => {
        return get().staffs.find(staff => staff.id === id);
      },
    }),
    {
      name: 'staff-store', // 로컬 스토리지 키
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
