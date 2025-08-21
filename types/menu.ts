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
  discount?: {
    id: string;
    name: string;
    value: number;
    type: 'fixed' | 'deduction';
  };
}

export interface MenuItemProps {
  id: string;
  name: string;
  price: string;
  onPress: () => void;
}

export interface MenuGridProps {
  selectedCategory: MenuCategory;
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

// 메뉴 관리 관련 타입들
export interface MenuFormData {
  name: string;
  price: number;
  category: MenuCategory;
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

// 카테고리 옵션 (관리용)
export const CATEGORY_OPTIONS: { value: MenuCategory; label: string }[] = [
  { value: 'COFFEE', label: '커피' },
  { value: 'NON_COFFEE', label: '논커피' },
  { value: 'TEA', label: '차' },
  { value: 'ADE', label: '에이드' },
  { value: 'DESSERT', label: '디저트' },
];
