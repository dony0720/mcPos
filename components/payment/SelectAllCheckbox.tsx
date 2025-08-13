import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import { useButtonAnimation } from '../../hooks';
import { SelectAllCheckboxProps } from '../../types';

export default function SelectAllCheckbox({
  isChecked,
  onCheckboxPress,
  onDeletePress,
  hasSelectedItems,
  title = '결제 정보',
}: SelectAllCheckboxProps) {
  const deleteAnimation = useButtonAnimation();
  return (
    // 전체 선택 체크박스 섹션 - 모든 메뉴 아이템 선택/해제 및 페이지 제목
    <View className='w-full px-[5%] box-border mt-6'>
      <View className='flex flex-row justify-between items-center'>
        {/* 페이지 제목 */}
        <Text className='text-2xl font-medium mb-6'>{title}</Text>

        {/* 전체 선택 체크박스와 삭제 버튼 */}
        <View className='flex flex-row items-center gap-4'>
          {/* 전체 선택 체크박스 */}
          <Pressable
            onPress={onCheckboxPress}
            className='flex flex-row items-center gap-2'
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <View
              className={clsx(
                'w-6 h-6 rounded flex items-center justify-center',
                {
                  'bg-black': isChecked,
                  'bg-white border-2 border-gray-400': !isChecked,
                }
              )}
            >
              {isChecked && (
                <Ionicons name='checkmark' size={16} color='white' />
              )}
            </View>
            <Text className='text-gray-600 text-xl'>전체 선택</Text>
          </Pressable>

          {/* 삭제 버튼 */}
          <Pressable
            onPressIn={deleteAnimation.onPressIn}
            onPressOut={deleteAnimation.onPressOut}
            onPress={onDeletePress}
          >
            <Animated.View
              className='w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center'
              style={{
                transform: [{ scale: deleteAnimation.scaleAnim }],
              }}
            >
              <Ionicons name='trash-outline' size={20} color='#EF4444' />
            </Animated.View>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
