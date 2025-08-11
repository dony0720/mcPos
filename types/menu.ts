import { BaseItem, ModalProps, Optionable, Quantifiable } from './common';

export type MenuCategory = 'COFFEE' | 'NON_COFFEE' | 'TEA' | 'ADE' | 'DESSERT';
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
}

export interface MenuItemProps {
  id: string;
  name: string;
  price: string;
  onPress: () => void;
}

export interface MenuGridProps {
  selectedCategory: MenuCategory;
  onSelectMenu: (menuItem: MenuItem, options: string[]) => void;
}

export interface MenuDetailModalProps extends ModalProps {
  menuItem: MenuItem | null;
  onConfirm?: (menuItem: MenuItem, options: string[]) => void;
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
  selectedCategory: MenuCategory;
  onSelectCategory: (category: MenuCategory) => void;
}

// 상수 데이터
export const MENU_CATEGORIES: { id: MenuCategory; name: string }[] = [
  { id: 'COFFEE', name: '커피' },
  { id: 'NON_COFFEE', name: '논커피' },
  { id: 'TEA', name: '차' },
  { id: 'ADE', name: '에이드' },
  { id: 'DESSERT', name: '디저트' },
];

export const MENU_OPTIONS: MenuOption[] = [
  { name: '샷추가', price: 500 },
  { name: '시럽추가', price: 300 },
  { name: '휘핑크림', price: 700 },
];
