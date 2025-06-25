import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface ActionButtonsProps {
  onClose: () => void;
  onAddToCart: () => void;
}

export default function ActionButtons({
  onClose,
  onAddToCart,
}: ActionButtonsProps) {
  return (
    <View className='flex-row gap-3 mt-4'>
      <TouchableOpacity
        onPress={onClose}
        className='flex-1 py-3 rounded-lg bg-gray-200 justify-center items-center'
      >
        <Text className='text-gray-700 font-semibold'>취소</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onAddToCart}
        className='flex-1 py-3 rounded-lg bg-primaryGreen justify-center items-center'
      >
        <Text className='text-white font-semibold'>장바구니에 추가</Text>
      </TouchableOpacity>
    </View>
  );
}
