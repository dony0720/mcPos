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
    <View className='w-full bg-white rounded-lg p-3 flex flex-row justify-between items-center'>
      {/* 메뉴 이름과 옵션 */}
      <View className='w-[50%] box-border p-2'>
        <Text className='font-medium text-xl '>{menuName}</Text>
        <Text className='text-gray-600 text-lg'>{options.join(' / ')}</Text>
      </View>
      {/* 수량 증가, 감소 */}
      <View className='w-[25%] flex flex-row items-center justify-around gap-2'>
        <Pressable
          onPress={onDecrease}
          className='flex items-center justify-center'
        >
          <Ionicons name='remove' size={30} color='black' />
        </Pressable>
        <Text className='text-center font-medium text-2xl'>{quantity}</Text>
        <Pressable
          onPress={onIncrease}
          className='flex items-center justify-center'
        >
          <Ionicons name='add' size={30} color='black' />
        </Pressable>
      </View>
      {/* 가격 */}
      <View className='w-[25%] flex flex-row items-center justify-center gap-2'>
        <Text className='text-xl font-bold'>{price}</Text>
        <Pressable onPress={onRemove} className='ml-2'>
          <Ionicons name='close' size={24} color='#666' />
        </Pressable>
      </View>
    </View>
  );
}
