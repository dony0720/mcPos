import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * 수량 선택자 컴포넌트
 * - 메뉴 아이템의 수량을 증가/감소시킬 수 있는 컨트롤
 */

// Props 인터페이스
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
      {/* 수량 감소 버튼 */}
      <TouchableOpacity
        onPress={() => setQuantity(Math.max(1, quantity - 1))}
        className='w-10 h-10 rounded-lg bg-gray-200 justify-center items-center'
      >
        <Text className='text-lg font-semibold'>-</Text>
      </TouchableOpacity>

      {/* 현재 수량 표시 */}
      <Text className='text-lg font-semibold min-w-[30px] text-center'>
        {quantity}
      </Text>

      {/* 수량 증가 버튼 */}
      <TouchableOpacity
        onPress={() => setQuantity(quantity + 1)}
        className='w-10 h-10 rounded-lg bg-gray-200 justify-center items-center'
      >
        <Text className='text-lg font-semibold'>+</Text>
      </TouchableOpacity>
    </View>
  );
}
