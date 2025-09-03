import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

import { useCategoryStore } from '@/stores';

import type { MenuCardProps } from '../../types';

/**
 * 메뉴 카드 컴포넌트
 * - 개별 메뉴 정보를 카드 형태로 표시
 */
export default function MenuCard({ menu, onEdit, onDelete }: MenuCardProps) {
  const { categories } = useCategoryStore();
  const categoryName =
    menu.categories
      ?.map(catId => categories.find(cat => cat.id === catId)?.name)
      .filter(Boolean)
      .join(', ') || '기타';

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
          <Image
            source={{ uri: menu.image }}
            className='flex-1 w-full rounded-lg'
            resizeMode='cover'
          />
        ) : (
          <View className='flex-1 items-center justify-center'>
            <Ionicons name='image-outline' size={24} color='#9CA3AF' />
          </View>
        )}
      </View>

      {/* 메뉴 정보 */}
      <View>
        {/* 메뉴명 */}
        <View className='flex-row items-center mb-1'>
          <Text className='text-gray-900 text-base font-semibold'>
            {menu.name}
          </Text>
          {menu.temperatureRestriction && (
            <View className='ml-2 bg-gray-100 px-2 py-1 rounded'>
              <Text className='text-gray-600 text-xs font-medium'>
                {menu.temperatureRestriction === 'HOT_ONLY'
                  ? '🔥 HOT ONLY'
                  : '🧊 ICE ONLY'}
              </Text>
            </View>
          )}
        </View>

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
