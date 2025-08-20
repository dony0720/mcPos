import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import { DeleteConfirmModalProps } from '../../types/ledger';

/**
 * 장부 삭제 확인 모달
 * - 사용자에게 삭제 확인을 요청
 * - 실수로 삭제하는 것을 방지
 */
export default function DeleteConfirmModal({
  visible,
  onClose,
  onConfirm,
  item,
}: DeleteConfirmModalProps) {
  if (!item) return null;

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl p-6 w-[90%] max-w-md'>
          {/* 헤더 */}
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-xl font-bold text-red-600'>장부 삭제</Text>
            <Pressable onPress={onClose} className='p-2'>
              <Ionicons name='close' size={24} color='#666' />
            </Pressable>
          </View>

          {/* 경고 아이콘 */}
          <View className='items-center mb-4'>
            <View className='w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3'>
              <Ionicons name='warning' size={32} color='#EF4444' />
            </View>
          </View>

          {/* 메시지 */}
          <View className='mb-6'>
            <Text className='text-lg font-semibold text-gray-800 text-center mb-2'>
              정말 삭제하시겠습니까?
            </Text>
            <Text className='text-gray-600 text-center mb-4'>
              이 작업은 되돌릴 수 없습니다.
            </Text>

            {/* 삭제할 장부 정보 */}
            <View className='bg-gray-50 rounded-lg p-4'>
              <View className='flex-row justify-between mb-2'>
                <Text className='text-gray-600'>회원번호:</Text>
                <Text className='text-gray-800 font-medium'>
                  {item.memberNumber}
                </Text>
              </View>
              <View className='flex-row justify-between mb-2'>
                <Text className='text-gray-600'>이름:</Text>
                <Text className='text-gray-800 font-medium'>{item.name}</Text>
              </View>
              <View className='flex-row justify-between'>
                <Text className='text-gray-600'>현재 금액:</Text>
                <Text className='text-gray-800 font-medium'>
                  {item.chargeAmount}
                </Text>
              </View>
            </View>
          </View>

          {/* 버튼들 */}
          <View className='flex-row gap-3'>
            <Pressable
              className='flex-1 p-3 bg-gray-300 rounded-lg'
              onPress={onClose}
            >
              <Text className='text-gray-700 text-center font-semibold'>
                취소
              </Text>
            </Pressable>
            <Pressable
              className='flex-1 p-3 bg-red-500 rounded-lg'
              onPress={() => {
                onConfirm();
                onClose();
              }}
            >
              <Text className='text-white text-center font-semibold'>삭제</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
