import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Animated, Image, Pressable, Text, View } from 'react-native';

import { useButtonAnimation } from '../../hooks';

interface PaymentMenuItemProps {
  isChecked: boolean;
  onCheckboxPress: () => void;
  menuName: string;
  options: string;
  price: string;
  onDeletePress: () => void;
}

export default function PaymentMenuItem({
  isChecked,
  onCheckboxPress,
  menuName,
  options,
  price,
  onDeletePress,
}: PaymentMenuItemProps) {
  const deleteAnimation = useButtonAnimation();

  return (
    // 결제 메뉴 아이템 섹션 - 개별 메뉴 정보 표시 및 관리
    <View className='w-full h-[120px] box-border px-5 py-4 border border-gray-300 rounded-lg flex flex-row items-center justify-between gap-6 '>
      {/* 체크박스 - 개별 아이템 선택 */}
      <Pressable onPress={onCheckboxPress}>
        <View
          className={clsx('w-6 h-6 rounded flex items-center justify-center', {
            'bg-black': isChecked,
            'bg-white border-2 border-gray-400': !isChecked,
          })}
        >
          {isChecked && <Ionicons name='checkmark' size={16} color='white' />}
        </View>
      </Pressable>

      {/* 메뉴 정보 섹션 - 이미지, 이름, 옵션 */}
      <View className='w-[70%] flex flex-row items-center gap-7 '>
        {/* 메뉴 이미지 */}
        <View className='w-[100px] h-[100px] rounded-lg overflow-hidden'>
          <Image
            source={require('../../assets/images/coffeeTest.png')}
            className='w-full h-full'
            resizeMode='cover'
          />
        </View>

        {/* 메뉴 이름 및 옵션 */}
        <View className='flex-1 gap-2'>
          <Text className='text-2xl font-medium'>{menuName}</Text>
          <Text className='text-gray-600 text-lg'>{options}</Text>
        </View>
      </View>

      {/* 가격 및 삭제 버튼 섹션 */}
      <View className='flex flex-row items-center justify-center gap-5'>
        {/* 가격 표시 */}
        <Text className='text-gray-600 text-2xl'>{price}</Text>

        {/* 삭제 버튼 - 메뉴 아이템 제거 */}
        <Pressable
          onPressIn={deleteAnimation.onPressIn}
          onPressOut={deleteAnimation.onPressOut}
          onPress={onDeletePress}
        >
          <Animated.View
            className='w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center'
            style={{
              transform: [{ scale: deleteAnimation.scaleAnim }],
            }}
          >
            <Ionicons name='trash-outline' size={24} color='#EF4444' />
          </Animated.View>
        </Pressable>
      </View>
    </View>
  );
}
