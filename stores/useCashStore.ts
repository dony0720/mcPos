// store/cashStore.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export enum CashTheme {
  YELLOW = 'yellow',
  GREEN = 'green',
  ORANGE = 'orange',
  BLUE = 'blue',
  GRAY = 'gray',
  INDIGO = 'indigo',
}

export type CashDrawerMoneyItem = {
  type: string;
  title: string;
  theme: CashTheme;
  quantity: number;
  unitValue: number;
};

export type CashDrawerTransactionType = 'deposit' | 'withdraw';

interface CashTransaction {
  id: string;
  type: CashDrawerTransactionType;
  amount: number;
  description: string;
  timestamp: Date;
  operatorId?: string;
}

interface SalesInfo {
  startingCash: number;
  totalSales: number;
  cashSales: number;
  cardSales: number;
  refunds: number;
  discounts: number;
  netSales: number;
  cumulativeCash: number;
}

interface DailySettlement {
  date: string;
  denominations: CashDrawerMoneyItem[];
  total: number;
}

interface CashState {
  cashDrawerData: CashDrawerMoneyItem[];
  salesInfo: SalesInfo;
  transactions: CashTransaction[];
  currentBalance: number;
  lastInspectionTime: Date | null;
  isDailySettlementComplete: boolean;
  lastRolloverDate: string | null;
  dailySettlements: DailySettlement[];
}

interface CashActions {
  updateCashDrawerData: (data: CashDrawerMoneyItem[]) => void;
  addCashDrawerItem: (item: CashDrawerMoneyItem) => void;
  updateCashDrawerItem: (type: string, quantity: number) => void;

  addTransaction: (
    transaction: Omit<CashTransaction, 'id' | 'timestamp'>
  ) => void;
  removeTransaction: (transactionId: string) => void;

  updateSalesInfo: (salesInfo: Partial<SalesInfo>) => void;
  resetDailySales: () => void;
  calculateCurrentBalance: () => void;

  setLastInspectionTime: (time: Date) => void;
  setDailySettlementComplete: (complete: boolean) => void;
  ensureDailyRollover: () => void;
  performDailySettlement: () => void;

  resetCashDrawer: () => void;
  resetAll: () => void;
}

type CashStore = CashState & CashActions;

const initialCashDrawerData: CashDrawerMoneyItem[] = [
  {
    type: '50000원',
    title: '50,000원',
    theme: CashTheme.BLUE,
    quantity: 0,
    unitValue: 50000,
  },
  {
    type: '10000원',
    title: '10,000원',
    theme: CashTheme.ORANGE,
    quantity: 0,
    unitValue: 10000,
  },
  {
    type: '5000원',
    title: '5,000원',
    theme: CashTheme.GREEN,
    quantity: 0,
    unitValue: 5000,
  },
  {
    type: '1000원',
    title: '1,000원',
    theme: CashTheme.YELLOW,
    quantity: 0,
    unitValue: 1000,
  },
  {
    type: '500원',
    title: '500원',
    theme: CashTheme.INDIGO,
    quantity: 0,
    unitValue: 500,
  },
  {
    type: '100원',
    title: '100원',
    theme: CashTheme.GRAY,
    quantity: 0,
    unitValue: 100,
  },
];

const calcTotalFromDrawer = (drawer: CashDrawerMoneyItem[]) =>
  drawer.reduce((sum, item) => sum + item.quantity * item.unitValue, 0);

export const useCashStore = create<CashStore>()(
  persist(
    (set, get) => ({
      cashDrawerData: initialCashDrawerData,
      salesInfo: {
        startingCash: 0,
        totalSales: 0,
        cashSales: 0,
        cardSales: 0,
        refunds: 0,
        discounts: 0,
        netSales: 0,
        cumulativeCash: 0,
      },
      transactions: [],
      currentBalance: 0,
      lastInspectionTime: null,
      isDailySettlementComplete: false,
      lastRolloverDate: new Date().toISOString().slice(0, 10),
      dailySettlements: [],

      ensureDailyRollover: () => {
        const today = new Date().toISOString().slice(0, 10);
        const state = get();
        if (state.lastRolloverDate !== today) {
          set(current => ({
            salesInfo: {
              ...current.salesInfo,
              startingCash:
                current.salesInfo.startingCash + current.salesInfo.totalSales,
              cumulativeCash:
                current.salesInfo.cumulativeCash + current.salesInfo.cashSales,
              totalSales: 0,
              cashSales: 0,
              cardSales: 0,
              refunds: 0,
              discounts: 0,
              netSales: 0,
            },
            transactions: [],
            isDailySettlementComplete: false,
            lastRolloverDate: today,
          }));
        }
      },

      updateCashDrawerData: data => {
        set({ cashDrawerData: data });
        get().calculateCurrentBalance();
      },

      addCashDrawerItem: item => {
        set(state => ({
          cashDrawerData: [...state.cashDrawerData, item],
        }));
        get().calculateCurrentBalance();
      },

      updateCashDrawerItem: (type, quantity) => {
        set(state => ({
          cashDrawerData: state.cashDrawerData.map(item =>
            item.type === type ? { ...item, quantity } : item
          ),
        }));
        get().calculateCurrentBalance();
      },

      addTransaction: transaction => {
        get().ensureDailyRollover();
        const newTransaction: CashTransaction = {
          ...transaction,
          id: Date.now().toString(),
          timestamp: new Date(),
        };

        set(state => {
          const updatedDrawer = [...state.cashDrawerData];
          const salesUpdate = { ...state.salesInfo };

          if (transaction.type === 'deposit') {
            // 입금 금액을 적절한 권종들로 분배
            let remainingAmount = transaction.amount;

            // 큰 단위부터 처리 (배열의 처음부터)
            for (let i = 0; i < updatedDrawer.length; i++) {
              const item = updatedDrawer[i];
              if (remainingAmount >= item.unitValue) {
                const quantity = Math.floor(remainingAmount / item.unitValue);
                item.quantity += quantity;
                remainingAmount -= quantity * item.unitValue;
              }
            }

            salesUpdate.cashSales += transaction.amount;
            salesUpdate.totalSales += transaction.amount;
            salesUpdate.netSales =
              salesUpdate.totalSales -
              salesUpdate.refunds -
              salesUpdate.discounts;
          }

          if (transaction.type === 'withdraw') {
            // 출금 금액을 적절한 권종들에서 차감
            let remainingAmount = transaction.amount;

            // 큰 단위부터 차감 (배열의 처음부터)
            for (let i = 0; i < updatedDrawer.length; i++) {
              const item = updatedDrawer[i];
              if (remainingAmount >= item.unitValue && item.quantity > 0) {
                const maxQuantity = Math.min(
                  Math.floor(remainingAmount / item.unitValue),
                  item.quantity
                );
                item.quantity -= maxQuantity;
                remainingAmount -= maxQuantity * item.unitValue;
              }
            }

            salesUpdate.cashSales -= transaction.amount;
            salesUpdate.totalSales -= transaction.amount;
            salesUpdate.netSales =
              salesUpdate.totalSales -
              salesUpdate.refunds -
              salesUpdate.discounts;
          }

          return {
            transactions: [newTransaction, ...state.transactions],
            salesInfo: salesUpdate,
            cashDrawerData: updatedDrawer,
          };
        });

        get().calculateCurrentBalance();
      },

      removeTransaction: transactionId => {
        set(state => ({
          transactions: state.transactions.filter(t => t.id !== transactionId),
        }));
      },

      updateSalesInfo: salesInfo => {
        set(state => ({
          salesInfo: { ...state.salesInfo, ...salesInfo },
        }));
      },

      resetDailySales: () => {
        set({
          salesInfo: {
            startingCash: 0,
            totalSales: 0,
            cashSales: 0,
            cardSales: 0,
            refunds: 0,
            discounts: 0,
            netSales: 0,
            cumulativeCash: 0,
          },
          transactions: [],
          isDailySettlementComplete: false,
        });
      },

      calculateCurrentBalance: () => {
        set(state => ({
          currentBalance: calcTotalFromDrawer(state.cashDrawerData),
        }));
      },

      setLastInspectionTime: time => {
        set({ lastInspectionTime: time });
      },

      setDailySettlementComplete: complete => {
        set({ isDailySettlementComplete: complete });
      },

      performDailySettlement: () => {
        const state = get();
        const today = new Date().toISOString().slice(0, 10);
        const totalCash = calcTotalFromDrawer(state.cashDrawerData);

        set({
          dailySettlements: [
            ...state.dailySettlements,
            {
              date: today,
              denominations: [...state.cashDrawerData], // 권종별 데이터 저장
              total: totalCash,
            },
          ],
          salesInfo: {
            ...state.salesInfo,
            cashSales: state.salesInfo.cashSales + totalCash,
            totalSales: 0,
            cardSales: 0,
            refunds: 0,
            discounts: 0,
            netSales: 0,
          },
          transactions: [],
          isDailySettlementComplete: true,
          cashDrawerData: state.cashDrawerData.map(item => ({
            ...item,
            quantity: 0, // 정산 후 권종별 수량 초기화 혹은 원하는 값으로 변경
          })),
        });

        get().calculateCurrentBalance();
      },

      resetCashDrawer: () => {
        set(state => ({
          cashDrawerData: state.cashDrawerData.map(item => ({
            ...item,
            quantity: 0,
          })),
          currentBalance: 0,
        }));
      },

      resetAll: () => {
        set({
          cashDrawerData: initialCashDrawerData,
          salesInfo: {
            startingCash: 0,
            totalSales: 0,
            cashSales: 0,
            cardSales: 0,
            refunds: 0,
            discounts: 0,
            netSales: 0,
            cumulativeCash: 0,
          },
          transactions: [],
          currentBalance: 0,
          lastInspectionTime: null,
          isDailySettlementComplete: false,
          lastRolloverDate: new Date().toISOString().slice(0, 10),
          dailySettlements: [],
        });
      },
    }),
    {
      name: 'cash-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({
        cashDrawerData: state.cashDrawerData,
        salesInfo: state.salesInfo,
        transactions: state.transactions,
        currentBalance: state.currentBalance,
        lastInspectionTime: state.lastInspectionTime,
        lastRolloverDate: state.lastRolloverDate,
        isDailySettlementComplete: state.isDailySettlementComplete,
        dailySettlements: state.dailySettlements,
      }),
    }
  )
);
