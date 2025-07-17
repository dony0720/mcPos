import { useState } from 'react';

// 순수한 모달 상태 관리 hook
interface UseModalReturn {
  // 현재 열린 모달
  currentModal: string | null;

  // 모달 제어 함수
  openModal: (type: string) => void;
  closeModal: () => void;

  // 편의 함수들
  isModalOpen: (type: string) => boolean;
}

export const useModal = (): UseModalReturn => {
  const [currentModal, setCurrentModal] = useState<string | null>(null);

  const openModal = (type: string) => {
    setCurrentModal(type);
  };

  const closeModal = () => {
    setCurrentModal(null);
  };

  const isModalOpen = (type: string): boolean => {
    return currentModal === type;
  };

  return {
    currentModal,
    openModal,
    closeModal,
    isModalOpen,
  };
};

// 기존 타입 호환성을 위한 타입 정의
export type ModalType = 'registration' | 'charge' | 'history';
