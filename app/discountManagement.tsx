import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { AdminProtectedRoute } from '../components';

/**
 * 할인 관리 페이지
 * - 관리자 전용 할인 관리 화면
 */
export default function DiscountManagementPage() {
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

          <Text className='text-xl font-bold text-gray-800'>할인 관리</Text>

          {/* 빈 공간 (중앙 정렬을 위한 placeholder) */}
          <View className='w-16' />
        </View>

        {/* 할인 관리 메인 컨텐츠 */}
        <View className='flex-1'>
          {/* TODO: DiscountManagementMain 컴포넌트 추가 예정 */}
          <View className='flex-1 items-center justify-center'>
            <Ionicons name='pricetag-outline' size={64} color='#D1D5DB' />
            <Text className='text-gray-500 mt-4 text-lg'>
              할인 관리 기능 준비 중
            </Text>
          </View>
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
