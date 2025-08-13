import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { CashDrawerMoneyItem, CashTheme } from '../types';

// 권종별 현금 분리 결과
export interface CashBreakdown {
  denomination: number; // 권종 (50000, 10000, 5000, 1000, 500, 100)
  quantity: number; // 수량
  total: number; // 총액
}

// 현금 거래 기록
export interface CashTransaction {
  id: string;
  timestamp: Date;
  type: 'sale' | 'change' | 'adjustment' | 'manual_deposit' | 'manual_withdraw'; // 매출, 거스름돈, 조정, 수동입금, 수동출금
  transactionId?: string; // 연결된 거래 ID (매출/거스름돈인 경우)
  breakdown: CashBreakdown[]; // 권종별 변동 내역
  totalAmount: number; // 총 변동 금액
  description: string; // 설명
}

// 현금 스토어 액션들
export interface CashStoreActions {
  // 현금 서랍 관리
  updateCashDrawer: (newData: CashDrawerMoneyItem[]) => void;
  updateDenomination: (unitValue: number, quantity: number) => void;

  // 현금 거래 기록
  addCashTransaction: (
    transaction: Omit<CashTransaction, 'id' | 'timestamp'>
  ) => void;
  getCashTransactionsByDate: (date: Date) => CashTransaction[];
  getTodayCashTransactions: () => CashTransaction[];

  // 권종별 분리 계산
  calculateOptimalBreakdown: (amount: number) => CashBreakdown[];
  calculateOptimalChangeBreakdown: (amount: number) => CashBreakdown[];
  applyCashBreakdown: (
    receivedBreakdown: CashBreakdown[] | Record<string, number>,
    changeBreakdown: CashBreakdown[] | Record<string, number>,
    type: 'sale' | 'manual_deposit' | 'manual_withdraw',
    description?: string,
    transactionId?: string
  ) => void;

  // 통계 및 조회
  getTotalCashAmount: () => number;
  getDenominationQuantity: (unitValue: number) => number;
  getCashSummary: () => {
    totalAmount: number;
    breakdown: CashDrawerMoneyItem[];
  };

  // 일일 정산
  performDailySettlement: () => {
    totalSales: number;
    totalChange: number;
    netCashFlow: number;
    transactions: CashTransaction[];
  };

  // 입출금 조회
  getTodayDeposits: () => number;
  getTodayWithdrawals: () => number;
}

// 현금 스토어 상태
export interface CashState extends CashStoreActions {
  cashDrawer: CashDrawerMoneyItem[];
  cashTransactions: CashTransaction[];
}

// 초기 현금 서랍 데이터
const INITIAL_CASH_DRAWER: CashDrawerMoneyItem[] = [
  {
    type: '지폐',
    title: '5만원',
    theme: CashTheme.YELLOW,
    quantity: 8,
    unitValue: 50000,
  },
  {
    type: '지폐',
    title: '1만원',
    theme: CashTheme.GREEN,
    quantity: 15,
    unitValue: 10000,
  },
  {
    type: '지폐',
    title: '5천원',
    theme: CashTheme.ORANGE,
    quantity: 12,
    unitValue: 5000,
  },
  {
    type: '지폐',
    title: '1천원',
    theme: CashTheme.BLUE,
    quantity: 25,
    unitValue: 1000,
  },
  {
    type: '동전',
    title: '500원',
    theme: CashTheme.GRAY,
    quantity: 30,
    unitValue: 500,
  },
  {
    type: '동전',
    title: '100원',
    theme: CashTheme.GRAY,
    quantity: 50,
    unitValue: 100,
  },
];

// 날짜 유틸리티
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

export const useCashStore = create<CashState>()(
  persist(
    (set, get) => ({
      cashDrawer: INITIAL_CASH_DRAWER,
      cashTransactions: [],

      // 현금 서랍 업데이트
      updateCashDrawer: (newData: CashDrawerMoneyItem[]) => {
        set({ cashDrawer: newData });
      },

      // 특정 권종 수량 업데이트
      updateDenomination: (unitValue: number, quantity: number) => {
        set(state => ({
          cashDrawer: state.cashDrawer.map(item =>
            item.unitValue === unitValue ? { ...item, quantity } : item
          ),
        }));
      },

      // 현금 거래 기록 추가
      addCashTransaction: transactionData => {
        const newTransaction: CashTransaction = {
          ...transactionData,
          id: `CASH_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
        };

        set(state => ({
          cashTransactions: [newTransaction, ...state.cashTransactions],
        }));
      },

      // 특정 날짜의 현금 거래 조회
      getCashTransactionsByDate: (date: Date) => {
        return get().cashTransactions.filter(transaction =>
          isSameDay(new Date(transaction.timestamp), date)
        );
      },

      // 오늘의 현금 거래 조회
      getTodayCashTransactions: () => {
        const today = new Date();
        return get().getCashTransactionsByDate(today);
      },

      // 최적 권종 분리 계산 (현금 서랍 보유량 고려)
      calculateOptimalBreakdown: (amount: number): CashBreakdown[] => {
        const denominations = [50000, 10000, 5000, 1000, 500, 100];
        const breakdown: CashBreakdown[] = [];
        let remainingAmount = amount;
        const currentCashDrawer = get().cashDrawer;

        for (const denomination of denominations) {
          if (remainingAmount >= denomination) {
            // 현재 보유량 확인 (거스름돈인 경우에만 고려)
            const _availableQuantity =
              currentCashDrawer.find(item => item.unitValue === denomination)
                ?.quantity || 0;

            // 필요한 수량 계산
            const neededQuantity = Math.floor(remainingAmount / denomination);

            // 실제 사용할 수량 (받은 금액의 경우 제한 없음, 거스름돈의 경우 보유량 제한)
            const actualQuantity = neededQuantity;

            if (actualQuantity > 0) {
              const total = actualQuantity * denomination;

              breakdown.push({
                denomination,
                quantity: actualQuantity,
                total,
              });

              remainingAmount -= total;
            }
          }
        }

        return breakdown;
      },

      // 거스름돈용 최적 권종 분리 (보유량 고려)
      calculateOptimalChangeBreakdown: (amount: number): CashBreakdown[] => {
        const denominations = [50000, 10000, 5000, 1000, 500, 100];
        const breakdown: CashBreakdown[] = [];
        let remainingAmount = amount;
        const currentCashDrawer = get().cashDrawer;

        for (const denomination of denominations) {
          if (remainingAmount >= denomination) {
            // 현재 보유량 확인
            const availableQuantity =
              currentCashDrawer.find(item => item.unitValue === denomination)
                ?.quantity || 0;

            // 필요한 수량 계산
            const neededQuantity = Math.floor(remainingAmount / denomination);

            // 실제 사용할 수량 (보유량 제한)
            const actualQuantity = Math.min(neededQuantity, availableQuantity);

            if (actualQuantity > 0) {
              const total = actualQuantity * denomination;

              breakdown.push({
                denomination,
                quantity: actualQuantity,
                total,
              });

              remainingAmount -= total;
            }
          }
        }

        // 거스름돈을 완전히 만들 수 없는 경우는 일단 무시 (나중에 필요시 처리)
        // if (remainingAmount > 0) {
        //   // 에러 처리는 나중에 구현
        // }

        return breakdown;
      },

      // 현금 분리 결과를 현금 서랍에 적용
      applyCashBreakdown: (
        receivedBreakdown: CashBreakdown[] | Record<string, number>,
        changeBreakdown: CashBreakdown[] | Record<string, number>,
        type: 'sale' | 'manual_deposit' | 'manual_withdraw',
        description: string = '',
        transactionId?: string
      ) => {
        const state = get();
        const updatedCashDrawer = [...state.cashDrawer];

        // Record 형태를 CashBreakdown 배열로 변환하는 함수
        const normalizeBreakdown = (
          breakdown: CashBreakdown[] | Record<string, number>
        ): CashBreakdown[] => {
          if (Array.isArray(breakdown)) {
            return breakdown;
          }

          return Object.entries(breakdown).map(([denomination, quantity]) => ({
            denomination: parseInt(denomination),
            quantity,
            total: parseInt(denomination) * quantity,
          }));
        };

        const normalizedReceived = normalizeBreakdown(receivedBreakdown);
        const normalizedChange = normalizeBreakdown(changeBreakdown);

        // 받은 금액/입금 추가 (현금 서랍에 +)
        normalizedReceived.forEach(item => {
          const drawerItem = updatedCashDrawer.find(
            drawer => drawer.unitValue === item.denomination
          );
          if (drawerItem) {
            drawerItem.quantity += item.quantity;
          }
        });

        // 거스름돈/출금 차감 (현금 서랍에서 -)
        normalizedChange.forEach(item => {
          const drawerItem = updatedCashDrawer.find(
            drawer => drawer.unitValue === item.denomination
          );
          if (drawerItem) {
            drawerItem.quantity += item.quantity; // 이미 음수로 계산되어 있음
          }
        });

        // 현금 서랍 업데이트
        set({ cashDrawer: updatedCashDrawer });

        // 현금 거래 기록 추가
        const receivedTotal = normalizedReceived.reduce(
          (sum, item) => sum + item.total,
          0
        );
        const changeTotal = normalizedChange.reduce(
          (sum, item) => sum + item.total,
          0
        );

        // 거래 타입별 처리
        if (type === 'sale') {
          // 받은 금액 기록
          if (receivedTotal > 0) {
            get().addCashTransaction({
              type: 'sale',
              transactionId,
              breakdown: normalizedReceived,
              totalAmount: receivedTotal,
              description: '현금 매출',
            });
          }

          // 거스름돈 기록
          if (Math.abs(changeTotal) > 0) {
            get().addCashTransaction({
              type: 'change',
              transactionId,
              breakdown: normalizedChange.map(item => ({
                ...item,
                quantity: -Math.abs(item.quantity), // 음수로 기록
                total: -Math.abs(item.total), // 음수로 기록
              })),
              totalAmount: -Math.abs(changeTotal), // 음수로 기록
              description: '거스름돈',
            });
          }
        } else if (type === 'manual_deposit') {
          // 수동 입금 기록
          if (receivedTotal > 0) {
            get().addCashTransaction({
              type: 'manual_deposit',
              breakdown: normalizedReceived,
              totalAmount: receivedTotal,
              description: description || '수동 입금',
            });
          }
        } else if (type === 'manual_withdraw') {
          // 수동 출금 기록
          if (Math.abs(changeTotal) > 0) {
            get().addCashTransaction({
              type: 'manual_withdraw',
              breakdown: normalizedChange.map(item => ({
                ...item,
                quantity: -Math.abs(item.quantity), // 음수로 기록
                total: -Math.abs(item.total), // 음수로 기록
              })),
              totalAmount: -Math.abs(changeTotal), // 음수로 기록
              description: description || '수동 출금',
            });
          }
        }
      },

      // 총 현금 금액 계산
      getTotalCashAmount: () => {
        return get().cashDrawer.reduce(
          (total, item) => total + item.quantity * item.unitValue,
          0
        );
      },

      // 특정 권종 수량 조회
      getDenominationQuantity: (unitValue: number) => {
        const item = get().cashDrawer.find(
          drawer => drawer.unitValue === unitValue
        );
        return item ? item.quantity : 0;
      },

      // 현금 요약 정보
      getCashSummary: () => {
        const cashDrawer = get().cashDrawer;
        const totalAmount = get().getTotalCashAmount();

        return {
          totalAmount,
          breakdown: cashDrawer,
        };
      },

      // 일일 정산
      performDailySettlement: () => {
        const todayTransactions = get().getTodayCashTransactions();

        const totalSales = todayTransactions
          .filter(t => t.type === 'sale')
          .reduce((sum, t) => sum + t.totalAmount, 0);

        const totalChange = todayTransactions
          .filter(t => t.type === 'change')
          .reduce((sum, t) => sum + Math.abs(t.totalAmount), 0);

        const netCashFlow = totalSales - totalChange;

        return {
          totalSales,
          totalChange,
          netCashFlow,
          transactions: todayTransactions,
        };
      },

      // 오늘 입금 총액
      getTodayDeposits: () => {
        const todayTransactions = get().getTodayCashTransactions();
        return todayTransactions
          .filter(t => t.type === 'manual_deposit')
          .reduce((sum, t) => sum + t.totalAmount, 0);
      },

      // 오늘 출금 총액
      getTodayWithdrawals: () => {
        const todayTransactions = get().getTodayCashTransactions();
        return todayTransactions
          .filter(t => t.type === 'manual_withdraw')
          .reduce((sum, t) => sum + Math.abs(t.totalAmount), 0);
      },
    }),
    {
      name: 'cash-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
