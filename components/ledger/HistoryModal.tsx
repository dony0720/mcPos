import { Ionicons } from '@expo/vector-icons';
import { clsx } from 'clsx';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { PaymentMethod, TransactionType } from '../../constants/ledger';
import { HistoryModalProps, Transaction } from '../../types';

export default function HistoryModal({
  visible,
  onClose,
  onDeleteTransaction,
  customerInfo,
}: HistoryModalProps) {
  // 임의의 거래 내역 데이터 (고객별로 다른 데이터)
  const getTransactionData = (memberNumber: string): Transaction[] => {
    const baseData: Record<string, Transaction[]> = {
      M001: [
        {
          id: '1',
          date: '2024-12-15 14:30',
          type: TransactionType.REGISTER,
          amount: '50,000원',
          receptionist: '홍길동',
          paymentMethod: PaymentMethod.CASH,
        },
        {
          id: '2',
          date: '2024-12-14 16:45',
          type: TransactionType.USE,
          amount: '4,500원',
          receptionist: '김직원',
          paymentMethod: PaymentMethod.LEDGER,
        },
        {
          id: '3',
          date: '2024-12-13 11:20',
          type: TransactionType.CHARGE,
          amount: '30,000원',
          receptionist: '이사장',
          paymentMethod: PaymentMethod.BANK_TRANSFER,
        },
        {
          id: '4',
          date: '2024-12-12 09:15',
          type: TransactionType.USE,
          amount: '3,000원',
          receptionist: '박매니저',
          paymentMethod: PaymentMethod.LEDGER,
        },
        {
          id: '5',
          date: '2024-12-12 09:15',
          type: TransactionType.USE,
          amount: '3,000원',
          receptionist: '박매니저',
          paymentMethod: PaymentMethod.LEDGER,
        },
        {
          id: '6',
          date: '2024-12-12 09:15',
          type: TransactionType.USE,
          amount: '3,000원',
          receptionist: '박매니저',
          paymentMethod: PaymentMethod.LEDGER,
        },
        {
          id: '7',
          date: '2024-12-12 09:15',
          type: TransactionType.USE,
          amount: '3,000원',
          receptionist: '박매니저',
          paymentMethod: PaymentMethod.LEDGER,
        },
      ],
      M002: [
        {
          id: '1',
          date: '2024-12-14 10:30',
          type: TransactionType.REGISTER,
          amount: '30,000원',
          receptionist: '김직원',
          paymentMethod: PaymentMethod.CARD,
        },
        {
          id: '2',
          date: '2024-12-13 15:20',
          type: TransactionType.USE,
          amount: '5,500원',
          receptionist: '홍길동',
          paymentMethod: PaymentMethod.LEDGER,
        },
        {
          id: '3',
          date: '2024-12-11 14:10',
          type: TransactionType.EDIT,
          amount: '25,000원',
          receptionist: '최대리',
          paymentMethod: PaymentMethod.CASH,
        },
      ],
      M003: [
        {
          id: '1',
          date: '2024-12-10 16:00',
          type: TransactionType.REGISTER,
          amount: '100,000원',
          receptionist: '홍길동',
          paymentMethod: PaymentMethod.BANK_TRANSFER,
        },
        {
          id: '2',
          date: '2024-12-09 13:45',
          type: TransactionType.USE,
          amount: '8,000원',
          receptionist: '이사장',
          paymentMethod: PaymentMethod.LEDGER,
        },
      ],
      M004: [
        {
          id: '1',
          date: '2024-12-12 11:30',
          type: TransactionType.REGISTER,
          amount: '25,000원',
          receptionist: '이사장',
          paymentMethod: PaymentMethod.CARD,
        },
        {
          id: '2',
          date: '2024-12-11 14:20',
          type: TransactionType.CHARGE,
          amount: '15,000원',
          receptionist: '박매니저',
          paymentMethod: PaymentMethod.CASH,
        },
        {
          id: '3',
          date: '2024-12-10 16:50',
          type: TransactionType.USE,
          amount: '2,500원',
          receptionist: '김직원',
          paymentMethod: PaymentMethod.LEDGER,
        },
        {
          id: '4',
          date: '2024-12-09 12:15',
          type: TransactionType.EDIT,
          amount: '35,000원',
          receptionist: '홍길동',
          paymentMethod: PaymentMethod.BANK_TRANSFER,
        },
      ],
      M005: [
        {
          id: '1',
          date: '2024-12-13 09:45',
          type: TransactionType.REGISTER,
          amount: '75,000원',
          receptionist: '김직원',
          paymentMethod: PaymentMethod.CASH,
        },
        {
          id: '2',
          date: '2024-12-12 17:30',
          type: TransactionType.CHARGE,
          amount: '25,000원',
          receptionist: '홍길동',
          paymentMethod: PaymentMethod.BANK_TRANSFER,
        },
        {
          id: '3',
          date: '2024-12-11 10:20',
          type: TransactionType.USE,
          amount: '6,500원',
          receptionist: '최대리',
          paymentMethod: PaymentMethod.LEDGER,
        },
      ],
    };

    return baseData[memberNumber as keyof typeof baseData] || [];
  };

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

  const transactionHistory = getTransactionData(customerInfo.memberNumber);

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
