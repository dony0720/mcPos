// usePaymentState.ts - SRP: 결제 상태 관리만 담당

import { useState } from 'react';

export interface PaymentState {
  isChecked: boolean;
  selectedPaymentMethod: string | null;
  selectedOrderMethod: string | null;
  showUniqueNumberModal: boolean;
  showPickupNumberModal: boolean;
  uniqueNumber: string;
}

const initialState: PaymentState = {
  isChecked: false,
  selectedPaymentMethod: null,
  selectedOrderMethod: null,
  showUniqueNumberModal: false,
  showPickupNumberModal: false,
  uniqueNumber: '',
};

/**
 * 결제 상태 관리 훅 (SRP: 상태 관리만 담당)
 * - 체크박스, 결제방법, 주문방법, 모달 상태 등을 관리
 * - 비즈니스 로직은 포함하지 않음
 */
export const usePaymentState = () => {
  const [state, setState] = useState<PaymentState>(initialState);

  // 상태 업데이트 함수들
  const actions = {
    updateState: (updates: Partial<PaymentState>) => {
      setState(prev => ({ ...prev, ...updates }));
    },

    toggleCheckbox: () => {
      setState(prev => ({ ...prev, isChecked: !prev.isChecked }));
    },

    setPaymentMethod: (methodId: string) => {
      setState(prev => ({ ...prev, selectedPaymentMethod: methodId }));
    },

    setOrderMethod: (methodId: string) => {
      setState(prev => ({ ...prev, selectedOrderMethod: methodId }));
    },

    showUniqueNumberModal: () => {
      setState(prev => ({ ...prev, showUniqueNumberModal: true }));
    },

    hideUniqueNumberModal: () => {
      setState(prev => ({ ...prev, showUniqueNumberModal: false }));
    },

    showPickupNumberModal: () => {
      setState(prev => ({ ...prev, showPickupNumberModal: true }));
    },

    hidePickupNumberModal: () => {
      setState(prev => ({ ...prev, showPickupNumberModal: false }));
    },

    setUniqueNumber: (number: string) => {
      setState(prev => ({ ...prev, uniqueNumber: number }));
    },

    resetState: () => {
      setState(initialState);
    },
  };

  return {
    state,
    actions,
  };
};
