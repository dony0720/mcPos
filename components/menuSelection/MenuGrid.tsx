import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import { MENU_ITEMS } from '../../data/menuItems';
import { useModal } from '../../hooks';
import type { MenuGridProps, MenuItem } from '../../types';
import { MenuDetailModal, MenuItem as MenuItemComponent } from './index';
import PaginationButtons from './PaginationButtons';

export default function MenuGrid({
  selectedCategory,
  onAddItem,
}: MenuGridProps) {
  // 현재 카테고리의 메뉴 아이템들 필터링
  const filteredMenuItems = MENU_ITEMS.filter(
    item => item.category === selectedCategory
  );

  // 페이지네이션 상태 관리
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 6; // 3x2 그리드
  const totalPages = Math.ceil(filteredMenuItems.length / itemsPerPage);

  // 현재 페이지의 아이템들
  const currentItems = filteredMenuItems.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  // 카테고리 변경 시 페이지 리셋
  useEffect(() => {
    setCurrentPage(0);
  }, [selectedCategory]);

  // 모달 상태 관리
  const { openModal, closeModal, isModalOpen } = useModal();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );

  // 페이지네이션 핸들러
  const handleUpPress = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDownPress = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
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
    <View className='flex flex-row w-full flex-[13] box-border px-[5%] py-[3%] items-center'>
      {/* 메뉴 그리드 섹션 - 3x2 레이아웃 */}
      <View className='flex-1 h-full'>
        <View className='h-full flex flex-col justify-between'>
          {/* 첫 번째 행 (3개) */}
          <View className='flex-row h-[48%] gap-5'>
            {currentItems.slice(0, 3).map(item => (
              <View key={item.id} className='w-[30%]'>
                <MenuItemComponent
                  id={item.id}
                  name={item.name}
                  price={`${item.price.toLocaleString()}원`}
                  onPress={() => handleMenuItemPress(item)}
                />
              </View>
            ))}
          </View>

          {/* 두 번째 행 (3개) */}
          <View className='flex-row h-[48%] gap-5'>
            {currentItems.slice(3, 6).map(item => (
              <View key={item.id} className='w-[30%]'>
                <MenuItemComponent
                  id={item.id}
                  name={item.name}
                  price={`${item.price.toLocaleString()}원`}
                  onPress={() => handleMenuItemPress(item)}
                />
              </View>
            ))}
          </View>
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
        onAddItem={onAddItem}
      />
    </View>
  );
}
