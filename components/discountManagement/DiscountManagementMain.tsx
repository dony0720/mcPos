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

        {/* 할인 테이블 섹션 */}
        <View className='flex-1 box-border px-[5%]'>
          {/* 테이블 헤더 */}
          <View className='bg-gray-50 rounded-t-lg p-3 flex-row items-center'>
            <Text className='flex-1 font-bold text-gray-700'>할인명</Text>
            <Text className='w-20 font-bold text-gray-700 text-center'>
              할인값
            </Text>
            <Text className='w-24 font-bold text-gray-700 text-center'>
              상태
            </Text>
            <Text className='w-24 font-bold text-gray-700 text-center'>
              액션
            </Text>
          </View>

          {/* 할인 목록 */}
          <ScrollView className='bg-white border-l border-r border-b border-gray-200 rounded-b-lg'>
            {sortedDiscounts.length > 0 ? (
              sortedDiscounts.map((discount, index) => {
                const isLastItem = index === sortedDiscounts.length - 1;

                return (
                  <View
                    key={discount.id}
                    className={clsx(
                      'flex-row items-center p-3',
                      !isLastItem && 'border-b border-gray-100'
                    )}
                  >
                    {/* 할인명 */}
                    <View className='flex-1'>
                      <Text className='text-gray-800 text-base font-medium'>
                        {discount.name}
                      </Text>
                      {discount.description && (
                        <Text className='text-xs text-gray-500 mt-1'>
                          {discount.description}
                        </Text>
                      )}
                    </View>

                    {/* 할인값 */}
                    <View className='w-20 items-center'>
                      <Text className='text-primaryGreen font-semibold text-sm'>
                        {getDiscountTypeText(discount)}
                      </Text>
                    </View>

                    {/* 상태 */}
                    <View className='w-24 items-center'>
                      <TouchableOpacity
                        className={clsx(
                          'px-2 py-1 rounded-full',
                          discount.isActive ? 'bg-green-100' : 'bg-gray-100'
                        )}
                        onPress={() => handleToggleActive(discount)}
                      >
                        <Text
                          className={clsx(
                            'text-xs font-medium',
                            discount.isActive
                              ? 'text-green-700'
                              : 'text-gray-500'
                          )}
                        >
                          {discount.isActive ? '활성' : '비활성'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* 액션 버튼들 */}
                    <View className='w-24 flex-row items-center justify-center gap-2'>
                      {/* 편집 버튼 */}
                      <TouchableOpacity
                        className='w-8 h-8 rounded-full bg-blue-100 items-center justify-center'
                        onPress={() => handleEditDiscount(discount)}
                      >
                        <Ionicons
                          name='pencil-outline'
                          size={14}
                          color='#3B82F6'
                        />
                      </TouchableOpacity>

                      {/* 삭제 버튼 */}
                      <TouchableOpacity
                        className='w-8 h-8 rounded-full bg-red-100 items-center justify-center'
                        onPress={() => handleDeleteDiscount(discount)}
                      >
                        <Ionicons
                          name='trash-outline'
                          size={14}
                          color='#EF4444'
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
            ) : (
              <View className='p-6 items-center justify-center'>
                <Ionicons name='pricetag-outline' size={40} color='#9CA3AF' />
                <Text className='text-gray-500 mt-3 text-sm'>
                  등록된 할인이 없습니다.
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
