import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useModal } from '../../hooks';
import type { CategoryFormSchemaType } from '../../schemas';
import { useCategoryStore } from '../../stores';
import {
  Category,
  PendingSuccessToast,
  ToastActionType,
  ToastCategoryType,
} from '../../types';
import { ManagementToast } from '../../utils';
import {
  CategoryAddModal,
  CategoryCard,
  CategoryDeleteModal,
  CategoryEditModal,
} from './index';

/**
 * 카테고리 관리 메인 화면 컴포넌트
 * - 카테고리 목록 테이블과 액션 버튼들을 포함하는 메인 화면
 */
export default function CategoryManagementMain() {
  const [pendingSuccessToast, setPendingSuccessToast] =
    useState<PendingSuccessToast | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const { openModal, closeModal, isModalOpen } = useModal();
  const {
    categories,
    addCategory,

    updateCategory,

    deleteCategory: _deleteCategory,
  } = useCategoryStore();

  // 모달이 닫힌 후 성공 Toast 표시
  useEffect(() => {
    if (
      !isModalOpen('categoryAdd') &&
      !isModalOpen('categoryEdit') &&
      !isModalOpen('categoryDelete') &&
      pendingSuccessToast
    ) {
      ManagementToast.showSuccess(
        pendingSuccessToast.action,
        pendingSuccessToast.category,
        pendingSuccessToast.name
      );
      setPendingSuccessToast(null);
    }
  }, [isModalOpen, pendingSuccessToast]);

  // 표시 순서별로 정렬된 카테고리
  const sortedCategories = [...categories].sort(
    (a, b) => a.displayOrder - b.displayOrder
  );

  // 이벤트 핸들러
  const handleAddCategory = () => {
    openModal('categoryAdd');
  };

  const handleAddCategoryConfirm = (categoryData: CategoryFormSchemaType) => {
    // 새 카테고리를 Store에 추가
    addCategory({
      name: categoryData.name,
      displayOrder: categoryData.displayOrder,
    });

    // 카테고리 추가 성공 Toast 표시
    setPendingSuccessToast({
      action: ToastActionType.ADD,
      category: ToastCategoryType.CATEGORY,
      name: categoryData.name,
    });

    closeModal();
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    openModal('categoryEdit');
  };

  const handleEditCategoryConfirm = (categoryData: CategoryFormSchemaType) => {
    if (!selectedCategory) return;

    updateCategory(selectedCategory.id, {
      name: categoryData.name,
      displayOrder: categoryData.displayOrder,
    });

    setPendingSuccessToast({
      action: ToastActionType.EDIT,
      category: ToastCategoryType.CATEGORY,
      name: categoryData.name,
    });
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
    setSelectedCategory(null);
  };

  const handleDeleteCategory = (category: Category) => {
    setSelectedCategory(category);
    openModal('categoryDelete');
  };

  const handleDeleteCategoryConfirm = () => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
    setSelectedCategory(null);
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      <View className='flex-1 max-w-7xl mx-auto w-full'>
        {/* 헤더 섹션 */}
        <View className='w-full box-border px-[5%] mb-6 flex flex-row justify-between items-center'>
          {/* 페이지 제목 */}
          <Text className='text-3xl font-bold text-gray-800'>
            카테고리 관리
          </Text>

          {/* 카테고리 추가 버튼 */}
          <TouchableOpacity
            className='bg-primaryGreen rounded-lg px-6 py-3 flex-row items-center'
            onPress={handleAddCategory}
          >
            <Ionicons name='add-outline' size={20} color='white' />
            <Text className='text-white font-bold ml-2'>카테고리 추가</Text>
          </TouchableOpacity>
        </View>

        {/* 카테고리 카드 그리드 섹션 */}
        <View className='flex-1 box-border px-[5%]'>
          <ScrollView showsVerticalScrollIndicator={false}>
            {sortedCategories.length > 0 ? (
              <View className='pb-4'>
                {Array.from(
                  { length: Math.ceil(sortedCategories.length / 3) },
                  (_, rowIndex) => (
                    <View key={rowIndex} className='flex-row gap-4 mb-4'>
                      {sortedCategories
                        .slice(rowIndex * 3, (rowIndex + 1) * 3)
                        .map(category => (
                          <CategoryCard
                            key={category.id}
                            category={category}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteCategory}
                          />
                        ))}
                      {/* 빈 공간 채우기 (3개 미만인 경우) */}
                      {Array.from(
                        {
                          length:
                            3 -
                            sortedCategories.slice(
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
                <Ionicons name='list-outline' size={48} color='#9CA3AF' />
                <Text className='text-gray-500 mt-4 text-base text-center'>
                  등록된 카테고리가 없습니다
                </Text>
                <Text className='text-gray-400 mt-1 text-sm text-center'>
                  카테고리 추가 버튼을 눌러 새로운 카테고리를 등록해보세요
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

      {/* 카테고리 편집 모달 */}
      <CategoryEditModal
        visible={isModalOpen('categoryEdit')}
        onClose={() => {
          closeModal();
          setSelectedCategory(null);
        }}
        onConfirm={handleEditCategoryConfirm}
        category={selectedCategory}
      />

      {/* 카테고리 삭제 확인 모달 */}
      <CategoryDeleteModal
        visible={isModalOpen('categoryDelete')}
        onClose={() => {
          closeModal();
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteCategoryConfirm}
        category={selectedCategory}
      />
    </View>
  );
}
