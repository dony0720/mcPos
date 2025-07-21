import { useState } from 'react';

// POS 시스템에 최적화된 모달 상태 관리 hook
interface UseModal {
  // 현재 최상위 모달 (기존 호환성 유지)
  currentModal: string | null;

  // 핵심 모달 제어 함수
  openModal: (type: string) => void;
  closeModal: () => void;

  // 편의 함수
  isModalOpen: (type: string) => boolean;
}

export const useModal = (): UseModal => {
  const [modalStack, setModalStack] = useState<string[]>([]);

  const openModal = (type: string) => {
    setModalStack(prev => [...prev, type]);
  };

  const closeModal = () => {
    setModalStack(prev => prev.slice(0, -1));
  };

  const isModalOpen = (type: string): boolean => {
    return modalStack.includes(type);
  };

  const currentModal = modalStack[modalStack.length - 1] || null;

  return {
    currentModal,
    openModal,
    closeModal,
    isModalOpen,
  };
};
