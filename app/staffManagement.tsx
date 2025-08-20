import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';

import { AdminProtectedRoute, StaffManagementMain } from '../components';

/**
 * 직원 관리 화면
 * - 관리자 전용 직원 관리 기능
 */
export default function StaffManagement() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <AdminProtectedRoute>
      <View className='h-full w-full bg-white flex flex-col'>
        {/* 뒤로가기 버튼 */}
        <View className='w-full box-border px-[5%] pt-16 pb-8'>
          <TouchableOpacity
            className='w-10 h-10 rounded-full bg-gray-100 justify-center items-center'
            onPress={handleGoBack}
          >
            <Ionicons name='arrow-back-outline' size={24} color='#374151' />
          </TouchableOpacity>
        </View>

        {/* 직원 관리 메인 컴포넌트 */}
        <View className='flex-1'>
          <StaffManagementMain />
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
