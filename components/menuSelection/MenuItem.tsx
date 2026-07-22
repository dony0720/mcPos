import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

/**
 * 메뉴 아이템 컴포넌트
 * - 개별 메뉴 아이템을 표시하는 카드 형태의 컴포넌트
 */
import type { MenuItemProps } from '../../types';

export default function MenuItem({
  id,
  name,
  price,
  image,
  onPress,
}: MenuItemProps) {
  return (
    <View key={id} className='w-full box-border'>
      <TouchableOpacity onPress={onPress} className='w-full'>
        <View className='w-full flex flex-col bg-white rounded-[18px] p-3 gap-[10px]'>
          {/* 메뉴 아이콘 섹션 */}
          <View className='bg-[#f0faf6] rounded-xl aspect-square flex items-center justify-center overflow-hidden'>
            {image ? (
              <Image
                source={{ uri: image }}
                className='w-full h-full'
                resizeMode='cover'
              />
            ) : (
              <Text className='text-4xl'>☕</Text>
            )}
          </View>

          {/* 메뉴 정보 섹션 */}
          <View className='px-1'>
            <Text className='font-pretendard-bold text-lg text-gray-900'>
              {name}
            </Text>
            <Text className='font-pretendard-semibold text-gray-600 text-base mt-1'>
              {price}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
