import { MenuItem, OrderItem } from './menu';

// 주문 섹션 Props 타입
export interface OrderSectionProps {
  items: OrderItem[];
  totalAmount: number;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
}

// 개별 주문 아이템 Props 타입
export interface OrderItemProps {
  menuName: string;
  options: string[];
  quantity: number;
  price: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

// 주문 관련 액션들
export interface OrderStoreActions {
  addItem: (menuItem: MenuItem, options: string[]) => void;
  updateQuantity: (itemId: string, change: number) => void;
  removeItem: (itemId: string) => void;
  clearOrder: () => void;
}

// 주문 상태
export interface OrderState extends OrderStoreActions {
  orderItems: OrderItem[];
  totalAmount: number;
  itemCount: number;
}
