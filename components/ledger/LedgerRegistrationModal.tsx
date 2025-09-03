import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  LedgerRegistrationFormData,
  ledgerRegistrationSchema,
  PAYMENT_METHOD_OPTIONS,
} from '../../schemas';
import { useStaffStore } from '../../stores';
import { LedgerRegistrationModalProps } from '../../types/ledger';
import { formatPhoneNumber } from '../../utils';

export default function LedgerRegistrationModal({
  visible,
  onClose,
  onConfirm,
}: LedgerRegistrationModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm<LedgerRegistrationFormData>({
    resolver: zodResolver(ledgerRegistrationSchema),
    mode: 'onChange', // 실시간 검증
    defaultValues: {
      name: '',
      phoneNumber: '',
      initialAmount: '',
      receptionist: '',
      paymentMethod: '',
    },
  });
  const [showReceptionistDropdown, setShowReceptionistDropdown] =
    useState(false);
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] =
    useState(false);

  // 접수자 옵션 (중복 제거)
  const allStaffs = useStaffStore(state => state.staffs);
  const receptionistOptions = allStaffs.filter(
    (staff, index, self) => index === self.findIndex(s => s.name === staff.name)
  );

  // 결제수단 옵션 (스키마에서 가져옴)
  const paymentMethodOptions = [...PAYMENT_METHOD_OPTIONS];

  // 모달이 열릴 때 드롭다운 상태 초기화
  useEffect(() => {
    if (visible) {
      setShowReceptionistDropdown(false);
      setShowPaymentMethodDropdown(false);
    }
  }, [visible]);

  // 폼 제출 핸들러 - 검증이 통과된 경우에만 호출됨
  const onSubmit = (data: LedgerRegistrationFormData) => {
    onConfirm(data);
    handleClose();
  };

  const handleClose = () => {
    reset(); // 폼 초기화
    setShowReceptionistDropdown(false); // 접수자 드롭다운 닫기
    setShowPaymentMethodDropdown(false); // 결제수단 드롭다운 닫기
    onClose();
  };

  const formatAmount = (text: string) => {
    let numbersOnly = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char >= '0' && char <= '9') {
        numbersOnly += char;
      }
    }

    if (!numbersOnly) return '';

    const number = parseInt(numbersOnly, 10);
    return number.toLocaleString('ko-KR');
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl p-6 w-4/5 max-w-md h-[70%] flex flex-col'>
          {/* 헤더 영역 */}
          <Text className='text-xl font-bold text-center mb-4'>장부 등록</Text>
          <Text className='text-gray-600 text-center mb-6'>
            새로운 고객 장부를 등록합니다.
          </Text>

          {/* 콘텐츠 영역 (스크롤) */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            className='flex-1'
            contentContainerStyle={{ paddingBottom: 150 }}
          >
            {/* 이름 입력 */}
            <View className='mb-4'>
              <Text className='text-gray-700 font-semibold mb-2'>이름</Text>
              <Controller
                control={control}
                name='name'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`border rounded-lg px-4 py-3 ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='이름을 입력하세요'
                    value={value}
                    onChangeText={onChange}
                  />
                )}
              />
              <View className='min-h-[24px] mt-1'>
                {errors.name && (
                  <Text className='text-red-500 text-sm'>
                    {errors.name.message}
                  </Text>
                )}
              </View>
            </View>

            {/* 전화번호 입력 */}
            <View className='mb-4'>
              <Text className='text-gray-700 font-semibold mb-2'>전화번호</Text>
              <Controller
                control={control}
                name='phoneNumber'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`border rounded-lg px-4 py-3 ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder='010-0000-0000'
                    value={value}
                    onChangeText={text => {
                      const formattedPhone = formatPhoneNumber(text);
                      onChange(formattedPhone);
                    }}
                    keyboardType='phone-pad'
                    maxLength={13} // 010-0000-0000 형태의 최대 길이
                  />
                )}
              />
              <View className='min-h-[20px] mt-1'>
                {errors.phoneNumber && (
                  <Text className='text-red-500 text-sm'>
                    {errors.phoneNumber.message}
                  </Text>
                )}
              </View>
            </View>

            {/* 초기 충전 금액 입력 */}
            <View className='mb-4'>
              <Text className='text-gray-700 font-semibold mb-2'>
                초기 충전 금액
              </Text>
              <Controller
                control={control}
                name='initialAmount'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`border rounded-lg px-4 py-3 ${
                      errors.initialAmount
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                    placeholder='충전할 금액을 입력하세요'
                    value={value}
                    onChangeText={text => {
                      const formatted = formatAmount(text);
                      onChange(formatted);
                    }}
                    keyboardType='numeric'
                  />
                )}
              />
              <View className='min-h-[20px] mt-1'>
                {errors.initialAmount && (
                  <Text className='text-red-500 text-sm'>
                    {errors.initialAmount.message}
                  </Text>
                )}
              </View>
            </View>

            {/* 접수자 선택 */}
            <View className='mb-4'>
              <Text className='text-gray-700 font-semibold mb-2'>접수자</Text>
              <Controller
                control={control}
                name='receptionist'
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`border rounded-lg relative ${
                      errors.receptionist ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <Pressable
                      className='px-4 py-3 flex-row items-center justify-between'
                      onPress={() => {
                        setShowPaymentMethodDropdown(false); // 다른 드롭다운 닫기
                        setShowReceptionistDropdown(!showReceptionistDropdown);
                      }}
                    >
                      <Text
                        className={`${value ? 'text-gray-800' : 'text-gray-400'}`}
                      >
                        {value || '접수자를 선택하세요'}
                      </Text>
                      <Ionicons
                        name='chevron-down'
                        size={20}
                        color={value ? '#374151' : '#9CA3AF'}
                      />
                    </Pressable>

                    {/* 옵션 목록 - 항상 표시 */}
                    {showReceptionistDropdown && (
                      <View className='absolute top-full left-0 right-0 z-10 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48'>
                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          className='max-h-48'
                        >
                          {receptionistOptions.map((option, index) => (
                            <Pressable
                              key={index}
                              className='px-4 py-3 border-b border-gray-100 last:border-b-0'
                              onPress={() => {
                                onChange(option.name);
                                setValue('receptionist', option.name);
                                setShowReceptionistDropdown(false);
                              }}
                            >
                              <View className='flex-row items-center justify-between'>
                                <View className='flex-1'>
                                  <Text className='text-gray-800 font-medium'>
                                    {option.name}
                                  </Text>
                                </View>
                                {value === option.name && (
                                  <Ionicons
                                    name='checkmark'
                                    size={20}
                                    color='#10B981'
                                  />
                                )}
                              </View>
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                )}
              />
              <View className='min-h-[20px] mt-1'>
                {errors.receptionist && (
                  <Text className='text-red-500 text-sm'>
                    {errors.receptionist.message}
                  </Text>
                )}
              </View>
            </View>

            {/* 결제수단 선택 */}
            <View className='mb-6'>
              <Text className='text-gray-700 font-semibold mb-2'>결제수단</Text>
              <Controller
                control={control}
                name='paymentMethod'
                render={({ field: { onChange, value } }) => (
                  <View
                    className={`border rounded-lg relative ${
                      errors.paymentMethod
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  >
                    <Pressable
                      className='px-4 py-3 flex-row items-center justify-between'
                      onPress={() => {
                        setShowReceptionistDropdown(false); // 다른 드롭다운 닫기
                        setShowPaymentMethodDropdown(
                          !showPaymentMethodDropdown
                        );
                      }}
                    >
                      <Text
                        className={`${value ? 'text-gray-800' : 'text-gray-400'}`}
                      >
                        {value || '결제수단을 선택하세요'}
                      </Text>
                      <Ionicons
                        name='chevron-down'
                        size={20}
                        color={value ? '#374151' : '#9CA3AF'}
                      />
                    </Pressable>

                    {/* 옵션 목록 - 아래쪽으로 열림 */}
                    {showPaymentMethodDropdown && (
                      <View className='absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg mt-1'>
                        <ScrollView
                          showsVerticalScrollIndicator={false}
                          className='max-h-48'
                        >
                          {paymentMethodOptions.map((option, index) => (
                            <Pressable
                              key={index}
                              className='px-4 py-4 min-h-[56px] flex-row items-center justify-between border-b border-gray-100 last:border-b-0 active:bg-blue-100'
                              hitSlop={{
                                top: 10,
                                bottom: 10,
                                left: 10,
                                right: 10,
                              }}
                              onPress={() => {
                                onChange(option);
                                setValue('paymentMethod', option);
                                setShowPaymentMethodDropdown(false);
                              }}
                            >
                              <Text className='text-gray-800 flex-1'>
                                {option}
                              </Text>
                              {value === option && (
                                <Ionicons
                                  name='checkmark'
                                  size={20}
                                  color='#10B981'
                                />
                              )}
                            </Pressable>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                )}
              />
              <View className='min-h-[20px] mt-1'>
                {errors.paymentMethod && (
                  <Text className='text-red-500 text-sm'>
                    {errors.paymentMethod.message}
                  </Text>
                )}
              </View>
            </View>
          </ScrollView>

          {/* 버튼 영역 */}
          <View className='p-6 pt-4 '>
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
                className={`flex-1 p-3 rounded-lg ${
                  isValid ? 'bg-primaryGreen' : 'bg-gray-300'
                }`}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
              >
                <Text
                  className={`text-center font-semibold ${
                    isValid ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  등록
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
