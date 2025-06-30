import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import DiscountModal, { Discount } from './DiscountModal';

interface DiscountSectionProps {
  onDiscountSelect: (discount: Discount | null) => void;
  onDiscountDelete: () => void;
}

export default function DiscountSection({
  onDiscountSelect,
  onDiscountDelete,
}: DiscountSectionProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDiscountSelect = (discount: Discount) => {
    onDiscountSelect(discount);
    setIsModalVisible(false);
  };

  const handleDiscountDelete = () => {
    onDiscountSelect(null);
    onDiscountDelete();
  };

  return (
    <>
      {/* 할인 적용 섹션 - 할인 쿠폰이나 할인율 적용 */}
      <View className='w-full h-[100px] rounded-lg flex flex-row items-center justify-between border border-gray-300 my-6 box-border p-4'>
        {/* 할인 정보 표시 */}
        <View className='flex gap-2 '>
          <Text className='text-2xl '>할인 적용</Text>
          <Text className='text-gray-600'>어린이 할인 적용 (-17,000원)</Text>
        </View>

        {/* 할인 관련 버튼들 */}
        <View className='flex flex-row items-center gap-3'>
          {/* 할인 선택 버튼 - 할인 모달 열기 */}
          <Pressable
            onPress={() => setIsModalVisible(true)}
            className='w-[120px] h-[50px] rounded-lg border border-primaryGreen bg-white flex flex-row items-center justify-center gap-2'
          >
            <Ionicons name='pricetag-outline' size={18} color='#2CC56F' />
            <Text className='text-primaryGreen font-medium'>할인 선택</Text>
          </Pressable>

          {/* 할인 삭제 버튼 - 적용된 할인 제거 */}
          <Pressable
            onPress={handleDiscountDelete}
            className='w-[120px] h-[50px] rounded-lg border border-red-400 bg-white flex flex-row items-center justify-center gap-2'
          >
            <Ionicons name='close-circle-outline' size={18} color='#F87171' />
            <Text className='text-red-400 font-medium'>할인 삭제</Text>
          </Pressable>
        </View>
      </View>

      {/* 할인 선택 모달 - 사용 가능한 할인 목록 표시 */}
      <DiscountModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectDiscount={handleDiscountSelect}
      />
    </>
  );
}
