import { DiscountType, MenuItem, OrderItem } from '../types';

/**
 * 가격 계산 유틸리티 함수들
 */

/**
 * 온도별 추가 가격 계산
 */
export const calculateTemperaturePrice = (temperature?: string): number => {
  if (temperature === 'ICE') {
    return 500; // 아이스 500원 추가
  }
  return 0; // HOT은 추가 요금 없음
};

/**
 * 특정 메뉴의 선택된 옵션들의 총 가격 계산
 */
export const calculateMenuOptionPrice = (
  options: string[],
  menuItem: MenuItem
): number => {
  const availableOptions = menuItem.availableOptions || [];
  return options.reduce((sum, optionName) => {
    const option = availableOptions.find(opt => opt.name === optionName);
    return sum + (option?.price || 0);
  }, 0);
};

/**
 * 개별 주문 아이템의 총 가격 계산 (옵션, 온도 및 할인 포함)
 */
export const calculateItemPrice = (item: OrderItem): number => {
  const optionPrice = calculateMenuOptionPrice(item.options, item.menuItem);
  const temperaturePrice = calculateTemperaturePrice(item.menuItem.temperature);
  const basePrice = item.menuItem.price + optionPrice + temperaturePrice;

  // 할인이 적용된 경우
  if (item.discount) {
    if (item.discount.type === DiscountType.FIXED_AMOUNT) {
      // 고정가격으로 변경
      return item.discount.value * item.quantity;
    } else if (item.discount.type === DiscountType.PERCENTAGE) {
      // 차감 적용 (최소 0원)
      const discountedPrice = Math.max(
        0,
        basePrice * (1 - item.discount.value / 100)
      );
      return discountedPrice * item.quantity;
    }
  }

  return basePrice * item.quantity;
};

/**
 * 전체 주문의 총 금액 계산
 */
export const calculateTotalPrice = (orderItems: OrderItem[]): number => {
  return orderItems.reduce((sum, item) => sum + calculateItemPrice(item), 0);
};

/**
 * 특정 메뉴 아이템의 단위 가격 계산 (수량 제외, 온도 포함)
 */
export const calculateMenuUnitPrice = (
  menuItem: MenuItem,
  options: string[]
): number => {
  const optionPrice = calculateMenuOptionPrice(options, menuItem);
  const temperaturePrice = calculateTemperaturePrice(menuItem.temperature);
  return menuItem.price + optionPrice + temperaturePrice;
};

/**
 * 할인이 적용된 개별 아이템의 단위 가격 계산 (수량 제외, 온도 포함)
 */
export const calculateDiscountedUnitPrice = (item: OrderItem): number => {
  const optionPrice = calculateMenuOptionPrice(item.options, item.menuItem);
  const temperaturePrice = calculateTemperaturePrice(item.menuItem.temperature);
  const basePrice = item.menuItem.price + optionPrice + temperaturePrice;

  // 할인이 적용된 경우
  if (item.discount) {
    if (item.discount.type === DiscountType.FIXED_AMOUNT) {
      // 고정가격으로 변경
      return item.discount.value;
    } else if (item.discount.type === DiscountType.PERCENTAGE) {
      // 차감 적용 (최소 0원)
      return Math.max(0, basePrice * (1 - item.discount.value / 100));
    }
  }

  return basePrice;
};
