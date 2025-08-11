import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * 액션 버튼 컴포넌트
 * - 메뉴 상세 모달에서 취소/장바구니 추가 버튼을 렌더링
 */

// Props 인터페이스
interface ActionButtonsProps {
  onClose: () => void;
  onAddToCart: () => void;
  totalPrice: number;
}

export default function ActionButtons({
  onClose,
  onAddToCart,
  totalPrice,
}: ActionButtonsProps) {
  return (
    <View className='flex-row gap-3 mt-4'>
      {/* 취소 버튼 */}
      <TouchableOpacity
        onPress={onClose}
        className='flex-1 py-3 rounded-lg bg-gray-200 justify-center items-center'
      >
        <Text className='text-gray-700 font-semibold'>취소</Text>
      </TouchableOpacity>

      {/* 장바구니 추가 버튼 */}
      <TouchableOpacity
        onPress={onAddToCart}
        className='flex-1 py-3 rounded-lg bg-primaryGreen justify-center items-center'
      >
        <Text className='text-white font-semibold'>
          {totalPrice.toLocaleString()}원 장바구니에 추가
        </Text>
      </TouchableOpacity>
    </View>
  );
}
