import { create } from 'zustand';

interface AuthState {
  // 상태
  isAdminAuthenticated: boolean;

  // 액션들
  login: (password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>(set => ({
  // 초기 상태
  isAdminAuthenticated: false,

  // 관리자 로그인
  login: (password: string) => {
    const isValid = password === 'admin123';
    if (isValid) {
      set({ isAdminAuthenticated: true });
    }
    return isValid;
  },

  // 관리자 로그아웃
  logout: () => {
    set({ isAdminAuthenticated: false });
  },
}));
