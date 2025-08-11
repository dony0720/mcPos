import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

interface OrderItemProps {
  menuName: string;
  options: string[];
  quantity: number;
  price: string;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
}

export default function OrderItem({
  menuName,
  options,
  quantity,
  price,
  onIncrease,
  onDecrease,
  onRemove,
}: OrderItemProps) {
  return (
    <View className='w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-row justify-between items-center'>
      {/* 메뉴 이름과 옵션 */}
      <View className='flex-1 pr-3'>
        <Text
          className='font-semibold text-gray-900 text-base mb-1'
          numberOfLines={1}
        >
          {menuName}
        </Text>
        {options.length > 0 && (
          <Text className='text-gray-500 text-sm' numberOfLines={1}>
            {options.join(' • ')}
          </Text>
        )}
      </View>

      {/* 수량 조절 */}
      <View className='flex flex-row items-center bg-gray-50 rounded-lg px-2 py-1'>
        <Pressable
          onPress={onDecrease}
          className='w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200'
        >
          <Ionicons name='remove' size={16} color='#374151' />
        </Pressable>

        <Text className='mx-3 font-medium text-gray-900 text-base min-w-[20px] text-center'>
          {quantity}
        </Text>

        <Pressable
          onPress={onIncrease}
          className='w-8 h-8 flex items-center justify-center rounded-md bg-white border border-gray-200'
        >
          <Ionicons name='add' size={16} color='#374151' />
        </Pressable>
      </View>

      {/* 가격과 삭제 버튼 */}
      <View className='flex flex-row items-center pl-3'>
        <Text className='font-bold text-gray-900 text-base mr-3'>{price}</Text>
        <Pressable
          onPress={onRemove}
          className='w-6 h-6 flex items-center justify-center'
        >
          <Ionicons name='close-circle' size={20} color='#EF4444' />
        </Pressable>
      </View>
    </View>
  );
}
