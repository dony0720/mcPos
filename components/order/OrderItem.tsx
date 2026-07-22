import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { OrderItemProps } from '../../types';

export default function OrderItem({
  menuName,
  options,
  quantity,
  price,
  discount,
  originalPrice,
  onIncrease,
  onDecrease,
  onRemove,
}: OrderItemProps) {
  return (
    <View className='w-full flex flex-row items-center py-4 border-b border-gray-50'>
      {/* 메뉴 이름과 옵션 */}
      <View className='flex-1 pr-3'>
        <View className='flex-row items-center mb-1 flex-wrap'>
          <Text
            className='font-pretendard-bold text-gray-900 text-base mr-2'
            numberOfLines={1}
          >
            {menuName}
          </Text>
          {discount && (
            <View className='bg-primaryGreen/10 px-2 py-1 rounded-md'>
              <Text className='text-primaryGreen text-xs font-pretendard-semibold'>
                {discount.name}
              </Text>
            </View>
          )}
        </View>

        {options.length > 0 && (
          <Text className='text-gray-400 text-sm' numberOfLines={1}>
            {options.join(' • ')}
          </Text>
        )}
      </View>

      {/* 수량 조절 */}
      <View className='flex flex-row items-center gap-2'>
        <Pressable
          onPress={onDecrease}
          className='w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100'
        >
          <Ionicons name='remove' size={16} color='#4e5968' />
        </Pressable>

        <Text className='min-w-[20px] font-pretendard-bold text-gray-900 text-base text-center'>
          {quantity}
        </Text>

        <Pressable
          onPress={onIncrease}
          className='w-8 h-8 flex items-center justify-center rounded-lg bg-primaryGreen/10'
        >
          <Ionicons name='add' size={16} color='#03b26c' />
        </Pressable>
      </View>

      {/* 가격과 삭제 버튼 */}
      <View className='flex flex-row items-center pl-3'>
        <View className='flex-col items-end mr-2 min-w-[70px]'>
          {discount && originalPrice ? (
            <>
              <Text className='text-gray-400 text-xs line-through'>
                {originalPrice}
              </Text>
              <Text className='font-pretendard-bold text-primaryGreen text-base'>
                {price}
              </Text>
            </>
          ) : (
            <Text className='font-pretendard-bold text-gray-900 text-base'>
              {price}
            </Text>
          )}
        </View>
        <Pressable
          onPress={onRemove}
          className='w-6 h-6 flex items-center justify-center'
        >
          <Ionicons name='close-circle' size={18} color='#c1c9d2' />
        </Pressable>
      </View>
    </View>
  );
}
