import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import type { MenuItem } from '../../types';
import { MENU_CATEGORIES } from '../../types/menu';

interface MenuCardProps {
  menu: MenuItem;
  onEdit: (menu: MenuItem) => void;
  onDelete: (menu: MenuItem) => void;
}

/**
 * 메뉴 카드 컴포넌트
 * - 개별 메뉴 정보를 카드 형태로 표시
 */
export default function MenuCard({ menu, onEdit, onDelete }: MenuCardProps) {
  const categoryName =
    MENU_CATEGORIES.find(cat => cat.id === menu.category)?.name || '기타';

  return (
    <View className='bg-white rounded-lg border border-gray-100 p-4 flex-1 relative'>
      {/* 액션 버튼들 - 오른쪽 상단 */}
      <View className='absolute top-2 right-2 flex-row gap-1'>
        <TouchableOpacity
          className='w-6 h-6 items-center justify-center'
          onPress={() => onEdit(menu)}
        >
          <Ionicons name='pencil-outline' size={14} color='#6B7280' />
        </TouchableOpacity>

        <TouchableOpacity
          className='w-6 h-6 items-center justify-center'
          onPress={() => onDelete(menu)}
        >
          <Ionicons name='trash-outline' size={14} color='#6B7280' />
        </TouchableOpacity>
      </View>

      {/* 메뉴 정보 */}
      <View className='pr-8'>
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
