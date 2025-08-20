import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { DISCOUNTS } from '../../data/discounts';
import { useModal } from '../../hooks';
import type { DiscountFormSchemaType } from '../../schemas';
import type { Discount } from '../../types';
import {
  DiscountAddModal,
  DiscountCard,
  DiscountDeleteModal,
  DiscountEditModal,
} from './index';

/**
 * 할인 관리 메인 화면 컴포넌트
 * - 할인 목록 테이블과 액션 버튼들을 포함하는 메인 화면
 */
export default function DiscountManagementMain() {
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const { openModal, closeModal, isModalOpen } = useModal();

  // 활성화 상태별로 정렬된 할인 (활성화된 것 먼저)
  const sortedDiscounts = [...DISCOUNTS].sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return a.name.localeCompare(b.name);
  });

  // 할인 유형별 표시 텍스트
  const getDiscountTypeText = (discount: Discount) => {
    if (discount.type === 'PERCENTAGE') {
      return `${discount.value}%`;
    }
    return `${discount.value.toLocaleString()}원`;
  };

  // 이벤트 핸들러
  const handleAddDiscount = () => {
    openModal('discountAdd');
  };

  const handleAddDiscountConfirm = (_discountData: DiscountFormSchemaType) => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
  };

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    openModal('discountEdit');
  };

  const handleEditDiscountConfirm = (_discountData: DiscountFormSchemaType) => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
    setSelectedDiscount(null);
  };

  const handleDeleteDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    openModal('discountDelete');
  };

  const handleDeleteDiscountConfirm = () => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
    setSelectedDiscount(null);
  };

  const handleToggleActive = (_discount: Discount) => {
    // 퍼블리싱 단계 - 기능 구현 없이 아무 동작 안 함
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      <View className='flex-1 max-w-7xl mx-auto w-full'>
        {/* 헤더 섹션 */}
        <View className='w-full box-border px-[5%] mb-6 flex flex-row justify-between items-center'>
          {/* 페이지 제목 */}
          <Text className='text-3xl font-bold text-gray-800'>할인 관리</Text>

          {/* 할인 추가 버튼 */}
          <TouchableOpacity
            className='bg-primaryGreen rounded-lg px-6 py-3 flex-row items-center'
            onPress={handleAddDiscount}
          >
            <Ionicons name='add-outline' size={20} color='white' />
            <Text className='text-white font-bold ml-2'>할인 추가</Text>
          </TouchableOpacity>
        </View>

        {/* 할인 카드 그리드 섹션 */}
        <View className='flex-1 box-border px-[5%]'>
          <ScrollView showsVerticalScrollIndicator={false}>
            {sortedDiscounts.length > 0 ? (
              <View className='pb-4'>
                {Array.from(
                  { length: Math.ceil(sortedDiscounts.length / 3) },
                  (_, rowIndex) => (
                    <View key={rowIndex} className='flex-row gap-4 mb-4'>
                      {sortedDiscounts
                        .slice(rowIndex * 3, (rowIndex + 1) * 3)
                        .map(discount => (
                          <DiscountCard
                            key={discount.id}
                            discount={discount}
                            onEdit={handleEditDiscount}
                            onDelete={handleDeleteDiscount}
                            onToggleActive={handleToggleActive}
                          />
                        ))}
                      {/* 빈 공간 채우기 (3개 미만인 경우) */}
                      {Array.from(
                        {
                          length:
                            3 -
                            sortedDiscounts.slice(
                              rowIndex * 3,
                              (rowIndex + 1) * 3
                            ).length,
                        },
                        (_, emptyIndex) => (
                          <View
                            key={`empty-${emptyIndex}`}
                            className='flex-1'
                          />
                        )
                      )}
                    </View>
                  )
                )}
              </View>
            ) : (
              <View className='p-8 items-center justify-center'>
                <Ionicons name='pricetag-outline' size={48} color='#9CA3AF' />
                <Text className='text-gray-500 mt-4 text-base text-center'>
                  등록된 할인이 없습니다
                </Text>
                <Text className='text-gray-400 mt-1 text-sm text-center'>
                  할인 추가 버튼을 눌러 새로운 할인을 등록해보세요
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* 하단 여백 */}
        <View className='h-16' />
      </View>

      {/* 할인 추가 모달 */}
      <DiscountAddModal
        visible={isModalOpen('discountAdd')}
        onClose={closeModal}
        onConfirm={handleAddDiscountConfirm}
      />

      {/* 할인 편집 모달 */}
      <DiscountEditModal
        visible={isModalOpen('discountEdit')}
        onClose={() => {
          closeModal();
          setSelectedDiscount(null);
        }}
        onConfirm={handleEditDiscountConfirm}
        discount={selectedDiscount}
      />

      {/* 할인 삭제 확인 모달 */}
      <DiscountDeleteModal
        visible={isModalOpen('discountDelete')}
        onClose={() => {
          closeModal();
          setSelectedDiscount(null);
        }}
        onConfirm={handleDeleteDiscountConfirm}
        discount={selectedDiscount}
      />
    </View>
  );
}
