import React, { useState } from 'react';
import { View } from 'react-native';

import { useModal } from '../../hooks';
import { MenuDetailModal, MenuItem } from './index';
import PaginationButtons from './PaginationButtons';

/**
 * 메뉴 그리드 컴포넌트
 * - 선택된 카테고리의 메뉴 아이템들을 그리드 형태로 표시
 * - 페이지네이션 및 메뉴 상세 모달 기능 포함
 */

// 메뉴 아이템 타입 정의
interface MenuItemType {
  id: number;
  name: string;
  price: string;
}

export default function MenuGrid() {
  // 메뉴 데이터 관리
  const menuItems = Array(12)
    .fill(null)
    .map((_, index) => ({
      id: index,
      name: '아메리카노',
      price: '1,500원',
    }));

  // 모달 상태 관리
  const { openModal, closeModal, isModalOpen } = useModal();
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
    null
  );

  // 이벤트 핸들러
  const handleUpPress = () => {
    console.log('Up button pressed');
  };

  const handleDownPress = () => {
    console.log('Down button pressed');
  };

  const handleMenuItemPress = (item: MenuItemType) => {
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
          {menuItems.map(item => (
            <MenuItem
              key={item.id}
              id={item.id}
              name={item.name}
              price={item.price}
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
      />
    </View>
  );
}
