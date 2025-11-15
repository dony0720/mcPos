import { DiscountType, MenuItem, OrderItem } from '../types';

/**
 * 가격 계산 유틸리티 함수들
 */

/**
 * 온도별 추가 가격 계산
 */
export const calculateTemperaturePrice = (
  temperature?: string,
  temperatureRestriction?: string
): number => {
  if (temperature === 'ICE') {
    // ICE_ONLY 메뉴는 추가 요금 없음
    if (temperatureRestriction === 'ICE_ONLY') {
      return 0;
    }
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
  const temperaturePrice = calculateTemperaturePrice(
    item.menuItem.temperature,
    item.menuItem.temperatureRestriction
  );
  // 메뉴 기본 가격 (옵션 제외, 온도 포함)
  const menuBasePrice = item.menuItem.price + temperaturePrice;

  // 할인이 적용된 경우
  if (item.discount) {
    if (item.discount.type === DiscountType.FIXED_AMOUNT) {
      // 고정가격으로 변경 (옵션 가격은 별도 추가)
      return (item.discount.value + optionPrice) * item.quantity;
    } else if (item.discount.type === DiscountType.PERCENTAGE) {
      // 메뉴 기본 가격에만 할인 적용 (최소 0원)
      const discountedMenuPrice = Math.max(
        0,
        menuBasePrice * (1 - item.discount.value / 100)
      );
      // 할인된 메뉴 가격 + 옵션 가격
      return (discountedMenuPrice + optionPrice) * item.quantity;
    }
  }

  // 할인 없는 경우: 메뉴 기본 가격 + 옵션 가격
  return (menuBasePrice + optionPrice) * item.quantity;
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
  const temperaturePrice = calculateTemperaturePrice(
    menuItem.temperature,
    menuItem.temperatureRestriction
  );
  return menuItem.price + optionPrice + temperaturePrice;
};

/**
 * 할인이 적용된 개별 아이템의 단위 가격 계산 (수량 제외, 온도 포함)
 */
export const calculateDiscountedUnitPrice = (item: OrderItem): number => {
  const optionPrice = calculateMenuOptionPrice(item.options, item.menuItem);
  const temperaturePrice = calculateTemperaturePrice(
    item.menuItem.temperature,
    item.menuItem.temperatureRestriction
  );
  // 메뉴 기본 가격 (옵션 제외, 온도 포함)
  const menuBasePrice = item.menuItem.price + temperaturePrice;

  // 할인이 적용된 경우
  if (item.discount) {
    if (item.discount.type === DiscountType.FIXED_AMOUNT) {
      // 고정가격으로 변경 (옵션 가격은 별도 추가)
      return item.discount.value + optionPrice;
    } else if (item.discount.type === DiscountType.PERCENTAGE) {
      // 메뉴 기본 가격에만 할인 적용 (최소 0원)
      const discountedMenuPrice = Math.max(
        0,
        menuBasePrice * (1 - item.discount.value / 100)
      );
      // 할인된 메뉴 가격 + 옵션 가격
      return discountedMenuPrice + optionPrice;
    }
  }

  // 할인 없는 경우: 메뉴 기본 가격 + 옵션 가격
  return menuBasePrice + optionPrice;
};
