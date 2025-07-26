import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

// 모달 props 타입 정의
interface CashTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  type: 'deposit' | 'withdraw';
}

export default function CashTransactionModal({
  visible,
  onClose,
  type,
}: CashTransactionModalProps) {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  // 모달이 열릴 때 초기화
  useEffect(() => {
    if (visible) {
      setAmount('');
      setMemo('');
    }
  }, [visible]);

  // 확인 버튼 핸들러
  const handleConfirm = () => {
    onClose();
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    onClose();
  };

  // 금액 포맷팅
  const formatAmount = (value: string) => {
    const numValue = parseFloat(value) || 0;
    return numValue.toLocaleString();
  };

  const isDeposit = type === 'deposit';
  const title = isDeposit ? '현금 입금' : '현금 출금';
  const buttonColor = isDeposit ? 'bg-primaryGreen' : 'bg-red-500';
  const iconName = isDeposit ? 'add-circle-outline' : 'remove-circle-outline';
  const iconColor = isDeposit ? '#10B981' : '#EF4444';

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className='flex-1 bg-black/50 justify-center items-center p-4'>
          <TouchableWithoutFeedback>
            <View className='bg-white rounded-2xl w-full max-w-md'>
              {/* 모달 헤더 */}
              <View className='flex-row items-center justify-between p-6 border-b border-gray-200'>
                <View className='flex-row items-center gap-3'>
                  <Ionicons name={iconName} size={28} color={iconColor} />
                  <Text className='text-2xl font-bold text-gray-900'>
                    {title}
                  </Text>
                </View>
                <Pressable
                  onPress={onClose}
                  className='w-8 h-8 items-center justify-center'
                >
                  <Ionicons name='close' size={24} color='#6B7280' />
                </Pressable>
              </View>

              {/* 모달 내용 */}
              <View className='p-6 flex-col gap-6'>
                {/* 금액 입력 */}
                <View className='flex-col gap-2'>
                  <Text className='text-lg font-medium text-gray-700'>
                    금액
                  </Text>
                  <View className='relative'>
                    <TextInput
                      className='border-2 border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-3 text-right text-2xl font-bold pr-12'
                      value={amount}
                      onChangeText={setAmount}
                      keyboardType='numeric'
                      placeholder='0'
                      placeholderTextColor='#9CA3AF'
                    />
                    <Text className='absolute right-4 top-4 text-lg font-medium text-gray-600'>
                      원
                    </Text>
                  </View>
                </View>

                {/* 메모 입력 */}
                <View className='flex-col gap-2'>
                  <Text className='text-lg font-medium text-gray-700'>
                    메모 (선택사항)
                  </Text>
                  <TextInput
                    className='border-2 border-gray-300 bg-white text-gray-800 rounded-xl px-4 py-3 text-base h-24'
                    value={memo}
                    onChangeText={setMemo}
                    placeholder='메모를 입력하세요...'
                    placeholderTextColor='#9CA3AF'
                    multiline
                    textAlignVertical='top'
                  />
                </View>
              </View>

              {/* 모달 푸터 */}
              <View className='flex-row gap-3 p-6 border-t border-gray-200'>
                <Pressable
                  onPress={handleCancel}
                  className='flex-1 bg-gray-100 rounded-xl p-3 items-center'
                >
                  <Text className='text-gray-700 font-medium text-lg'>
                    취소
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  className={`flex-1 ${buttonColor} rounded-xl p-3 items-center`}
                >
                  <Text className='text-white font-medium text-lg'>
                    {title}
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
