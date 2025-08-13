import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import {
  Transaction,
  TransactionFilter,
  TransactionState,
  TransactionStats,
  TransactionStatus,
} from '../types';

// 날짜 유틸리티 함수들
const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const isDateInRange = (date: Date, start?: Date, end?: Date): boolean => {
  if (start && date < start) return false;
  if (end && date > end) return false;
  return true;
};

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],

      // 새 거래 추가
      addTransaction: transactionData => {
        const newTransaction: Transaction = {
          ...transactionData,
          id: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date(),
          status: 'completed',
        };

        set(state => ({
          transactions: [newTransaction, ...state.transactions],
        }));

        return newTransaction.id;
      },

      // ID로 거래 조회
      getTransactionById: (id: string) => {
        return get().transactions.find(transaction => transaction.id === id);
      },

      // 특정 날짜의 거래들 조회
      getTransactionsByDate: (date: Date) => {
        return get().transactions.filter(transaction =>
          isSameDay(new Date(transaction.timestamp), date)
        );
      },

      // 거래 상태 업데이트
      updateTransactionStatus: (id: string, status: TransactionStatus) => {
        set(state => ({
          transactions: state.transactions.map(transaction =>
            transaction.id === id ? { ...transaction, status } : transaction
          ),
        }));
      },

      // 오늘의 거래들 조회
      getTodayTransactions: () => {
        const today = new Date();
        return get().getTransactionsByDate(today);
      },

      // 총 매출 금액 (특정 날짜 또는 전체)
      getTotalSalesAmount: (date?: Date) => {
        const transactions = date
          ? get().getTransactionsByDate(date)
          : get().transactions;

        return transactions
          .filter(t => t.status === 'completed' || t.status === 'picked_up')
          .reduce((total, transaction) => total + transaction.totalAmount, 0);
      },

      // 거래 건수 (특정 날짜 또는 전체)
      getTransactionCount: (date?: Date) => {
        const transactions = date
          ? get().getTransactionsByDate(date)
          : get().transactions;

        return transactions.filter(
          t => t.status === 'completed' || t.status === 'picked_up'
        ).length;
      },

      // 필터링된 거래들 조회
      getFilteredTransactions: (filter: TransactionFilter) => {
        return get().transactions.filter(transaction => {
          const transactionDate = new Date(transaction.timestamp);

          // 날짜 범위 필터
          if (
            !isDateInRange(transactionDate, filter.startDate, filter.endDate)
          ) {
            return false;
          }

          // 결제 방법 필터
          if (
            filter.paymentMethod &&
            transaction.paymentMethod !== filter.paymentMethod
          ) {
            return false;
          }

          // 주문 방법 필터
          if (
            filter.orderMethod &&
            transaction.orderMethod !== filter.orderMethod
          ) {
            return false;
          }

          // 상태 필터
          if (filter.status && transaction.status !== filter.status) {
            return false;
          }

          // 수령 번호 필터
          if (
            filter.pickupNumber &&
            !transaction.pickupNumber.includes(filter.pickupNumber)
          ) {
            return false;
          }

          return true;
        });
      },

      // 거래 통계 조회
      getTransactionStats: (filter?: TransactionFilter): TransactionStats => {
        const transactions = filter
          ? get().getFilteredTransactions(filter)
          : get().transactions;

        const completedTransactions = transactions.filter(
          t => t.status === 'completed' || t.status === 'picked_up'
        );

        const totalSales = completedTransactions.reduce(
          (sum, t) => sum + t.totalAmount,
          0
        );

        const totalTransactions = completedTransactions.length;

        const averageOrderValue =
          totalTransactions > 0 ? totalSales / totalTransactions : 0;

        // 결제 방법별 통계
        const paymentMethodBreakdown = completedTransactions.reduce(
          (acc, transaction) => {
            acc[transaction.paymentMethod] =
              (acc[transaction.paymentMethod] || 0) + transaction.totalAmount;
            return acc;
          },
          {} as Record<string, number>
        );

        // 주문 방법별 통계
        const orderMethodBreakdown = completedTransactions.reduce(
          (acc, transaction) => {
            acc[transaction.orderMethod] =
              (acc[transaction.orderMethod] || 0) + transaction.totalAmount;
            return acc;
          },
          {} as Record<string, number>
        );

        return {
          totalSales,
          totalTransactions,
          averageOrderValue,
          paymentMethodBreakdown,
          orderMethodBreakdown,
        };
      },

      // 필터링된 거래들 조회
      getFilteredTransactions: (filter: TransactionFilter) => {
        return get().transactions.filter(transaction => {
          const transactionDate = new Date(transaction.timestamp);

          // 날짜 범위 필터
          if (
            !isDateInRange(transactionDate, filter.startDate, filter.endDate)
          ) {
            return false;
          }

          // 결제 방법 필터
          if (
            filter.paymentMethod &&
            transaction.paymentMethod !== filter.paymentMethod
          ) {
            return false;
          }

          // 주문 방법 필터
          if (
            filter.orderMethod &&
            transaction.orderMethod !== filter.orderMethod
          ) {
            return false;
          }

          // 상태 필터
          if (filter.status && transaction.status !== filter.status) {
            return false;
          }

          // 수령 번호 필터
          if (
            filter.pickupNumber &&
            !transaction.pickupNumber.includes(filter.pickupNumber)
          ) {
            return false;
          }

          return true;
        });
      },

      // 거래 통계 조회
      getTransactionStats: (filter?: TransactionFilter): TransactionStats => {
        const transactions = filter
          ? get().getFilteredTransactions(filter)
          : get().transactions;

        const completedTransactions = transactions.filter(
          t => t.status === 'completed' || t.status === 'picked_up'
        );

        const totalSales = completedTransactions.reduce(
          (sum, t) => sum + t.totalAmount,
          0
        );

        const totalTransactions = completedTransactions.length;

        const averageOrderValue =
          totalTransactions > 0 ? totalSales / totalTransactions : 0;

        // 결제 방법별 통계
        const paymentMethodBreakdown = completedTransactions.reduce(
          (acc, transaction) => {
            acc[transaction.paymentMethod] =
              (acc[transaction.paymentMethod] || 0) + transaction.totalAmount;
            return acc;
          },
          {} as Record<string, number>
        );

        // 주문 방법별 통계
        const orderMethodBreakdown = completedTransactions.reduce(
          (acc, transaction) => {
            acc[transaction.orderMethod] =
              (acc[transaction.orderMethod] || 0) + transaction.totalAmount;
            return acc;
          },
          {} as Record<string, number>
        );

        return {
          totalSales,
          totalTransactions,
          averageOrderValue,
          paymentMethodBreakdown,
          orderMethodBreakdown,
        };
      },

      // 거래 삭제 (관리자용)
      deleteTransaction: (id: string) => {
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== id),
        }));
      },

      // 모든 거래 초기화 (개발/테스트용)
      clearAllTransactions: () => {
        set({ transactions: [] });
      },
    }),
    {
      name: 'transaction-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // 날짜 객체를 문자열로 변환하여 저장
      serialize: state => {
        return JSON.stringify({
          ...state,
          state: {
            ...state.state,
            transactions: state.state.transactions.map(t => ({
              ...t,
              timestamp: t.timestamp.toISOString(),
            })),
          },
        });
      },
      // 문자열을 날짜 객체로 복원
      deserialize: str => {
        const parsed = JSON.parse(str);
        return {
          ...parsed,
          state: {
            ...parsed.state,
            transactions: parsed.state.transactions.map((t: any) => ({
              ...t,
              timestamp: new Date(t.timestamp),
            })),
          },
        };
      },
    }
  )
);
