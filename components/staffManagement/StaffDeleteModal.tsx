import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import type { Staff } from '../../types';

interface StaffDeleteModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  staff: Staff | null;
}

/**
 * 직원 삭제 확인 모달 컴포넌트
 * - 직원 삭제를 확인하는 모달
 */
export default function StaffDeleteModal({
  visible,
  onClose,
  onConfirm,
  staff,
}: StaffDeleteModalProps) {
  if (!staff) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl w-4/5 max-w-md p-6'>
          {/* 경고 아이콘 */}
          <View className='items-center mb-6'>
            <View className='w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4'>
              <Ionicons name='warning-outline' size={32} color='#EF4444' />
            </View>
            <Text className='text-xl font-bold text-gray-800 text-center'>
              직원 삭제
            </Text>
            <Text className='text-gray-500 text-center mt-2'>
              정말로 삭제하시겠습니까?
            </Text>
          </View>

          {/* 삭제할 직원 정보 */}
          <View className='bg-gray-50 rounded-lg p-4 mb-6'>
            <View className='items-center'>
              <Text className='text-lg font-semibold text-gray-800'>
                {staff.name}
              </Text>
              <Text className='text-sm text-gray-500 mt-1'>{staff.phone}</Text>
            </View>
          </View>

          {/* 경고 메시지 */}
          <View className='bg-red-50 border border-red-200 rounded-lg p-4 mb-6'>
            <View className='flex-row items-start'>
              <Ionicons
                name='alert-circle-outline'
                size={20}
                color='#EF4444'
                className='mr-2 mt-0.5'
              />
              <View className='flex-1 ml-2'>
                <Text className='text-red-800 text-sm font-medium'>
                  주의사항
                </Text>
                <Text className='text-red-700 text-sm mt-1'>
                  삭제된 직원 정보는 복구할 수 없습니다.
                </Text>
              </View>
            </View>
          </View>

          {/* 하단 버튼들 */}
          <View className='flex-row gap-3'>
            <Pressable
              className='flex-1 p-3 border border-gray-300 rounded-lg'
              onPress={onClose}
            >
              <Text className='text-center text-gray-700 font-medium'>
                취소
              </Text>
            </Pressable>
            <Pressable
              className='flex-1 p-3 bg-red-500 rounded-lg'
              onPress={handleConfirm}
            >
              <Text className='text-center text-white font-medium'>삭제</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
