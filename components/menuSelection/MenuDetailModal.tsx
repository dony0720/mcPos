import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

import {
  MenuActionButtons,
  MenuInfoCard,
  OptionsSelector,
  TemperatureSelector,
} from './index';

/**
 * 메뉴 상세 모달 컴포넌트
 * - 선택된 메뉴의 상세 정보와 옵션 선택 기능을 제공하는 모달
 */

interface MenuDetailModalProps {
  visible: boolean;
  onClose: () => void;
  menuItem: {
    id: number;
    name: string;
    price: string;
  } | null;
}

export default function MenuDetailModal({
  visible,
  onClose,
  menuItem,
}: MenuDetailModalProps) {
  // 상태 관리
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedTemperature, setSelectedTemperature] = useState('Hot');
  const [quantity, setQuantity] = useState(1);

  // 이벤트 핸들러
  /**
   * 장바구니 추가 핸들러
   * 선택된 옵션들과 함께 장바구니에 메뉴를 추가
   */
  const handleAddToCart = () => {
    // 장바구니에 추가하는 로직
    console.log('Added to cart:', {
      item: menuItem,
      options: selectedOptions,
      temperature: selectedTemperature,
      quantity,
    });
    onClose();
  };

  if (!menuItem) return null;

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className='flex-1 w-full h-full box-border px-[10%] justify-center items-center bg-black/50 '>
        <View className='bg-white rounded-lg w-full h-[60%] box-border p-6 max-w-[600px]'>
          {/* 모달 헤더 */}
          <View className='flex-row justify-between items-center mb-4'>
            <Text className='text-xl font-bold'>메뉴 옵션 선택</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className='text-gray-500 text-lg'>✕</Text>
            </TouchableOpacity>
          </View>

          {/* 모달 콘텐츠 */}
          <ScrollView showsVerticalScrollIndicator={false} className='flex-1'>
            {/* 메뉴 정보 카드 - 이미지, 이름, 가격, 수량 선택 */}
            <MenuInfoCard
              menuItem={menuItem}
              quantity={quantity}
              setQuantity={setQuantity}
            />

            {/* 온도 선택 섹션 */}
            <TemperatureSelector
              selectedTemperature={selectedTemperature}
              setSelectedTemperature={setSelectedTemperature}
            />

            {/* 추가 옵션 선택 섹션 */}
            <OptionsSelector
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          </ScrollView>

          {/* 액션 버튼 섹션 - 취소/장바구니 추가 */}
          <MenuActionButtons onClose={onClose} onAddToCart={handleAddToCart} />
        </View>
      </View>
    </Modal>
  );
}
