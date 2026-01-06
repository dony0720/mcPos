import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsStore {
  receiptCopies: 1 | 2; // 영수증 출력 매수
  setReceiptCopies: (copies: 1 | 2) => void;
}

/**
 * 설정 상태 관리 Store
 * - 앱 전반적인 설정 관리
 * - 로컬 스토리지에 자동 저장
 */
export const useSettingsStore = create<SettingsStore>()(
  persist(
    set => ({
      receiptCopies: 2, // 기본값: 2장

      setReceiptCopies: copies => {
        set({ receiptCopies: copies });
      },
    }),
    {
      name: 'settings-store', // 로컬 스토리지 키
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
