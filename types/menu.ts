import { BaseItem, ModalProps, Optionable, Quantifiable } from './common';
import { DiscountType } from './enums';

export type MenuCategory = string;
export type Temperature = 'HOT' | 'ICE';

export interface MenuOption {
  name: string;
  price: number;
}

export interface MenuItem extends BaseItem {
  category: MenuCategory;
  temperature?: Temperature;
  description?: string;
  image?: any;
}

export interface OrderItem extends Quantifiable, Optionable {
  id: string;
  menuItem: MenuItem;
  discount?: {
    id: string;
    name: string;
    value: number;
    type: DiscountType;
  };
}

export interface MenuItemProps {
  id: string;
  name: string;
  price: string;
  onPress: () => void;
}

export interface MenuGridProps {
  selectedCategory: string;
  onAddItem: (menuItem: MenuItem, options: string[]) => void;
}

export interface MenuDetailModalProps extends ModalProps {
  menuItem: MenuItem | null;
  onAddItem?: (menuItem: MenuItem, options: string[]) => void;
}

export interface MenuInfoCardProps {
  menuItem: MenuItem;
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export interface TemperatureSelectorProps {
  selectedTemperature: Temperature;
  setSelectedTemperature: (temperature: Temperature) => void;
}

export interface CategoryTabsProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export const MENU_OPTIONS: MenuOption[] = [
  { name: '샷추가', price: 500 },
  { name: '시럽추가', price: 300 },
  { name: '휘핑크림', price: 700 },
];

// 메뉴 관리 관련 타입들
export interface MenuFormData {
  name: string;
  price: number;
  category: string;
  image?: string;
}

// 메뉴 관리 모달 Props
export interface MenuAddModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (menuData: MenuFormData) => void;
}

export interface MenuEditModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (menuData: MenuFormData) => void;
  menuItem: MenuItem | null;
}

export interface MenuDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  menuItem: MenuItem | null;
}

// 메뉴 카드 Props
export interface MenuCardProps {
  menu: MenuItem;
  onEdit: (menu: MenuItem) => void;
  onDelete: (menu: MenuItem) => void;
}
