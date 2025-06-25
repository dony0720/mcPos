import React, { useState } from 'react';
import { View } from 'react-native';

import MenuDetailModal from './MenuDetailModal';
import MenuItem from './MenuItem';
import PaginationButtons from './menuSelction';

interface MenuItemType {
  id: number;
  name: string;
  price: string;
}

export default function MenuGrid() {
  // 임시 메뉴 데이터
  const menuItems = Array(12)
    .fill(null)
    .map((_, index) => ({
      id: index,
      name: '아메리카노',
      price: '1,500원',
    }));

  // 모달 상태 관리
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItemType | null>(
    null
  );

  const handleUpPress = () => {
    // 위쪽 페이지네이션 로직
    console.log('Up button pressed');
  };

  const handleDownPress = () => {
    // 아래쪽 페이지네이션 로직
    console.log('Down button pressed');
  };

  const handleMenuItemPress = (item: MenuItemType) => {
    setSelectedMenuItem(item);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedMenuItem(null);
  };
  return (
    <View className='flex flex-row w-full h-[65%] box-border px-[5%] py-[3%] items-center'>
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
      {/* 페이지네이션 버튼 */}
      <PaginationButtons
        onUpPress={handleUpPress}
        onDownPress={handleDownPress}
      />

      {/* 메뉴 상세 모달 */}
      <MenuDetailModal
        visible={modalVisible}
        onClose={handleModalClose}
        menuItem={selectedMenuItem}
      />
    </View>
  );
}
