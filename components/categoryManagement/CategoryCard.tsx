import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { Category } from '../../types';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

/**
 * 카테고리 카드 컴포넌트
 * - 개별 카테고리 정보를 카드 형태로 표시
 */
export default function CategoryCard({
  category,
  onEdit,
  onDelete,
}: CategoryCardProps) {
  return (
    <View className='bg-white rounded-lg border border-gray-100 p-4 flex-1 relative'>
      {/* 액션 버튼들 - 오른쪽 상단 */}
      <View className='absolute top-2 right-2 flex-row gap-1'>
        <TouchableOpacity
          className='w-6 h-6 items-center justify-center'
          onPress={() => onEdit(category)}
        >
          <Ionicons name='pencil-outline' size={14} color='#6B7280' />
        </TouchableOpacity>

        <TouchableOpacity
          className='w-6 h-6 items-center justify-center'
          onPress={() => onDelete(category)}
        >
          <Ionicons name='trash-outline' size={14} color='#6B7280' />
        </TouchableOpacity>
      </View>

      {/* 카테고리 정보 */}
      <View className='pr-8'>
        {/* 카테고리명 */}
        <Text className='text-gray-900 text-base font-semibold mb-1'>
          {category.name}
        </Text>

        {/* 표시순서 */}
        <Text className='text-gray-500 text-sm mb-3'>
          표시순서: {category.displayOrder}
        </Text>

        {/* 메뉴 개수 */}
        <Text className='text-primaryGreen text-lg font-bold'>
          {category.menuCount}개 메뉴
        </Text>
      </View>
    </View>
  );
}
