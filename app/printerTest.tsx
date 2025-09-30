/**
 * 프린터 테스트 화면
 * - Sewoo SLK-TS100 프린터 테스트 전용 페이지
 * - 개발자 및 관리자용 프린터 연결/출력 테스트
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, View } from 'react-native';

import PrinterTestScreen from '../components/printer/PrinterTestScreen';
import { AdminProtectedRoute } from '../components';

export default function PrinterTest() {
  const router = useRouter();

  return (
    <AdminProtectedRoute>
      <View className='h-full w-full bg-white flex flex-col'>
        {/* 헤더 */}
        <View className='w-full h-[80px] box-border px-[5%] mt-[25px] flex flex-row justify-between items-center border-b border-gray-200'>
          {/* 뒤로가기 버튼 */}
          <Pressable
            onPress={() => router.back()}
            className='p-2 rounded-lg bg-gray-100 active:bg-gray-200'
          >
            <Ionicons name='arrow-back' size={24} color='#374151' />
          </Pressable>
        </View>

        {/* 프린터 테스트 화면 */}
        <View className='flex-1'>
          <PrinterTestScreen />
        </View>
      </View>
    </AdminProtectedRoute>
  );
}