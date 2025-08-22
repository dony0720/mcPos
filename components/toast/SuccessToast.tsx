import React from 'react';
import { Text, View } from 'react-native';

interface SuccessToastProps {
  text1?: string;
  text2?: string;
}

/**
 * 성공 Toast 컴포넌트
 * - 초록색 배경에 체크마크 아이콘
 * - 성공적인 작업 완료를 알리는 Toast
 */
export default function SuccessToast({ text1, text2 }: SuccessToastProps) {
  return (
    <View className='bg-green-500 mx-4 p-4 rounded-lg flex-row items-center shadow-lg'>
      <View className='bg-white rounded-full p-1 mr-3'>
        <Text className='text-green-500 text-lg font-bold'>✅</Text>
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
