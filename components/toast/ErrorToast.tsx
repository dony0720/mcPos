import React from 'react';
import { Text, View } from 'react-native';

interface ErrorToastProps {
  text1?: string;
  text2?: string;
}

/**
 * 에러 Toast 컴포넌트
 * - 빨간색 배경에 X 마크 아이콘
 * - 오류나 실패를 알리는 Toast
 */
export default function ErrorToast({ text1, text2 }: ErrorToastProps) {
  return (
    <View className='bg-red-500 mx-4 p-4 rounded-lg flex-row items-center shadow-lg z-50'>
      <View className='bg-white rounded-full p-1 mr-3'>
        <Text className='text-red-500 text-lg font-bold'>❌</Text>
      </View>
      <View className='flex-1'>
        <Text className='text-white font-semibold text-base'>
          {text1 || ''}
        </Text>
        {text2 && <Text className='text-white/90 text-sm mt-1'>{text2}</Text>}
      </View>
    </View>
  );
}
