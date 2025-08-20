import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { MENU_ITEMS } from '../../data/menuItems';
import { useModal } from '../../hooks';
import type { MenuFormData } from '../../schemas/menuSchema';
import type { MenuCategory, MenuItem } from '../../types';
import { MENU_CATEGORIES } from '../../types/menu';
import { MenuAddModal, MenuDeleteModal, MenuEditModal } from './index';

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
        <View className='w-full box-border px-[5%] my-7 flex flex-row justify-between items-center'>
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
        <View className='w-full box-border px-[5%] mb-7'>
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

        {/* 메뉴 테이블 섹션 */}
        <View className='flex-[0.9] box-border px-[5%]'>
          {/* 테이블 헤더 */}
          <View className='bg-gray-50 rounded-t-lg p-3 flex-row items-center'>
            <Text className='flex-1 font-bold text-gray-700'>메뉴명</Text>
            <Text className='w-20 font-bold text-gray-700 text-center'>
              가격
            </Text>
            <Text className='w-20 font-bold text-gray-700 text-center'>
              카테고리
            </Text>
            <Text className='w-24 font-bold text-gray-700 text-center'>
              액션
            </Text>
          </View>

          {/* 메뉴 목록 */}
          <ScrollView className='bg-white border-l border-r border-b border-gray-200 rounded-b-lg'>
            {filteredMenus.length > 0 ? (
              filteredMenus.map((menu, index) => {
                const categoryName =
                  MENU_CATEGORIES.find(cat => cat.id === menu.category)?.name ||
                  menu.category;

                return (
                  <View
                    key={menu.id}
                    className={clsx(
                      'p-3 flex-row items-center',
                      index !== filteredMenus.length - 1 &&
                        'border-b border-gray-100'
                    )}
                  >
                    {/* 메뉴명 */}
                    <Text className='flex-1 text-gray-800 font-medium text-sm'>
                      {menu.name}
                    </Text>

                    {/* 가격 */}
                    <Text className='w-20 text-center text-gray-600 text-sm'>
                      {menu.price.toLocaleString()}원
                    </Text>

                    {/* 카테고리 */}
                    <Text className='w-20 text-center text-gray-600 text-xs'>
                      {categoryName}
                    </Text>

                    {/* 액션 버튼들 */}
                    <View className='w-24 flex-row justify-center gap-1'>
                      {/* 편집 버튼 */}
                      <TouchableOpacity
                        className='p-1.5'
                        onPress={() => handleEditMenu(menu)}
                      >
                        <Ionicons
                          name='pencil-outline'
                          size={16}
                          color='#6B7280'
                        />
                      </TouchableOpacity>

                      {/* 삭제 버튼 */}
                      <TouchableOpacity
                        className='p-1.5'
                        onPress={() => handleDeleteMenu(menu)}
                      >
                        <Ionicons
                          name='trash-outline'
                          size={16}
                          color='#EF4444'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className='p-6 items-center'>
                <Ionicons name='restaurant-outline' size={40} color='#D1D5DB' />
                <Text className='text-gray-500 mt-2 text-sm'>
                  해당 카테고리에 메뉴가 없습니다
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
