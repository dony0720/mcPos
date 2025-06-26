import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

/**
 * 메뉴 아이템 컴포넌트
 * - 개별 메뉴 아이템을 표시하는 카드 형태의 컴포넌트
 */

// Props 인터페이스
interface MenuItemProps {
  id: number;
  name: string;
  price: string;
  onPress: () => void;
}

export default function MenuItem({ id, name, price, onPress }: MenuItemProps) {
  return (
    <View key={id} className='w-1/4 pr-3 pl-0 box-border'>
      <TouchableOpacity onPress={onPress} className='w-full'>
        <View className='w-full flex flex-col rounded-lg gap-2'>
          {/* 메뉴 이미지 섹션 */}
          <View className='overflow-hidden rounded-lg aspect-square'>
            <Image
              source={require('../../assets/images/coffeeTest.png')}
              className='w-full h-full'
              resizeMode='cover'
            />
          </View>

          {/* 메뉴 정보 섹션 */}
          <View className='px-1'>
            <Text className='font-medium text-base'>{name}</Text>
            <Text className='text-gray-600 text-sm mt-1'>{price}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}
