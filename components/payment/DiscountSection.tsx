import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { useModal } from '../../hooks';
import { Discount, DiscountSectionProps } from '../../types';
import DiscountModal from './DiscountModal';

export default function DiscountSection({
  onDiscountSelect,
  onDiscountDelete,
  hasSelectedItems = false,
}: DiscountSectionProps & { hasSelectedItems?: boolean }) {
  const { openModal, closeModal, isModalOpen } = useModal();

  const handleDiscountSelect = (discount: Discount) => {
    onDiscountSelect(discount);
    closeModal();
  };

  const handleDiscountDelete = () => {
    onDiscountSelect(null);
    onDiscountDelete();
  };

  return (
    <>
      {/* 할인 적용 섹션 - 할인 쿠폰이나 할인율 적용 */}
      <View className='w-full rounded-2xl flex-row items-center justify-between border border-gray-200 mt-6 p-4'>
        {/* 할인 정보 표시 */}
        <View className='gap-1'>
          <Text className='text-base font-pretendard-bold text-[#191f28]'>
            할인 적용
          </Text>
          <Text className='text-[#8b95a1] text-xs font-pretendard'>
            {hasSelectedItems
              ? '선택된 메뉴에 할인을 적용할 수 있습니다'
              : '할인을 적용하려면 메뉴를 선택하세요'}
          </Text>
        </View>

        {/* 할인 관련 버튼들 */}
        <View className='flex-row items-center gap-3'>
          {/* 할인 선택 버튼 - 할인 모달 열기 */}
          <Pressable
            onPress={() => hasSelectedItems && openModal('discount')}
            disabled={!hasSelectedItems}
            className={clsx(
              'h-11 px-4 rounded-xl border flex-row items-center justify-center gap-2',
              {
                'border-primaryGreen bg-white': hasSelectedItems,
                'border-gray-200 bg-gray-100': !hasSelectedItems,
              }
            )}
          >
            <Ionicons
              name='pricetag-outline'
              size={16}
              color={hasSelectedItems ? '#03b26c' : '#9CA3AF'}
            />
            <Text
              className={clsx('text-sm font-pretendard-semibold', {
                'text-primaryGreen': hasSelectedItems,
                'text-gray-400': !hasSelectedItems,
              })}
            >
              할인 선택
            </Text>
          </Pressable>

          {/* 할인 삭제 버튼 - 적용된 할인 제거 */}
          <Pressable
            onPress={() => hasSelectedItems && handleDiscountDelete()}
            disabled={!hasSelectedItems}
            className={clsx(
              'h-11 px-4 rounded-xl border flex-row items-center justify-center gap-2',
              {
                'border-red-300 bg-white': hasSelectedItems,
                'border-gray-200 bg-gray-100': !hasSelectedItems,
              }
            )}
          >
            <Ionicons
              name='close-circle-outline'
              size={16}
              color={hasSelectedItems ? '#F87171' : '#9CA3AF'}
            />
            <Text
              className={clsx('text-sm font-pretendard-semibold', {
                'text-red-400': hasSelectedItems,
                'text-gray-400': !hasSelectedItems,
              })}
            >
              할인 삭제
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 할인 선택 모달 - 사용 가능한 할인 목록 표시 */}
      <DiscountModal
        visible={isModalOpen('discount')}
        onClose={closeModal}
        onSelectDiscount={handleDiscountSelect}
      />
    </>
  );
}
