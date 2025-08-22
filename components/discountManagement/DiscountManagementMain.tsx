import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useModal } from '../../hooks';
import type { DiscountFormSchemaType } from '../../schemas';
import { useDiscountStore } from '../../stores';
import {
  Discount,
  PendingSuccessToast,
  ToastActionType,
  ToastCategoryType,
} from '../../types';
import { DiscountType } from '../../types/';
import { ManagementToast } from '../../utils';
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
  const [pendingSuccessToast, setPendingSuccessToast] =
    useState<PendingSuccessToast | null>(null);
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(
    null
  );
  const { openModal, closeModal, isModalOpen } = useModal();
  const { discounts, addDiscount, updateDiscount, deleteDiscount } =
    useDiscountStore();

  // 모달이 닫힌 후 성공 Toast 표시
  useEffect(() => {
    if (
      !isModalOpen('discountAdd') &&
      !isModalOpen('discountEdit') &&
      !isModalOpen('discountDelete') &&
      pendingSuccessToast
    ) {
      ManagementToast.showSuccess(
        pendingSuccessToast.action,
        pendingSuccessToast.category,
        pendingSuccessToast.name
      );
      setPendingSuccessToast(null);
    }
  }, [isModalOpen, pendingSuccessToast]);

  // 활성화 상태별로 정렬된 할인 (활성화된 것 먼저)
  const sortedDiscounts = [...discounts].sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return a.name.localeCompare(b.name);
  });

  // 할인 유형별 표시 텍스트
  const _getDiscountTypeText = (discount: Discount) => {
    if (discount.type === DiscountType.PERCENTAGE) {
      return `${discount.value}%`;
    }
    return `${discount.value.toLocaleString()}원`;
  };

  // 이벤트 핸들러
  const handleAddDiscount = () => {
    openModal('discountAdd');
  };

  const handleAddDiscountConfirm = (discountData: DiscountFormSchemaType) => {
    // 새 할인을 Store에 추가
    addDiscount(discountData);

    // 할인 추가 성공 Toast 표시
    setPendingSuccessToast({
      action: ToastActionType.ADD,
      category: ToastCategoryType.DISCOUNT,
      name: discountData.name,
    });

    closeModal();
  };

  const handleEditDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    openModal('discountEdit');
  };

  const handleEditDiscountConfirm = (discountData: DiscountFormSchemaType) => {
    if (!selectedDiscount) return;

    // 선택된 할인을 Store에서 업데이트
    updateDiscount(selectedDiscount.id, discountData);

    // 할인 수정 성공 Toast 표시
    setPendingSuccessToast({
      action: ToastActionType.EDIT,
      category: ToastCategoryType.DISCOUNT,
      name: discountData.name,
    });

    closeModal();
    setSelectedDiscount(null);
  };

  const handleDeleteDiscount = (discount: Discount) => {
    setSelectedDiscount(discount);
    openModal('discountDelete');
  };

  const handleDeleteDiscountConfirm = () => {
    if (!selectedDiscount) return;

    // 할인 삭제
    deleteDiscount(selectedDiscount.id);

    // 할인 삭제 성공 Toast 표시
    setPendingSuccessToast({
      action: ToastActionType.DELETE,
      category: ToastCategoryType.DISCOUNT,
      name: selectedDiscount.name,
    });

    closeModal();
    setSelectedDiscount(null);
  };

  const handleToggleActive = (discount: Discount) => {
    // 할인 활성화 상태 토글
    updateDiscount(discount.id, {
      isActive: !discount.isActive,
    });
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
