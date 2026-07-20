import { create } from 'zustand';

import { DiscountType, MenuItem, OrderItem, OrderState } from '../types';
import { calculateTotalPrice } from '../utils';

export const useOrderStore = create<OrderState>(set => ({
  // 초기 상태
  orderItems: [],
  totalAmount: 0,
  itemCount: 0,

  // 메뉴 아이템 추가
  addItem: (menuItem: MenuItem, options: string[], quantity: number = 1) => {
    set(state => {
      // 같은 메뉴+옵션+온도 조합이 있는지 확인
      const existingItemIndex = state.orderItems.findIndex(item => {
        // 메뉴 ID가 같고
        const isSameMenu = item.menuItem.id === menuItem.id;
        // 온도가 같고
        const isSameTemperature =
          item.menuItem.temperature === menuItem.temperature;
        // 할인이 없고 (할인된 항목은 별도 관리)
        const hasNoDiscount = !item.discount;
        // 옵션이 같은지 확인 (순서 무관)
        const isSameOptions =
          item.options.length === options.length &&
          item.options.every(opt => options.includes(opt)) &&
          options.every(opt => item.options.includes(opt));

        return (
          isSameMenu && isSameTemperature && hasNoDiscount && isSameOptions
        );
      });

      let newOrderItems;

      if (existingItemIndex !== -1) {
        // 기존 항목의 수량 증가
        newOrderItems = state.orderItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // 새 항목 추가
        const newItem: OrderItem = {
          id: Date.now().toString(),
          menuItem,
          quantity,
          options,
        };
        newOrderItems = [...state.orderItems, newItem];
      }

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

  // 할인 적용
  applyDiscount: (
    itemIds: string[],
    discount: {
      id: string;
      name: string;
      value: number;
      type: DiscountType;
    }
  ) => {
    set(state => {
      const newOrderItems = state.orderItems.map(item =>
        itemIds.includes(item.id) ? { ...item, discount } : item
      );

      return {
        orderItems: newOrderItems,
        totalAmount: calculateTotalPrice(newOrderItems),
        itemCount: newOrderItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    });
  },

  // 할인 제거
  removeDiscount: (itemIds: string[]) => {
    set(state => {
      const newOrderItems = state.orderItems.map(item =>
        itemIds.includes(item.id) ? { ...item, discount: undefined } : item
      );

      return {
        orderItems: newOrderItems,
        totalAmount: calculateTotalPrice(newOrderItems),
        itemCount: newOrderItems.reduce((sum, item) => sum + item.quantity, 0),
      };
    });
  },

  // 모든 할인 제거
  clearAllDiscounts: () => {
    set(state => {
      const newOrderItems = state.orderItems.map(item => ({
        ...item,
        discount: undefined,
      }));

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
