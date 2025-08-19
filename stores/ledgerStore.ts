import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  ChargeData,
  CustomerInfo,
  LedgerData,
  LedgerRegistrationData,
  CustomerAccountPaymentMethod as PaymentMethod,
  CustomerTransaction as Transaction,
  CustomerAccountTransactionType as TransactionType,
} from '../types';

// ===== Store State Interface =====
interface LedgerState {
  // 장부 데이터
  ledgerData: LedgerData[];

  // 거래 내역 데이터 (고객별)
  transactions: Record<string, Transaction[]>;

  // 모달 상태
  isRegistrationModalVisible: boolean;
  isChargeModalVisible: boolean;
  isHistoryModalVisible: boolean;
  isDeleteConfirmModalVisible: boolean;

  // 선택된 고객 정보
  selectedCustomer: CustomerInfo | null;
  selectedLedgerForDelete: LedgerData | null;

  // Actions
  // 장부 등록
  registerLedger: (data: LedgerRegistrationData) => void;

  // 장부 충전
  chargeLedger: (memberNumber: string, chargeData: ChargeData) => void;

  // 장부 사용
  useLedger: (
    memberNumber: string,
    useData: { amount: number; receptionist: string }
  ) => void;

  // 거래 내역 추가
  addTransaction: (
    memberNumber: string,
    transaction: Omit<Transaction, 'id'>
  ) => void;

  // 거래 내역 삭제
  deleteTransaction: (memberNumber: string, transactionId: string) => void;

  // 장부 삭제
  deleteLedger: (memberNumber: string) => void;

  // 모달 관리
  openRegistrationModal: () => void;
  closeRegistrationModal: () => void;
  openChargeModal: (customer: CustomerInfo) => void;
  closeChargeModal: () => void;
  openHistoryModal: (customer: CustomerInfo) => void;
  closeHistoryModal: () => void;
  openDeleteConfirmModal: (ledger: LedgerData) => void;
  closeDeleteConfirmModal: () => void;

  // 유틸리티
  getLedgerByMemberNumber: (memberNumber: string) => LedgerData | undefined;
  getTransactionsByMemberNumber: (memberNumber: string) => Transaction[];
  generateMemberNumber: () => string;
  formatAmount: (amount: number) => string;
  parseAmount: (amountString: string) => number;
}

// ===== Store Implementation =====
export const useLedgerStore = create<LedgerState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      ledgerData: [],
      transactions: {},
      isRegistrationModalVisible: false,
      isChargeModalVisible: false,
      isHistoryModalVisible: false,
      isDeleteConfirmModalVisible: false,
      selectedCustomer: null,
      selectedLedgerForDelete: null,

      // 장부 등록
      registerLedger: (data: LedgerRegistrationData) => {
        const { generateMemberNumber, formatAmount } = get();
        const memberNumber = generateMemberNumber();
        const initialAmount = get().parseAmount(data.initialAmount);

        const newLedger: LedgerData = {
          id: Date.now(),
          memberNumber,
          name: data.name,
          phoneNumber: data.phoneNumber,
          receptionist: data.receptionist,
          chargeAmount: formatAmount(initialAmount),
          paymentMethod: data.paymentMethod,
        };

        // 등록 거래 내역 생성
        const registrationTransaction: Omit<Transaction, 'id'> = {
          date: new Date().toLocaleString('ko-KR'),
          type: TransactionType.REGISTER,
          amount: formatAmount(initialAmount),
          receptionist: data.receptionist,
          paymentMethod: data.paymentMethod as PaymentMethod,
        };

        set(state => ({
          ledgerData: [...state.ledgerData, newLedger],
          transactions: {
            ...state.transactions,
            [memberNumber]: [registrationTransaction],
          },
        }));
      },

      // 장부 충전
      chargeLedger: (memberNumber: string, chargeData: ChargeData) => {
        const { formatAmount, parseAmount } = get();
        const currentAmount = parseAmount(
          get().getLedgerByMemberNumber(memberNumber)?.chargeAmount || '0'
        );
        const chargeAmount = parseAmount(chargeData.chargeAmount);
        const newAmount = currentAmount + chargeAmount;

        // 충전 거래 내역 생성
        const chargeTransaction: Omit<Transaction, 'id'> = {
          date: new Date().toLocaleString('ko-KR'),
          type: TransactionType.CHARGE,
          amount: formatAmount(chargeAmount),
          receptionist: chargeData.receptionist,
          paymentMethod: chargeData.paymentMethod as PaymentMethod,
        };

        set(state => ({
          ledgerData: state.ledgerData.map(ledger =>
            ledger.memberNumber === memberNumber
              ? { ...ledger, chargeAmount: formatAmount(newAmount) }
              : ledger
          ),
          transactions: {
            ...state.transactions,
            [memberNumber]: [
              ...(state.transactions[memberNumber] || []),
              chargeTransaction,
            ],
          },
        }));
      },

      // 장부 사용
      useLedger: (
        memberNumber: string,
        useData: { amount: number; receptionist: string }
      ) => {
        const { formatAmount, parseAmount } = get();
        const currentAmount = parseAmount(
          get().getLedgerByMemberNumber(memberNumber)?.chargeAmount || '0'
        );
        const useAmount = useData.amount;

        if (currentAmount < useAmount) {
          throw new Error('잔액이 부족합니다.');
        }

        const newAmount = currentAmount - useAmount;

        // 사용 거래 내역 생성
        const useTransaction: Omit<Transaction, 'id'> = {
          date: new Date().toLocaleString('ko-KR'),
          type: TransactionType.USE,
          amount: formatAmount(useAmount),
          receptionist: useData.receptionist,
          paymentMethod: PaymentMethod.LEDGER,
        };

        set(state => ({
          ledgerData: state.ledgerData.map(ledger =>
            ledger.memberNumber === memberNumber
              ? { ...ledger, chargeAmount: formatAmount(newAmount) }
              : ledger
          ),
          transactions: {
            ...state.transactions,
            [memberNumber]: [
              ...(state.transactions[memberNumber] || []),
              useTransaction,
            ],
          },
        }));
      },

      // 거래 내역 추가
      addTransaction: (
        memberNumber: string,
        transaction: Omit<Transaction, 'id'>
      ) => {
        set(state => ({
          transactions: {
            ...state.transactions,
            [memberNumber]: [
              ...(state.transactions[memberNumber] || []),
              { ...transaction, id: Date.now().toString() },
            ],
          },
        }));
      },

      // 거래 내역 삭제
      deleteTransaction: (memberNumber: string, transactionId: string) => {
        set(state => ({
          transactions: {
            ...state.transactions,
            [memberNumber]: (state.transactions[memberNumber] || []).filter(
              transaction => transaction.id !== transactionId
            ),
          },
        }));
      },

      // 장부 삭제
      deleteLedger: (memberNumber: string) => {
        set(state => {
          const newTransactions = { ...state.transactions };
          delete newTransactions[memberNumber];

          return {
            ledgerData: state.ledgerData.filter(
              ledger => ledger.memberNumber !== memberNumber
            ),
            transactions: newTransactions,
            selectedLedgerForDelete: null,
            isDeleteConfirmModalVisible: false,
          };
        });
      },

      // 모달 관리
      openRegistrationModal: () => set({ isRegistrationModalVisible: true }),
      closeRegistrationModal: () => set({ isRegistrationModalVisible: false }),

      openChargeModal: (customer: CustomerInfo) =>
        set({
          isChargeModalVisible: true,
          selectedCustomer: customer,
        }),
      closeChargeModal: () =>
        set({
          isChargeModalVisible: false,
          selectedCustomer: null,
        }),

      openHistoryModal: (customer: CustomerInfo) =>
        set({
          isHistoryModalVisible: true,
          selectedCustomer: customer,
        }),
      closeHistoryModal: () =>
        set({
          isHistoryModalVisible: false,
          selectedCustomer: null,
        }),

      openDeleteConfirmModal: (ledger: LedgerData) =>
        set({
          isDeleteConfirmModalVisible: true,
          selectedLedgerForDelete: ledger,
        }),
      closeDeleteConfirmModal: () =>
        set({
          isDeleteConfirmModalVisible: false,
          selectedLedgerForDelete: null,
        }),

      // 유틸리티 함수들
      getLedgerByMemberNumber: (memberNumber: string) => {
        return get().ledgerData.find(
          ledger => ledger.memberNumber === memberNumber
        );
      },

      getTransactionsByMemberNumber: (memberNumber: string) => {
        return get().transactions[memberNumber] || [];
      },

      generateMemberNumber: () => {
        const existingNumbers = get().ledgerData.map(
          ledger => ledger.memberNumber
        );
        let counter = 1;
        let memberNumber = `M${counter.toString().padStart(3, '0')}`;

        while (existingNumbers.includes(memberNumber)) {
          counter++;
          memberNumber = `M${counter.toString().padStart(3, '0')}`;
        }

        return memberNumber;
      },

      formatAmount: (amount: number) => {
        return `${amount.toLocaleString('ko-KR')}원`;
      },

      parseAmount: (amountString: string) => {
        const numbersOnly = amountString.replace(/[^\d]/g, '');
        return parseInt(numbersOnly, 10) || 0;
      },
    }),
    {
      name: 'ledger-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        ledgerData: state.ledgerData,
        transactions: state.transactions,
      }),
    }
  )
);
