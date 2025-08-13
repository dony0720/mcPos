import { create } from 'zustand';

import type { MenuItem, OrderItem, OrderState } from '../types';
import { calculateTotalPrice } from '../utils';

export const useOrderStore = create<OrderState>(set => ({
  // 초기 상태
  orderItems: [],
  totalAmount: 0,
  itemCount: 0,

  // 메뉴 아이템 추가
  addItem: (menuItem: MenuItem, options: string[]) => {
    const newItem: OrderItem = {
      id: Date.now().toString(),
      menuItem,
      quantity: 1,
      options,
    };

    set(state => {
      const newOrderItems = [...state.orderItems, newItem];
      return {
        orderItems: newOrderItems,
        totalAmount: calculateTotalPrice(newOrderItems),
        itemCount: newOrderItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    });
  },

  // 수량 변경
  updateQuantity: (itemId: string, change: number) => {
    set(state => {
      const newOrderItems = state.orderItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      );

      return {
        orderItems: newOrderItems,
        totalAmount: calculateTotalPrice(newOrderItems),
        itemCount: newOrderItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    });
  },

  // 아이템 제거
  removeItem: (itemId: string) => {
    set(state => {
      const newOrderItems = state.orderItems.filter(item => item.id !== itemId);

      return {
        orderItems: newOrderItems,
        totalAmount: calculateTotalPrice(newOrderItems),
        itemCount: newOrderItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    });
  },

  // 주문 전체 초기화
  clearOrder: () => {
    set({
      orderItems: [],
      totalAmount: 0,
      itemCount: 0,
    });
  },
}));
