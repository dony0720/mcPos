import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { Transaction } from './TransactionItem';

interface ReceiptModalProps {
  visible: boolean;
  onClose: () => void;
  onPrint: () => void;
}

export default function ReceiptModal({
  visible,
  onClose,
  onPrint,
}: ReceiptModalProps) {
  // 목업 데이터 생성
  const mockTransaction: Transaction = {
    id: 'TXN_1234',
    date: '2025-04-14T14:32:00Z',
    paymentMethod: '현금',
    amount: 10100,
    orderMethod: '테이크아웃',
    orderItems: [
      {
        id: 'item_1',
        menuName: '아메리카노 (HOT)',
        options: '샷 추가',
        price: 3000,
        quantity: 1,
      },
      {
        id: 'item_2',
        menuName: '카페라떼 (ICE)',
        options: '연하게, 휘핑 추가',
        price: 3000,
        quantity: 2,
      },
      {
        id: 'item_3',
        menuName: '카페라떼 (ICE)',
        options: '연하게, 휘핑 추가',
        price: 3000,
        quantity: 2,
      },
      {
        id: 'item_4',
        menuName: '카페라떼 (ICE)',
        options: '연하게, 휘핑 추가',
        price: 3000,
        quantity: 2,
      },
      {
        id: 'item_5',
        menuName: '카페라떼 (ICE)',
        options: '연하게, 휘핑 추가',
        price: 3000,
        quantity: 2,
      },
      {
        id: 'item_6',
        menuName: '카페라떼 (ICE)',
        options: '연하게, 휘핑 추가',
        price: 3000,
        quantity: 2,
      },
    ],
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className='flex-1 justify-center items-center bg-black/50 px-8'>
        <View className='bg-white rounded-2xl p-6 w-full max-w-md h-[70%]'>
          {/* 모달 헤더 */}
          <View className='flex-row justify-end'>
            <Pressable onPress={onClose} className='p-2'>
              <Ionicons name='close' size={24} color='#666' />
            </Pressable>
          </View>

          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {/* 가게 정보 */}
            <View className='items-center mb-6'>
              <Text className='text-lg font-bold mb-2'>
                목천카페 2025-04-14 14:32
              </Text>
              <Text className='text-base font-medium'>
                주문번호: #{mockTransaction.id.split('_')[1]}
              </Text>
            </View>

            {/* 구분선 */}
            <View className='w-full h-px bg-gray-300 mb-4' />

            {/* 주문 내역 */}
            {mockTransaction.orderItems?.map((item, index) => (
              <View key={item.id} className='mb-4'>
                {/* 메인 메뉴 */}
                <View className='flex-row justify-between items-center mb-2'>
                  <View className='flex-1'>
                    <Text className='font-medium text-base'>
                      {item.menuName}
                    </Text>
                  </View>
                  <View className='flex-row items-center gap-4'>
                    <Text className='text-gray-600 text-sm w-6 text-center'>
                      {item.quantity}
                    </Text>
                    <Text className='font-medium text-base w-16 text-right'>
                      {item.price.toLocaleString()}원
                    </Text>
                  </View>
                </View>

                {/* 옵션들 */}
                {item.options && (
                  <View className='ml-3'>
                    {item.options.split(', ').map((option, optionIndex) => (
                      <View
                        key={optionIndex}
                        className='flex-row justify-between items-center mb-1'
                      >
                        <Text className='text-gray-600 text-sm flex-1'>
                          - {option}
                        </Text>
                        <View className='flex-row items-center gap-4'>
                          <Text className='text-gray-600 text-sm w-6 text-center'>
                            {item.quantity}
                          </Text>
                          <Text className='text-gray-600 text-sm w-16 text-right'>
                            {option === '샷 추가'
                              ? '500원'
                              : option === '휘핑 추가'
                                ? '300원'
                                : '0원'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
          {/* 구분선 */}
          <View className='w-full h-px bg-gray-300 mb-4' />
          {/* 하단 정보 */}
          <View className='items-center mb-6'>
            <Text className='text-xl font-bold mb-3'>
              총 결제금액: {mockTransaction.amount.toLocaleString()}원
            </Text>
          </View>
          {/* 출력 버튼 */}

          <Pressable
            onPress={onPrint}
            className='bg-blue-500 rounded-lg py-3 px-6 items-center'
          >
            <View className='flex-row items-center'>
              <Ionicons name='print' size={20} color='white' />
              <Text className='text-white font-medium ml-2'>출력하기</Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
