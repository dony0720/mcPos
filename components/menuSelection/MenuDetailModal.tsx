import React, { useEffect, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

/**
 * 메뉴 상세 모달 컴포넌트
 * - 선택된 메뉴의 상세 정보와 옵션 선택 기능을 제공하는 모달
 */
import type { MenuDetailModalProps, Temperature } from '../../types';
import {
  calculateMenuOptionPrice,
  calculateTemperaturePrice,
} from '../../utils';
import {
  MenuActionButtons,
  MenuInfoCard,
  OptionsSelector,
  TemperatureSelector,
} from './index';

export default function MenuDetailModal({
  visible,
  onClose,
  menuItem,
  onAddItem,
}: MenuDetailModalProps) {
  // 상태 관리
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedTemperature, setSelectedTemperature] =
    useState<Temperature>('HOT');
  const [quantity, setQuantity] = useState(1);

  // 선택된 옵션들의 총 가격 계산 (유틸리티 함수 사용)
  const optionPrice = menuItem
    ? calculateMenuOptionPrice(selectedOptions, menuItem)
    : 0;

  // 온도별 추가 가격 계산
  const temperaturePrice = calculateTemperaturePrice(selectedTemperature);

  const totalPrice = menuItem
    ? (menuItem.price + optionPrice + temperaturePrice) * quantity
    : 0;

  // 모달이 열릴 때마다 상태 초기화
  useEffect(() => {
    if (visible && menuItem) {
      setSelectedOptions([]);
      setQuantity(1);

      // 온도 제한에 따른 초기 온도 설정
      if (menuItem.temperatureRestriction === 'ICE_ONLY') {
        setSelectedTemperature('ICE');
      } else if (menuItem.temperatureRestriction === 'HOT_ONLY') {
        setSelectedTemperature('HOT');
      } else {
        // 제한이 없는 경우 기본값은 HOT
        setSelectedTemperature('HOT');
      }
    }
  }, [visible, menuItem]);

  // 이벤트 핸들러
  /**
   * 장바구니 추가 핸들러
   * 선택된 옵션들과 수량과 함께 장바구니에 메뉴를 추가
   */
  const handleAddToCart = () => {
    if (menuItem && onAddItem) {
      onAddItem(
        {
          ...menuItem,
          temperature: selectedTemperature,
        },
        selectedOptions,
        quantity
      );
    }
    onClose();
  };

  if (!menuItem) return null;

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
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
              temperatureRestriction={menuItem?.temperatureRestriction}
            />

            {/* 추가 옵션 선택 섹션 */}
            <OptionsSelector
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
              menuItem={menuItem}
            />
          </ScrollView>

          {/* 액션 버튼 섹션 - 취소/장바구니 추가 */}
          <MenuActionButtons
            onClose={onClose}
            onAddToCart={handleAddToCart}
            totalPrice={totalPrice}
          />
        </View>
      </View>
    </Modal>
  );
}
