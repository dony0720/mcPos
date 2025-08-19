import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { useLedgerStore } from '../../stores';
import {
  HistoryModalProps,
  CustomerAccountTransactionType as TransactionType,
} from '../../types';

export default function HistoryModal({
  visible,
  onClose,
  onDeleteTransaction,
  customerInfo,
}: HistoryModalProps) {
  // Zustand store에서 거래 내역 가져오기
  const { getTransactionsByMemberNumber } = useLedgerStore();
  const transactionHistory = getTransactionsByMemberNumber(
    customerInfo.memberNumber
  );

  const getTransactionIcon = (type: TransactionType) => {
    switch (type) {
      case TransactionType.CHARGE:
        return { name: 'add-circle', color: '#10B981' };
      case TransactionType.EDIT:
        return { name: 'create', color: '#F59E0B' };
      case TransactionType.REGISTER:
        return { name: 'person-add', color: '#3B82F6' };
      case TransactionType.USE:
        return { name: 'remove-circle', color: '#EF4444' };
      default:
        return { name: 'document', color: '#6B7280' };
    }
  };

  const getTransactionStyle = (type: TransactionType) => {
    switch (type) {
      case TransactionType.USE:
        return { color: 'text-red-600', sign: '-' };
      case TransactionType.CHARGE:
        return { color: 'text-green-600', sign: '+' };
      case TransactionType.REGISTER:
        return { color: 'text-blue-600', sign: '+' };
      case TransactionType.EDIT:
        return { color: 'text-purple-600', sign: '±' };
      default:
        return { color: 'text-gray-800', sign: '' };
    }
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center box-border px-[20%] items-center bg-black/50'>
        <View className='bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[95%] min-h-[80%] flex flex-col'>
          <View className='flex-row items-center justify-between mb-4'>
            <Text className='text-xl font-bold'>거래 내역</Text>
            <Pressable onPress={onClose} className='p-2'>
              <Ionicons name='close' size={24} color='#666' />
            </Pressable>
          </View>

          {/* 고객 정보 표시 */}
          <View className='mb-6 p-4 bg-gray-50 rounded-lg'>
            <Text className='text-lg font-semibold text-gray-800 mb-2'>
              고객 정보
            </Text>
            <View className='flex-row justify-between mb-1'>
              <Text className='text-gray-600'>회원번호:</Text>
              <Text className='text-gray-800 font-medium'>
                {customerInfo.memberNumber}
              </Text>
            </View>
            <View className='flex-row justify-between mb-1'>
              <Text className='text-gray-600'>이름:</Text>
              <Text className='text-gray-800 font-medium'>
                {customerInfo.name}
              </Text>
            </View>
            <View className='flex-row justify-between'>
              <Text className='text-gray-600'>전화번호:</Text>
              <Text className='text-gray-800 font-medium'>
                {customerInfo.phoneNumber}
              </Text>
            </View>
          </View>

          {/* 거래 내역 목록 */}
          <View className='flex-1'>
            <Text className='text-lg font-semibold mb-3'>
              거래 내역 ({transactionHistory.length}건)
            </Text>

            {transactionHistory.length === 0 ? (
              <View className='flex-1 justify-center items-center'>
                <Ionicons name='document-outline' size={48} color='#D1D5DB' />
                <Text className='text-gray-500 text-center mt-2'>
                  거래 내역이 없습니다.
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                className='flex-1'
              >
                {transactionHistory.map(transaction => {
                  const icon = getTransactionIcon(transaction.type);
                  const style = getTransactionStyle(transaction.type);
                  return (
                    <View
                      key={transaction.id}
                      className='mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm'
                    >
                      {/* 거래 헤더 - 거래 타입과 X 버튼 */}
                      <View className='flex-row items-center justify-between mb-3'>
                        <View className='flex-row items-center'>
                          <Ionicons
                            name={icon.name as keyof typeof Ionicons.glyphMap}
                            size={20}
                            color={icon.color}
                          />
                          <Text className='ml-2 font-semibold text-gray-800'>
                            {transaction.type}
                          </Text>
                        </View>
                        <Pressable
                          onPress={() => onDeleteTransaction(transaction.id)}
                          className='w-6 h-6 bg-gray-200 rounded-full items-center justify-center'
                        >
                          <Ionicons name='close' size={14} color='#666' />
                        </Pressable>
                      </View>

                      {/* 거래 정보 */}
                      <View className='flex flex-col gap-4'>
                        <View className='flex-row gap-2'>
                          <Text className='text-gray-600'>날짜:</Text>
                          <Text className='text-gray-800'>
                            {transaction.date}
                          </Text>
                        </View>
                        <View className='flex-row gap-4'>
                          <Text className='text-gray-600'>금액:</Text>
                          <Text className={clsx('font-semibold', style.color)}>
                            {style.sign}
                            {transaction.amount}
                          </Text>
                        </View>
                        <View className='flex-row gap-4'>
                          <Text className='text-gray-600'>접수자:</Text>
                          <Text className='text-gray-800'>
                            {transaction.receptionist}
                          </Text>
                        </View>
                        <View className='flex-row gap-4'>
                          <Text className='text-gray-600'>결제수단:</Text>
                          <Text className='text-gray-800'>
                            {transaction.paymentMethod}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* 닫기 버튼 */}
          <View className='mt-4'>
            <Pressable className='p-3 bg-gray-500 rounded-lg' onPress={onClose}>
              <Text className='text-white text-center font-semibold'>닫기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
