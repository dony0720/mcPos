import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { SelectAllCheckboxProps } from '../../types';

export default function SelectAllCheckbox({
  isChecked,
  onCheckboxPress,
  title = '결제 정보',
}: SelectAllCheckboxProps) {
  return (
    // 전체 선택 체크박스 섹션 - 모든 메뉴 아이템 선택/해제 및 페이지 제목
    <View className='w-full px-6 box-border mt-6'>
      <View className='flex flex-row justify-between items-center'>
        {/* 페이지 제목 */}
        <Text className='text-3xl font-medium mb-6'>{title}</Text>

        {/* 전체 선택 체크박스 */}
        <View className='flex flex-row items-center gap-2'>
          <Pressable onPress={onCheckboxPress}>
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
          </Pressable>
          <Text className='text-gray-600 text-2xl'>전체 선택</Text>
        </View>
      </View>
    </View>
  );
}
