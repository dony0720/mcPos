import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { AdminProtectedRoute } from '../../components';

/**
 * 설정 화면 컴포넌트
 * - 관리자 전용 설정 화면 (메뉴, 카테고리, 할인 관리)
 * - AdminProtectedRoute로 관리자 권한 검증
 */
export default function Settings() {
  // 설정 메뉴 아이템들
  const settingMenuItems = [
    {
      id: 'menu',
      title: '메뉴 관리',
      description: '메뉴 등록, 수정, 삭제',
      icon: 'restaurant-outline' as const,
      onPress: () => {
        // TODO: 메뉴 관리 화면으로 이동
      },
    },
    {
      id: 'category',
      title: '카테고리 관리',
      description: '카테고리 추가, 수정, 삭제',
      icon: 'list-outline' as const,
      onPress: () => {
        // TODO: 카테고리 관리 화면으로 이동
      },
    },
    {
      id: 'discount',
      title: '할인 관리',
      description: '할인 정책 설정 및 관리',
      icon: 'pricetag-outline' as const,
      onPress: () => {
        // TODO: 할인 관리 화면으로 이동
      },
    },
    {
      id: 'staff',
      title: '직원 관리',
      description: '직원 등록, 권한 설정, 근무 관리',
      icon: 'people-outline' as const,
      onPress: () => {
        // TODO: 직원 관리 화면으로 이동
      },
    },
  ];

  return (
    <AdminProtectedRoute>
      <View className='h-full w-full bg-white flex flex-col'>
        <View className='flex-1 max-w-7xl mx-auto w-full'>
          {/* 헤더 섹션 */}
          <View className='w-full h-[80px] box-border px-[5%] mt-[25px] flex flex-row justify-between items-center'>
            <Text className='text-3xl font-bold text-gray-800'>설정</Text>
          </View>

          {/* 설정 컨텐츠 영역 */}
          <ScrollView className='flex-1 box-border px-[5%] py-4'>
            <View className='flex flex-col gap-5'>
              {settingMenuItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  className='bg-white border border-gray-200 rounded-xl p-6 shadow-sm active:bg-gray-50'
                  onPress={item.onPress}
                >
                  <View className='flex-row items-center'>
                    {/* 아이콘 */}
                    <View className='w-12 h-12 bg-primaryGreen rounded-full justify-center items-center mr-4'>
                      <Ionicons name={item.icon} size={24} color='white' />
                    </View>

                    {/* 텍스트 정보 */}
                    <View className='flex-1'>
                      <Text className='text-lg font-bold text-gray-800 mb-1'>
                        {item.title}
                      </Text>
                      <Text className='text-sm text-gray-500'>
                        {item.description}
                      </Text>
                    </View>

                    {/* 화살표 아이콘 */}
                    <Ionicons
                      name='chevron-forward-outline'
                      size={20}
                      color='#9CA3AF'
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* 추가 설정 섹션을 위한 여백 */}
            <View className='h-20' />
          </ScrollView>
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
