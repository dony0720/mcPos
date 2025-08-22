import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { AdminProtectedRoute, DiscountManagementMain } from '../components';

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
      <View className='h-full w-full bg-white flex flex-col'>
        {/* 뒤로가기 버튼 */}
        <View className='w-full box-border px-[5%] pt-14 pb-6'>
          <TouchableOpacity
            className='w-10 h-10 rounded-full bg-gray-100 justify-center items-center'
            onPress={handleGoBack}
          >
            <Ionicons name='arrow-back-outline' size={24} color='#374151' />
          </TouchableOpacity>
        </View>

        {/* 할인 관리 메인 컴포넌트 */}
        <View className='flex-1'>
          <DiscountManagementMain />
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
