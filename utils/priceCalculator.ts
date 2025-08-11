import type { OrderItem } from '../types';
import { MENU_OPTIONS } from '../types';

/**
 * 가격 계산 유틸리티 함수들
 */

/**
 * 선택된 옵션들의 총 가격 계산
 */
export const calculateOptionPrice = (options: string[]): number => {
  return options.reduce((sum, optionName) => {
    const option = MENU_OPTIONS.find(opt => opt.name === optionName);
    return sum + (option?.price || 0);
  }, 0);
};

/**
 * 개별 주문 아이템의 총 가격 계산 (옵션 포함)
 */
export const calculateItemPrice = (item: OrderItem): number => {
  const optionPrice = calculateOptionPrice(item.options);
  return (item.menuItem.price + optionPrice) * item.quantity;
};

/**
 * 전체 주문의 총 금액 계산
 */
export const calculateTotalPrice = (orderItems: OrderItem[]): number => {
  return orderItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
};

/**
 * 개별 아이템의 단위 가격 계산 (수량 제외)
 */
export const calculateUnitPrice = (
  menuPrice: number,
  options: string[]
): number => {
  const optionPrice = calculateOptionPrice(options);
  return menuPrice + optionPrice;
};
