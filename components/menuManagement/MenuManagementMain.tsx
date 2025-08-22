import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useModal } from '../../hooks';
import { useMenuStore } from '../../stores';
import {
  MenuCategory,
  MenuFormData,
  MenuItem,
  MenuToastType,
  PendingSuccessToast,
} from '../../types';
import { MENU_CATEGORIES } from '../../types';
import { MenuToast } from '../../utils';
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
  const [pendingSuccessToast, setPendingSuccessToast] =
    useState<PendingSuccessToast | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<
    MenuCategory | 'ALL'
  >('ALL');
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const { openModal, closeModal, isModalOpen } = useModal();
  const { menus, addMenu, updateMenu } = useMenuStore();
  // 모달이 닫힌 후 성공 Toast 표시
  useEffect(() => {
    if (
      !isModalOpen('menuAdd') &&
      !isModalOpen('menuEdit') &&
      !isModalOpen('menuDelete') &&
      pendingSuccessToast
    ) {
      if (pendingSuccessToast.type === 'add') {
        MenuToast.addSuccess(
          `${pendingSuccessToast.name} 메뉴가 추가되었습니다`
        );
      } else if (pendingSuccessToast.type === 'edit') {
        MenuToast.editSuccess(
          `${pendingSuccessToast.name} 메뉴가 수정되었습니다`
        );
      } else if (pendingSuccessToast.type === 'delete') {
        MenuToast.deleteSuccess(
          `${pendingSuccessToast.name} 메뉴가 삭제되었습니다`
        );
      }
      setPendingSuccessToast(null);
    }
  }, [isModalOpen, pendingSuccessToast]);
  // 카테고리별 메뉴 필터링
  const filteredMenus =
    selectedCategory === 'ALL'
      ? menus
      : menus.filter(menu => menu.category === selectedCategory);

  // 이벤트 핸들러
  const handleAddMenu = () => {
    openModal('menuAdd');
  };

  const handleAddMenuConfirm = (menuData: MenuFormData) => {
    // 새 메뉴를 Store에 추가
    addMenu({
      name: menuData.name,
      price: menuData.price,
      category: menuData.category,
      image: menuData.image,
    });

    // 메뉴 추가 성공 Toast 표시

    setPendingSuccessToast({ type: MenuToastType.ADD, name: menuData.name });

    closeModal();
  };

  const handleEditMenu = (menu: MenuItem) => {
    setSelectedMenuItem(menu);
    openModal('menuEdit');
  };

  const handleEditMenuConfirm = (menuData: MenuFormData) => {
    if (!selectedMenuItem) return;

    // 선택된 메뉴를 Store에서 업데이트
    updateMenu(selectedMenuItem.id, {
      name: menuData.name,
      price: menuData.price,
      category: menuData.category,
      image: menuData.image,
    });

    setPendingSuccessToast({ type: MenuToastType.EDIT, name: menuData.name });

    closeModal();
    // 메뉴 편집 성공 Toast 표시
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
                  전체 ({menus.length})
                </Text>
              </TouchableOpacity>

              {/* 카테고리별 필터 */}
              {MENU_CATEGORIES.map(category => {
                const categoryCount = menus.filter(
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
