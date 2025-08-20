import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { CATEGORIES } from '../../data/categories';
import { useModal } from '../../hooks';
import type { CategoryFormSchemaType } from '../../schemas/categorySchema';
import type { Category } from '../../types';
import CategoryAddModal from './CategoryAddModal';

/**
 * 카테고리 관리 메인 화면 컴포넌트
 * - 카테고리 목록 테이블과 액션 버튼들을 포함하는 메인 화면
 */
export default function CategoryManagementMain() {
  const [_selectedCategory, _setSelectedCategory] = useState<Category | null>(
    null
  );
  const { openModal, closeModal, isModalOpen } = useModal();

  // 표시 순서별로 정렬된 카테고리
  const sortedCategories = [...CATEGORIES].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  // 이벤트 핸들러
  const handleAddCategory = () => {
    openModal('categoryAdd');
  };

  const handleAddCategoryConfirm = (_categoryData: CategoryFormSchemaType) => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
  };

  const _handleEditCategory = (_category: Category) => {
    // _setSelectedCategory(category);
    // openModal('categoryEdit');
  };

  const _handleEditCategoryConfirm = (
    _categoryData: CategoryFormSchemaType
  ) => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    // closeModal();
    // _setSelectedCategory(null);
  };

  const _handleDeleteCategory = (_category: Category) => {
    // _setSelectedCategory(category);
    // openModal('categoryDelete');
  };

  const _handleDeleteCategoryConfirm = () => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    // closeModal();
    // _setSelectedCategory(null);
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      <View className='flex-1 max-w-7xl mx-auto w-full'>
        {/* 헤더 섹션 */}
        <View className='w-full box-border px-[5%] my-7 flex flex-row justify-between items-center'>
          <Text className='text-3xl font-bold text-gray-800'>
            카테고리 관리
          </Text>
          <TouchableOpacity
            className='bg-primaryGreen rounded-lg px-4 py-2 flex-row items-center gap-2'
            onPress={handleAddCategory}
          >
            <Ionicons name='add-circle-outline' size={20} color='white' />
            <Text className='text-white text-base font-semibold'>
              카테고리 추가
            </Text>
          </TouchableOpacity>
        </View>

        {/* 카테고리 테이블 섹션 */}
        <View className='flex-[0.9] box-border px-[5%]'>
          {/* 테이블 헤더 */}
          <View className='bg-gray-50 rounded-t-lg p-3 flex-row items-center'>
            <Text className='flex-1 font-bold text-gray-700'>카테고리명</Text>
            <Text className='w-20 font-bold text-gray-700 text-center'>
              표시순서
            </Text>
            <Text className='w-20 font-bold text-gray-700 text-center'>
              메뉴개수
            </Text>
            <Text className='w-24 font-bold text-gray-700 text-center'>
              액션
            </Text>
          </View>

          {/* 카테고리 목록 */}
          <ScrollView className='bg-white border-l border-r border-b border-gray-200 rounded-b-lg'>
            {sortedCategories.length > 0 ? (
              sortedCategories.map((category, index) => {
                const isLastItem = index === sortedCategories.length - 1;
                const isDefaultCategory = category.isDefault;

                return (
                  <View
                    key={category.id}
                    className={clsx(
                      'flex-row items-center p-3',
                      !isLastItem && 'border-b border-gray-100'
                    )}
                  >
                    {/* 카테고리명 */}
                    <View className='flex-1'>
                      <Text className='text-gray-800 text-base font-medium'>
                        {category.name}
                      </Text>
                      {isDefaultCategory && (
                        <Text className='text-xs text-blue-600 mt-1'>
                          기본 카테고리
                        </Text>
                      )}
                    </View>

                    {/* 표시순서 */}
                    <View className='w-20 items-center'>
                      <Text className='text-gray-600 text-sm'>
                        {category.displayOrder}
                      </Text>
                    </View>

                    {/* 메뉴개수 */}
                    <View className='w-20 items-center'>
                      <Text className='text-gray-600 text-sm'>
                        {category.menuCount || 0}개
                      </Text>
                    </View>

                    {/* 액션 버튼들 */}
                    <View className='w-24 flex-row items-center justify-center gap-2'>
                      {/* 편집 버튼 */}
                      <TouchableOpacity
                        className='w-8 h-8 rounded-full bg-blue-100 items-center justify-center'
                        onPress={() => _handleEditCategory(category)}
                      >
                        <Ionicons
                          name='pencil-outline'
                          size={14}
                          color='#3B82F6'
                        />
                      </TouchableOpacity>

                      {/* 삭제 버튼 - 기본 카테고리는 비활성화 */}
                      <TouchableOpacity
                        className={clsx(
                          'w-8 h-8 rounded-full items-center justify-center',
                          isDefaultCategory ? 'bg-gray-100' : 'bg-red-100'
                        )}
                        onPress={() =>
                          !isDefaultCategory && _handleDeleteCategory(category)
                        }
                        disabled={isDefaultCategory}
                      >
                        <Ionicons
                          name='trash-outline'
                          size={14}
                          color={isDefaultCategory ? '#9CA3AF' : '#EF4444'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className='p-6 items-center justify-center'>
                <Ionicons name='list-outline' size={40} color='#9CA3AF' />
                <Text className='text-gray-500 mt-3 text-sm'>
                  등록된 카테고리가 없습니다.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* 하단 여백 */}
        <View className='h-16' />
      </View>

      {/* 카테고리 추가 모달 */}
      <CategoryAddModal
        visible={isModalOpen('categoryAdd')}
        onClose={closeModal}
        onConfirm={handleAddCategoryConfirm}
      />

      {/* TODO: 카테고리 편집 모달 */}
      {/* TODO: 카테고리 삭제 확인 모달 */}
    </View>
  );
}
