import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { SelectAllCheckboxProps } from '../../types';

export default function SelectAllCheckbox({
  isChecked,
  onCheckboxPress,
  onDeletePress,
  hasSelectedItems,
}: SelectAllCheckboxProps) {
  return (
    // 전체 선택 컨트롤 - 어두운 주문 요약 패널 안의 아이템 리스트 상단
    <View className='w-full flex-row items-center justify-between mb-3'>
      {/* 전체 선택 체크박스 */}
      <Pressable
        onPress={onCheckboxPress}
        className='flex-row items-center gap-2'
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : 1,
        })}
      >
        <View
          className={clsx(
            'w-5 h-5 rounded-full flex items-center justify-center',
            {
              'bg-primaryGreen': isChecked,
              'border border-white/25': !isChecked,
            }
          )}
        >
          {isChecked && <Ionicons name='checkmark' size={12} color='#fff' />}
        </View>
        <Text className='text-[#b0b8c1] text-sm font-pretendard-semibold'>
          전체 선택
        </Text>
      </Pressable>

      {/* 삭제 버튼 */}
      <Pressable
        onPress={onDeletePress}
        disabled={!hasSelectedItems}
        style={({ pressed }) => ({
          opacity: pressed ? 0.7 : hasSelectedItems ? 1 : 0.4,
        })}
      >
        <Ionicons
          name='trash-outline'
          size={18}
          color={hasSelectedItems ? '#f04452' : '#4e5968'}
        />
      </Pressable>
    </View>
  );
}
