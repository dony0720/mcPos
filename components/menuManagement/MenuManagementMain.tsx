import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { MENU_ITEMS } from '../../data/menuItems';
import { useModal } from '../../hooks';
import type { MenuFormData } from '../../schemas';
import type { MenuCategory, MenuItem } from '../../types';
import { MENU_CATEGORIES } from '../../types/menu';
import {
  MenuAddModal,
  MenuCard,
  MenuDeleteModal,
  MenuEditModal,
} from './index';

/**
 * 메뉴 관리 메인 화면 컴포넌트
 * - 메뉴 목록 테이블과 액션 버튼들을 포함하는 메인 화면
 */
export default function MenuManagementMain() {
  const [selectedCategory, setSelectedCategory] = useState<
    MenuCategory | 'ALL'
  >('ALL');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const { openModal, closeModal, isModalOpen } = useModal();

  // 카테고리별 메뉴 필터링
  const filteredMenus =
    selectedCategory === 'ALL'
      ? MENU_ITEMS
      : MENU_ITEMS.filter(menu => menu.category === selectedCategory);

  // 이벤트 핸들러
  const handleAddMenu = () => {
    openModal('menuAdd');
  };

  const handleAddMenuConfirm = (_menuData: MenuFormData) => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
  };

  const handleEditMenu = (menu: MenuItem) => {
    setSelectedMenuItem(menu);
    openModal('menuEdit');
  };

  const handleEditMenuConfirm = (_menuData: MenuFormData) => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
    setSelectedMenuItem(null);
  };

  const handleDeleteMenu = (menu: MenuItem) => {
    setSelectedMenuItem(menu);
    openModal('menuDelete');
  };

  const handleDeleteMenuConfirm = () => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
    setSelectedMenuItem(null);
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      <View className='flex-1 max-w-7xl mx-auto w-full'>
        {/* 헤더 섹션 */}
        <View className='w-full box-border px-[5%] mb-6 flex flex-row justify-between items-center'>
          {/* 페이지 제목 */}
          <Text className='text-3xl font-bold text-gray-800'>메뉴 관리</Text>

          {/* 메뉴 추가 버튼 */}
          <TouchableOpacity
            className='bg-primaryGreen rounded-lg px-6 py-3 flex-row items-center'
            onPress={handleAddMenu}
          >
            <Ionicons name='add-outline' size={20} color='white' />
            <Text className='text-white font-bold ml-2'>메뉴 추가</Text>
          </TouchableOpacity>
        </View>

        {/* 카테고리 필터 섹션 */}
        <View className='w-full box-border px-[5%] mb-6'>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className='flex-row gap-3'>
              {/* 전체 카테고리 */}
              <TouchableOpacity
                className={clsx(
                  'px-4 py-2 rounded-full',
                  selectedCategory === 'ALL' ? 'bg-primaryGreen' : 'bg-gray-100'
                )}
                onPress={() => setSelectedCategory('ALL')}
              >
                <Text
                  className={clsx(
                    'font-medium',
                    selectedCategory === 'ALL' ? 'text-white' : 'text-gray-600'
                  )}
                >
                  전체 ({MENU_ITEMS.length})
                </Text>
              </TouchableOpacity>

              {/* 카테고리별 필터 */}
              {MENU_CATEGORIES.map(category => {
                const categoryCount = MENU_ITEMS.filter(
                  item => item.category === category.id
                ).length;

                return (
                  <TouchableOpacity
                    key={category.id}
                    className={clsx(
                      'px-4 py-2 rounded-full',
                      selectedCategory === category.id
                        ? 'bg-primaryGreen'
                        : 'bg-gray-100'
                    )}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text
                      className={clsx(
                        'font-medium',
                        selectedCategory === category.id
                          ? 'text-white'
                          : 'text-gray-600'
                      )}
                    >
                      {category.name} ({categoryCount})
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>

        {/* 메뉴 카드 그리드 섹션 */}
        <View className='flex-1 box-border px-[5%]'>
          <ScrollView showsVerticalScrollIndicator={false}>
            {filteredMenus.length > 0 ? (
              <View className='pb-4'>
                {Array.from(
                  { length: Math.ceil(filteredMenus.length / 3) },
                  (_, rowIndex) => (
                    <View key={rowIndex} className='flex-row gap-4 mb-4'>
                      {filteredMenus
                        .slice(rowIndex * 3, (rowIndex + 1) * 3)
                        .map(menu => (
                          <MenuCard
                            key={menu.id}
                            menu={menu}
                            onEdit={handleEditMenu}
                            onDelete={handleDeleteMenu}
                          />
                        ))}
                      {/* 빈 공간 채우기 (3개 미만인 경우) */}
                      {Array.from(
                        {
                          length:
                            3 -
                            filteredMenus.slice(
                              rowIndex * 3,
                              (rowIndex + 1) * 3
                            ).length,
                        },
                        (_, emptyIndex) => (
                          <View
                            key={`empty-${emptyIndex}`}
                            className='flex-1'
                          />
                        )
                      )}
                    </View>
                  )
                )}
              </View>
            ) : (
              <View className='p-8 items-center justify-center'>
                <Ionicons name='restaurant-outline' size={48} color='#9CA3AF' />
                <Text className='text-gray-500 mt-4 text-base text-center'>
                  해당 카테고리에 메뉴가 없습니다
                </Text>
                <Text className='text-gray-400 mt-1 text-sm text-center'>
                  메뉴 추가 버튼을 눌러 새로운 메뉴를 등록해보세요
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* 하단 여백 */}
        <View className='h-16' />
      </View>

      {/* 메뉴 추가 모달 */}
      <MenuAddModal
        visible={isModalOpen('menuAdd')}
        onClose={closeModal}
        onConfirm={handleAddMenuConfirm}
      />

      {/* 메뉴 편집 모달 */}
      <MenuEditModal
        visible={isModalOpen('menuEdit')}
        onClose={() => {
          closeModal();
          setSelectedMenuItem(null);
        }}
        onConfirm={handleEditMenuConfirm}
        menuItem={selectedMenuItem}
      />

      {/* 메뉴 삭제 확인 모달 */}
      <MenuDeleteModal
        visible={isModalOpen('menuDelete')}
        onClose={() => {
          closeModal();
          setSelectedMenuItem(null);
        }}
        onConfirm={handleDeleteMenuConfirm}
        menuItem={selectedMenuItem}
      />
    </View>
  );
}
