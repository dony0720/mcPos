import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: {
    newAmount: string;
    receptionist: string;
    paymentMethod: string;
  }) => void;
  customerInfo: {
    name: string;
    memberNumber: string;
    phoneNumber: string;
    currentAmount: string;
  };
}

export default function EditModal({
  visible,
  onClose,
  onConfirm,
  customerInfo,
}: EditModalProps) {
  const [newAmount, setNewAmount] = useState('');
  const [receptionist, setReceptionist] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showReceptionistDropdown, setShowReceptionistDropdown] =
    useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  const receptionists = ['홍길동', '김직원', '이사장', '박매니저', '최대리'];
  const paymentMethods = ['현금', '계좌이체'];

  // 모달이 열릴 때 현재 금액을 기본값으로 설정
  useEffect(() => {
    if (visible && customerInfo.currentAmount) {
      const currentAmountNumber = customerInfo.currentAmount.replace(
        /[^\d]/g,
        ''
      );
      setNewAmount(
        currentAmountNumber
          ? parseInt(currentAmountNumber).toLocaleString()
          : ''
      );
    }
  }, [visible, customerInfo.currentAmount]);

  const formatAmount = (value: string) => {
    const number = value.replace(/[^\d]/g, '');
    return number ? parseInt(number).toLocaleString() : '';
  };

  const handleAmountChange = (value: string) => {
    const formatted = formatAmount(value);
    setNewAmount(formatted);
  };

  const handleConfirm = () => {
    if (!newAmount || !receptionist || !paymentMethod) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    onConfirm({
      newAmount,
      receptionist,
      paymentMethod,
    });

    // 초기화
    setNewAmount('');
    setReceptionist('');
    setPaymentMethod('');
  };

  const handleClose = () => {
    setNewAmount('');
    setReceptionist('');
    setPaymentMethod('');
    setShowReceptionistDropdown(false);
    setShowPaymentDropdown(false);
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl p-6 w-[90%] max-w-lg'>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className='flex-row items-center justify-between mb-6'>
              <Text className='text-xl font-bold'>장부 수정</Text>
              <Pressable onPress={handleClose} className='p-2'>
                <Ionicons name='close' size={24} color='#666' />
              </Pressable>
            </View>

            {/* 고객 정보 표시 */}
            <View className='mb-6 p-4 bg-gray-50 rounded-lg'>
              <Text className='text-lg font-semibold text-gray-800 mb-3'>
                고객 정보
              </Text>
              <View className='flex-row justify-between mb-2'>
                <Text className='text-gray-600'>회원번호:</Text>
                <Text className='text-gray-800 font-medium'>
                  {customerInfo.memberNumber}
                </Text>
              </View>
              <View className='flex-row justify-between mb-2'>
                <Text className='text-gray-600'>이름:</Text>
                <Text className='text-gray-800 font-medium'>
                  {customerInfo.name}
                </Text>
              </View>
              <View className='flex-row justify-between mb-2'>
                <Text className='text-gray-600'>전화번호:</Text>
                <Text className='text-gray-800 font-medium'>
                  {customerInfo.phoneNumber}
                </Text>
              </View>
              <View className='flex-row justify-between'>
                <Text className='text-gray-600'>현재 금액:</Text>
                <Text className='text-gray-800 font-medium'>
                  {customerInfo.currentAmount}
                </Text>
              </View>
            </View>

            {/* 새로운 금액 입력 */}
            <View className='mb-4'>
              <Text className='text-base font-medium mb-2 text-gray-700'>
                새로운 금액 *
              </Text>
              <TextInput
                className='border border-gray-300 rounded-lg px-4 py-3 text-base'
                placeholder='새로운 금액을 입력하세요'
                value={newAmount}
                onChangeText={handleAmountChange}
                keyboardType='numeric'
              />
              <Text className='text-xs text-orange-600 mt-1'>
                * 기존 금액이 새로운 금액으로 완전히 교체됩니다.
              </Text>
            </View>

            {/* 접수자 선택 */}
            <View className='mb-4'>
              <Text className='text-base font-medium mb-2 text-gray-700'>
                접수자 *
              </Text>
              <View className='relative'>
                <Pressable
                  className='border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center'
                  onPress={() => {
                    setShowReceptionistDropdown(!showReceptionistDropdown);
                    setShowPaymentDropdown(false);
                  }}
                >
                  <Text
                    className={`text-base ${receptionist ? 'text-gray-800' : 'text-gray-400'}`}
                  >
                    {receptionist || '접수자를 선택하세요'}
                  </Text>
                  <Ionicons
                    name={
                      showReceptionistDropdown ? 'chevron-up' : 'chevron-down'
                    }
                    size={20}
                    color='#666'
                  />
                </Pressable>

                {showReceptionistDropdown && (
                  <View
                    className='border border-gray-300 rounded-lg mt-1 bg-white shadow-lg'
                    style={{ zIndex: 1000 }}
                  >
                    {receptionists.map(item => (
                      <Pressable
                        key={item}
                        className='px-4 py-3 border-b border-gray-100 last:border-b-0'
                        onPress={() => {
                          setReceptionist(item);
                          setShowReceptionistDropdown(false);
                        }}
                      >
                        <Text className='text-base text-gray-800'>{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* 결제수단 선택 */}
            <View className='mb-6'>
              <Text className='text-base font-medium mb-2 text-gray-700'>
                결제수단 *
              </Text>
              <View className='relative'>
                <Pressable
                  className='border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center'
                  onPress={() => {
                    setShowPaymentDropdown(!showPaymentDropdown);
                    setShowReceptionistDropdown(false);
                  }}
                >
                  <Text
                    className={`text-base ${paymentMethod ? 'text-gray-800' : 'text-gray-400'}`}
                  >
                    {paymentMethod || '결제수단을 선택하세요'}
                  </Text>
                  <Ionicons
                    name={showPaymentDropdown ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color='#666'
                  />
                </Pressable>

                {showPaymentDropdown && (
                  <View
                    className='border border-gray-300 rounded-lg mt-1 bg-white shadow-lg'
                    style={{ zIndex: 1000 }}
                  >
                    {paymentMethods.map(item => (
                      <Pressable
                        key={item}
                        className='px-4 py-3 border-b border-gray-100 last:border-b-0'
                        onPress={() => {
                          setPaymentMethod(item);
                          setShowPaymentDropdown(false);
                        }}
                      >
                        <Text className='text-base text-gray-800'>{item}</Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            {/* 버튼들 */}
            <View className='flex-row gap-3'>
              <Pressable
                className='flex-1 p-3 bg-gray-300 rounded-lg'
                onPress={handleClose}
              >
                <Text className='text-gray-700 text-center font-semibold'>
                  취소
                </Text>
              </Pressable>
              <Pressable
                className='flex-1 p-3 bg-orange-500 rounded-lg'
                onPress={handleConfirm}
              >
                <Text className='text-white text-center font-semibold'>
                  수정
                </Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
