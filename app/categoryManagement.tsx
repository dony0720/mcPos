import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AdminProtectedRoute, CategoryManagementMain } from '../components';

/**
 * 카테고리 관리 페이지
 * - 관리자 전용 카테고리 관리 화면
 */
export default function CategoryManagementPage() {
  const handleGoBack = () => {
    router.back();
  };

  return (
    <AdminProtectedRoute>
      <View className='flex-1 bg-white'>
        {/* 상단 네비게이션 바 */}
        <View className='flex-row items-center justify-between px-4 pt-12 pb-6 border-b border-gray-200 bg-white'>
          <TouchableOpacity
            onPress={handleGoBack}
            className='flex-row items-center gap-2'
          >
            <Ionicons name='chevron-back' size={24} color='#374151' />
            <Text className='text-lg font-semibold text-gray-700'>뒤로</Text>
          </TouchableOpacity>

          <Text className='text-xl font-bold text-gray-800'>카테고리 관리</Text>

          {/* 빈 공간 (중앙 정렬을 위한 placeholder) */}
          <View className='w-16' />
        </View>

        {/* 카테고리 관리 메인 컨텐츠 */}
        <View className='flex-1'>
          <CategoryManagementMain />
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
