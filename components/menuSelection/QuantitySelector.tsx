import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function QuantitySelector({
  quantity,
  setQuantity,
}: QuantitySelectorProps) {
  return (
    <View className='flex-row items-center gap-4'>
      <TouchableOpacity
        onPress={() => setQuantity(Math.max(1, quantity - 1))}
        className='w-10 h-10 rounded-lg bg-gray-200 justify-center items-center'
      >
        <Text className='text-lg font-semibold'>-</Text>
      </TouchableOpacity>
      <Text className='text-lg font-semibold min-w-[30px] text-center'>
        {quantity}
      </Text>
      <TouchableOpacity
        onPress={() => setQuantity(quantity + 1)}
        className='w-10 h-10 rounded-lg bg-gray-200 justify-center items-center'
      >
        <Text className='text-lg font-semibold'>+</Text>
      </TouchableOpacity>
    </View>
  );
}
