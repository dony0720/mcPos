import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import {
  CustomerTransaction as Transaction,
  CustomerAccountTransactionType as TransactionType,
} from '../../types';

interface TransactionDeleteConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  transaction: Transaction | null;
}

/**
 * 거래 내역 삭제 확인 모달
 * - 사용자에게 삭제 확인을 요청
 * - 거래 타입에 따른 금액 영향 안내
 * - 실수로 삭제하는 것을 방지
 */
export default function TransactionDeleteConfirmModal({
  visible,
  onClose,
  onConfirm,
  transaction,
}: TransactionDeleteConfirmModalProps) {
  console.log('TransactionDeleteConfirmModal 렌더링:', {
    visible,
    transaction,
  });

  if (!transaction) {
    console.log('거래 내역이 없어서 모달을 렌더링하지 않습니다.');
    return null;
  }

  const getTransactionTypeInfo = (type: TransactionType) => {
    switch (type) {
      case TransactionType.REGISTER:
        return {
          title: '등록 거래 삭제',
          message: '이 거래를 삭제하면 초기 등록 금액이 차감됩니다.',
          icon: 'person-remove',
          color: 'text-red-600',
        };
      case TransactionType.CHARGE:
        return {
          title: '충전 거래 삭제',
          message: '이 거래를 삭제하면 충전 금액이 차감됩니다.',
          icon: 'remove-circle',
          color: 'text-red-600',
        };
      case TransactionType.USE:
        return {
          title: '사용 거래 삭제',
          message: '이 거래를 삭제하면 사용 금액이 환불됩니다.',
          icon: 'add-circle',
          color: 'text-green-600',
        };
      case TransactionType.EDIT:
        return {
          title: '수정 거래 삭제',
          message: '이 거래를 삭제해도 금액에는 영향이 없습니다.',
          icon: 'create',
          color: 'text-gray-600',
        };
      default:
        return {
          title: '거래 삭제',
          message: '이 거래를 삭제하시겠습니까?',
          icon: 'document',
          color: 'text-gray-600',
        };
    }
  };

  const typeInfo = getTransactionTypeInfo(transaction.type);

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      animationType='fade'
    >
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl p-6 w-[90%] max-w-md'>
          {/* 디버깅용 텍스트 */}
          <Text className='text-xs text-red-500 mb-2'>
            Debug: Modal is visible = {visible.toString()}
          </Text>
          {/* 헤더 */}
          <View className='flex-row items-center justify-between mb-4'>
            <Text className={`text-xl font-bold ${typeInfo.color}`}>
              {typeInfo.title}
            </Text>
            <Pressable onPress={onClose} className='p-2'>
              <Ionicons name='close' size={24} color='#666' />
            </Pressable>
          </View>

          {/* 경고 아이콘 */}
          <View className='items-center mb-4'>
            <View className='w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-3'>
              <Ionicons name={typeInfo.icon as any} size={32} color='#EF4444' />
            </View>
          </View>

          {/* 메시지 */}
          <View className='mb-6'>
            <Text className='text-lg font-semibold text-gray-800 text-center mb-2'>
              정말 삭제하시겠습니까?
            </Text>
            <Text className='text-gray-600 text-center mb-4'>
              {typeInfo.message}
            </Text>

            {/* 삭제할 거래 정보 */}
            <View className='bg-gray-50 rounded-lg p-4'>
              <View className='flex-row justify-between mb-2'>
                <Text className='text-gray-600'>거래 타입:</Text>
                <Text className='text-gray-800 font-medium'>
                  {transaction.type}
                </Text>
              </View>
              <View className='flex-row justify-between mb-2'>
                <Text className='text-gray-600'>금액:</Text>
                <Text className='text-gray-800 font-medium'>
                  {transaction.amount}
                </Text>
              </View>
              <View className='flex-row justify-between mb-2'>
                <Text className='text-gray-600'>날짜:</Text>
                <Text className='text-gray-800 font-medium'>
                  {transaction.date}
                </Text>
              </View>
              <View className='flex-row justify-between'>
                <Text className='text-gray-600'>접수자:</Text>
                <Text className='text-gray-800 font-medium'>
                  {transaction.receptionist}
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
                console.log('🔥 삭제 버튼 클릭됨!');
                console.log('onConfirm 함수 호출');
                onConfirm();
                console.log('onConfirm 함수 호출 완료');
                // onClose는 onConfirm에서 처리됨
              }}
            >
              <Text className='text-white text-center font-semibold text-lg'>
                🔥 삭제 🔥
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
