import React, { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { useModal } from '../../hooks';
import { useMenuStore } from '../../stores';
import type { MenuGridProps, MenuItem } from '../../types';
import { MenuDetailModal, MenuItem as MenuItemComponent } from './index';

export default function MenuGrid({
  selectedCategory,
  onAddItem,
}: MenuGridProps) {
  const { menus } = useMenuStore();

  // 현재 카테고리의 메뉴 아이템들 필터링 (다중 카테고리 지원)
  const filteredMenuItems =
    selectedCategory === 'ALL'
      ? menus
      : menus.filter(menu => menu.categories?.includes(selectedCategory));

  // 모달 상태 관리
  const { openModal, closeModal, isModalOpen } = useModal();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  const handleMenuItemPress = (item: MenuItem) => {
    setSelectedMenuItem(item);
    openModal('menuDetail');
  };

  const handleModalClose = () => {
    closeModal();
    setSelectedMenuItem(null);
  };

  return (
    <View className='h-full w-full box-border px-[5%] py-[3%]'>
      {/* 메뉴 그리드 섹션 - 3열 스크롤뷰 */}
      <ScrollView
        className='flex-1'
        showsVerticalScrollIndicator={false}
        contentContainerClassName='flex-row flex-wrap gap-4'
      >
        {filteredMenuItems.map(item => (
          <View key={item.id} className='w-[23%]'>
            <MenuItemComponent
              id={item.id}
              name={item.name}
              price={`${item.price.toLocaleString()}원`}
              image={item.image}
              onPress={() => handleMenuItemPress(item)}
            />
          </View>
        ))}
      </ScrollView>

      {/* 모달 섹션 - 메뉴 상세 모달 */}
      <MenuDetailModal
        visible={isModalOpen('menuDetail')}
        onClose={handleModalClose}
        menuItem={selectedMenuItem}
        onAddItem={onAddItem}
      />
    </View>
  );
}
