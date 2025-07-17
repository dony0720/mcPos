import { useState } from 'react';

// 여러 모달을 동시에 관리할 수 있는 hook
export type ModalType = 'registration' | 'charge' | 'history';

interface UseModalReturn {
  // 현재 열린 모달
  currentModal: ModalType | null;

  // 모달 제어 함수
  openModal: (type: ModalType) => void;
  closeModal: () => void;

  // 편의 함수들
  isModalOpen: (type: ModalType) => boolean;
}

export const useModal = (): UseModalReturn => {
  const [currentModal, setCurrentModal] = useState<ModalType | null>(null);

  const openModal = (type: ModalType) => {
    setCurrentModal(type);
  };

  const closeModal = () => {
    setCurrentModal(null);
  };

  const isModalOpen = (type: ModalType): boolean => {
    return currentModal === type;
  };

  return {
    currentModal,
    openModal,
    closeModal,
    isModalOpen,
  };
};
