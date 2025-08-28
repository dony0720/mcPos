import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

import type { MenuDeleteModalProps } from '../../types';

/**
 * 메뉴 삭제 확인 모달 컴포넌트
 * - 메뉴 삭제 전 사용자 확인을 받는 모달
 */
export default function MenuDeleteModal({
  visible,
  onClose,
  onConfirm,
  menuItem,
}: MenuDeleteModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  if (!menuItem) return null;

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl w-4/5 max-w-md p-6'>
          {/* 헤더 */}
          <View className='flex-row justify-between items-center mb-4'>
            <View className='flex-row items-center gap-3'>
              <View className='w-10 h-10 bg-red-100 rounded-full items-center justify-center'>
                <Ionicons name='warning-outline' size={20} color='#EF4444' />
              </View>
              <Text className='text-xl font-bold text-gray-800'>메뉴 삭제</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name='close-outline' size={24} color='#6B7280' />
            </TouchableOpacity>
          </View>

          {/* 메시지 내용 */}
          <View className='mb-6'>
            <Text className='text-gray-700 text-base leading-6 mb-3'>
              다음 메뉴를 정말로 삭제하시겠습니까?
            </Text>

            {/* 삭제할 메뉴 정보 */}
            <View className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
              <View className='flex-row justify-between items-center mb-2'>
                <Text className='font-semibold text-gray-800 text-lg'>
                  {menuItem.name}
                </Text>
                <Text className='text-primaryGreen font-bold text-lg'>
                  {menuItem.price.toLocaleString()}원
                </Text>
              </View>
              <Text className='text-gray-500 text-sm'>
                카테고리: {menuItem.categories?.join(', ') || '없음'}
              </Text>
            </View>

            <Text className='text-red-600 text-sm mt-3 leading-5'>
              ⚠️ 이 작업은 되돌릴 수 없습니다. 삭제된 메뉴는 복구할 수 없으니
              신중히 결정해주세요.
            </Text>
          </View>

          {/* 버튼들 */}
          <View className='flex-row gap-3'>
            <Pressable
              className='flex-1 p-3 border border-gray-300 rounded-lg'
              onPress={onClose}
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
