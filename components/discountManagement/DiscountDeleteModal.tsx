import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import type { Discount } from '../../types';

interface DiscountDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  discount: Discount | null;
}

/**
 * 할인 삭제 확인 모달 컴포넌트
 * - 할인 삭제 전 사용자에게 확인을 요청하는 모달
 */
export default function DiscountDeleteModal({
  visible,
  onClose,
  onConfirm,
  discount,
}: DiscountDeleteModalProps) {
  if (!discount) return null;

  const handleClose = () => {
    onClose();
  };

  const handleConfirm = () => {
    onConfirm();
  };

  // 할인 유형별 표시 텍스트
  const getDiscountTypeText = (discount: Discount) => {
    if (discount.type === 'PERCENTAGE') {
      return `${discount.value}%`;
    }
    return `${discount.value.toLocaleString()}원`;
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl w-4/5 max-w-md p-6'>
          {/* 헤더 */}
          <View className='flex-row justify-between items-center border-b border-gray-200 pb-4 mb-4'>
            <View className='flex-row items-center gap-3'>
              <Ionicons name='warning-outline' size={24} color='#EF4444' />
              <Text className='text-xl font-bold text-gray-800'>할인 삭제</Text>
            </View>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name='close' size={24} color='#6B7280' />
            </TouchableOpacity>
          </View>

          {/* 내용 */}
          <View className='mb-6'>
            <Text className='text-gray-700 text-base mb-4'>
              다음 할인을 정말로 삭제하시겠습니까?
            </Text>

            {/* 삭제할 할인 정보 */}
            <View className='bg-gray-50 rounded-lg p-4 border border-gray-200 mb-4'>
              <Text className='text-gray-800 text-lg font-semibold mb-2'>
                {discount.name}
              </Text>
              <View className='flex-row items-center gap-4 mb-2'>
                <Text className='text-blue-600 font-medium text-sm'>
                  할인값: {getDiscountTypeText(discount)}
                </Text>
                <Text className='text-blue-600 font-medium text-sm'>
                  유형:{' '}
                  {discount.type === 'PERCENTAGE'
                    ? '퍼센트 할인'
                    : '고정금액 할인'}
                </Text>
              </View>
              <View className='flex-row items-center gap-2'>
                <View
                  className={`w-2 h-2 rounded-full ${
                    discount.isActive ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <Text
                  className={`text-sm font-medium ${
                    discount.isActive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {discount.isActive ? '활성' : '비활성'}
                </Text>
              </View>
            </View>

            <Text className='text-red-600 text-sm mt-3 leading-5'>
              ⚠️ 이 작업은 되돌릴 수 없습니다. 삭제된 할인은 복구할 수 없으니
              신중히 결정해주세요.
            </Text>
          </View>

          {/* 버튼들 */}
          <View className='flex-row gap-3'>
            <Pressable
              className='flex-1 p-3 border border-gray-300 rounded-lg'
              onPress={handleClose}
            >
              <Text className='text-gray-600 text-center font-semibold'>
                취소
              </Text>
            </Pressable>

            <Pressable
              className='flex-1 p-3 bg-red-500 rounded-lg'
              onPress={handleConfirm}
            >
              <Text className='text-white text-center font-semibold'>삭제</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
