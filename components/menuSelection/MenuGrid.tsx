import React, { useState } from 'react';
import { View } from 'react-native';

import { useModal } from '../../hooks';
import type { MenuGridProps, MenuItem } from '../../types';
import { MenuDetailModal, MenuItem as MenuItemComponent } from './index';
import PaginationButtons from './PaginationButtons';

// 실제 메뉴 데이터
const MENU_ITEMS: MenuItem[] = [
  // 커피 메뉴
  {
    id: 'coffee-1',
    name: '아메리카노',
    price: 4500,
    category: 'COFFEE',
  },
  {
    id: 'coffee-2',
    name: '카페라떼',
    price: 5000,
    category: 'COFFEE',
  },
  {
    id: 'coffee-3',
    name: '바닐라라떼',
    price: 5500,
    category: 'COFFEE',
  },
  {
    id: 'coffee-4',
    name: '카라멜마키아또',
    price: 5500,
    category: 'COFFEE',
  },

  // 논커피 메뉴
  {
    id: 'non-coffee-1',
    name: '초콜릿라떼',
    price: 5500,
    category: 'NON_COFFEE',
  },
  {
    id: 'non-coffee-2',
    name: '녹차라떼',
    price: 5000,
    category: 'NON_COFFEE',
  },

  // 차 메뉴
  {
    id: 'tea-1',
    name: '얼그레이',
    price: 4500,
    category: 'TEA',
  },
  {
    id: 'tea-2',
    name: '캐모마일',
    price: 4500,
    category: 'TEA',
  },

  // 에이드 메뉴
  {
    id: 'ade-1',
    name: '레몬에이드',
    price: 5500,
    category: 'ADE',
  },
  {
    id: 'ade-2',
    name: '자몽에이드',
    price: 5500,
    category: 'ADE',
  },

  // 디저트 메뉴
  {
    id: 'dessert-1',
    name: '티라미수',
    price: 6500,
    category: 'DESSERT',
  },
  {
    id: 'dessert-2',
    name: '치즈케이크',
    price: 6000,
    category: 'DESSERT',
  },
];

export default function MenuGrid({
  selectedCategory,
  onSelectMenu,
}: MenuGridProps) {
  // 현재 카테고리의 메뉴 아이템들 필터링
  const filteredMenuItems = MENU_ITEMS.filter(
    item => item.category === selectedCategory
  );

  // 모달 상태 관리
  const { openModal, closeModal, isModalOpen } = useModal();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  // 이벤트 핸들러
  const handleUpPress = () => {
    console.log('Up button pressed');
  };

  const handleDownPress = () => {
    console.log('Down button pressed');
  };

  const handleMenuItemPress = (item: MenuItem) => {
    setSelectedMenuItem(item);
    openModal('menuDetail');
  };

  const handleModalClose = () => {
    closeModal();
    setSelectedMenuItem(null);
  };

  return (
    <View className='flex flex-row w-full h-[65%] box-border px-[5%] py-[3%] items-center'>
      {/* 메뉴 그리드 섹션 */}
      <View className='flex-1 h-full'>
        <View className='flex-row flex-wrap h-full justify-between content-between'>
          {filteredMenuItems.map(item => (
            <MenuItemComponent
              key={item.id}
              id={item.id}
              name={item.name}
              price={`${item.price.toLocaleString()}원`}
              onPress={() => handleMenuItemPress(item)}
            />
          ))}
        </View>
      </View>

      {/* 페이지네이션 버튼 섹션 */}
      <PaginationButtons
        onUpPress={handleUpPress}
        onDownPress={handleDownPress}
      />

      {/* 모달 섹션 - 메뉴 상세 모달 */}
      <MenuDetailModal
        visible={isModalOpen('menuDetail')}
        onClose={handleModalClose}
        menuItem={selectedMenuItem}
        onConfirm={onSelectMenu}
      />
    </View>
  );
}
