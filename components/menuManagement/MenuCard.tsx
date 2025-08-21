import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { MenuCardProps } from '../../types';
import { MENU_CATEGORIES } from '../../types';

/**
 * 메뉴 카드 컴포넌트
 * - 개별 메뉴 정보를 카드 형태로 표시
 */
export default function MenuCard({ menu, onEdit, onDelete }: MenuCardProps) {
  const categoryName =
    MENU_CATEGORIES.find(cat => cat.id === menu.category)?.name || '기타';

  return (
    <View className='bg-white rounded-lg border border-gray-100 p-4 flex-1 relative'>
      {/* 이미지 영역 */}
      <View className='w-full aspect-square bg-gray-100 rounded-lg mb-3 items-center justify-center relative'>
        {/* 액션 버튼들 - 이미지 영역 우상단 */}
        <View className='absolute top-2 right-2 flex-row gap-1 z-10'>
          <TouchableOpacity
            className='w-6 h-6 bg-white rounded-full items-center justify-center shadow-sm'
            onPress={() => onEdit(menu)}
          >
            <Ionicons name='pencil-outline' size={14} color='#6B7280' />
          </TouchableOpacity>

          <TouchableOpacity
            className='w-6 h-6 bg-white rounded-full items-center justify-center shadow-sm'
            onPress={() => onDelete(menu)}
          >
            <Ionicons name='trash-outline' size={14} color='#6B7280' />
          </TouchableOpacity>
        </View>

        {menu.image ? (
          <View className='items-center justify-center'>
            <Ionicons name='image' size={24} color='#10B981' />
          </View>
        ) : (
          <View className='items-center justify-center'>
            <Ionicons name='image-outline' size={24} color='#9CA3AF' />
          </View>
        )}
      </View>

      {/* 메뉴 정보 */}
      <View>
        {/* 메뉴명 */}
        <Text className='text-gray-900 text-base font-semibold mb-1'>
          {menu.name}
        </Text>

        {/* 카테고리 */}
        <Text className='text-gray-500 text-sm mb-3'>{categoryName}</Text>

        {/* 가격 */}
        <Text className='text-primaryGreen text-lg font-bold'>
          {menu.price.toLocaleString()}원
        </Text>
      </View>
    </View>
  );
}
