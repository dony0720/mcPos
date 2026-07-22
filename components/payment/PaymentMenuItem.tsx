import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { PaymentMenuItemProps } from '../../types';

export default function PaymentMenuItem({
  isChecked,
  onCheckboxPress,
  menuName,
  options,
  price,
}: PaymentMenuItemProps) {
  return (
    // 결제 메뉴 아이템 - 어두운 주문 요약 패널의 아이템 행 (전체 클릭 가능)
    <Pressable
      onPress={onCheckboxPress}
      className='w-full flex-row items-center justify-between py-4 border-b border-white/5'
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
      })}
    >
      <View className='flex-row items-center flex-1 gap-3 min-w-0'>
        {/* 체크박스 - 개별 아이템 선택 */}
        <View
          className={clsx(
            'w-6 h-6 rounded-full flex items-center justify-center',
            {
              'bg-primaryGreen': isChecked,
              'border border-white/25': !isChecked,
            }
          )}
        >
          {isChecked && <Ionicons name='checkmark' size={14} color='#fff' />}
        </View>

        {/* 메뉴 이름 및 옵션 */}
        <View className='flex-1 min-w-0'>
          <Text
            numberOfLines={1}
            className='text-white text-base font-pretendard-semibold'
          >
            {menuName}
          </Text>
          {options ? (
            <Text className='text-[#8b95a1] text-xs mt-1 font-pretendard'>
              {options}
            </Text>
          ) : null}
        </View>
      </View>

      {/* 가격 표시 */}
      <Text className='text-white text-base font-pretendard-semibold ml-3'>
        {price}
      </Text>
    </Pressable>
  );
}
