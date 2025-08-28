import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
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
import { z } from 'zod';

import { useStaffStore } from '../../stores';
import { ChargeModalProps } from '../../types';

// 유효성 검사 스키마
const chargeSchema = z.object({
  chargeAmount: z
    .string()
    .min(1, '충전 금액을 입력해주세요')
    .refine(val => {
      const num = parseInt(val.replace(/,/g, ''));
      return !isNaN(num) && num >= 1000;
    }, '최소 1,000원 이상 입력해주세요'),
  receptionist: z.string().min(1, '접수자를 선택해주세요'),
  paymentMethod: z.string().min(1, '결제수단을 선택해주세요'),
});

type ChargeFormData = z.infer<typeof chargeSchema>;

export default function ChargeModal({
  visible,
  onClose,
  onConfirm,
  customerInfo,
}: ChargeModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    setValue,
  } = useForm<ChargeFormData>({
    resolver: zodResolver(chargeSchema),
    mode: 'onChange',
    defaultValues: {
      chargeAmount: '',
      receptionist: '',
      paymentMethod: '',
    },
  });

  const [showReceptionistDropdown, setShowReceptionistDropdown] =
    useState(false);
  const [showPaymentDropdown, setShowPaymentDropdown] = useState(false);

  // 접수자 옵션 (스토어에서 중복 제거)
  const allStaffs = useStaffStore(state => state.staffs);
  const receptionistOptions = allStaffs.filter(
    (staff, index, self) =>
      index ===
      self.findIndex(s => s.name === staff.name && s.phone === staff.phone)
  );

  const paymentMethods = ['현금', '계좌이체'];

  // 모달이 열릴 때 드롭다운 상태 초기화
  useEffect(() => {
    if (visible) {
      setShowReceptionistDropdown(false);
      setShowPaymentDropdown(false);
    }
  }, [visible]);

  const formatAmount = (text: string) => {
    // 숫자가 아닌 문자들을 모두 제거 (한 글자씩 확인)
    let numbersOnly = '';
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char >= '0' && char <= '9') {
        numbersOnly += char;
      }
    }

    // 빈 문자열이면 그대로 반환
    if (!numbersOnly) return '';

    // 숫자로 변환 후 천 단위 콤마 자동 추가
    const number = parseInt(numbersOnly, 10);
    return number.toLocaleString('ko-KR');
  };

  const handleConfirm = (data: ChargeFormData) => {
    onConfirm({
      chargeAmount: data.chargeAmount,
      receptionist: data.receptionist,
      paymentMethod: data.paymentMethod,
    });
    handleClose();
  };

  const handleClose = () => {
    reset();
    setShowReceptionistDropdown(false);
    setShowPaymentDropdown(false);
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl p-6 w-[90%] max-w-lg h-[65%] flex flex-col'>
          <ScrollView
            showsVerticalScrollIndicator={false}
            className='flex-1'
            nestedScrollEnabled={true}
            contentContainerStyle={{ paddingBottom: 150 }}
          >
            <View className='flex-row items-center justify-between mb-6'>
              <Text className='text-xl font-bold'>장부 충전</Text>
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
              <View className='flex-row justify-between'>
                <Text className='text-gray-600'>전화번호:</Text>
                <Text className='text-gray-800 font-medium'>
                  {customerInfo.phoneNumber}
                </Text>
              </View>
            </View>

            {/* 충전 금액 입력 */}
            <View className='mb-2'>
              <Text className='text-base font-medium mb-2 text-gray-700'>
                충전 금액 *
              </Text>
              <Controller
                control={control}
                name='chargeAmount'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={`border rounded-lg px-4 py-3 text-base ${
                      errors.chargeAmount ? 'border-red-500' : 'border-gray-300'
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
                {errors.chargeAmount && (
                  <Text className='text-red-500 text-sm'>
                    {errors.chargeAmount.message}
                  </Text>
                )}
              </View>
            </View>

            {/* 접수자 선택 */}
            <View className='mb-2'>
              <Text className='text-base font-medium mb-2 text-gray-700'>
                접수자 *
              </Text>
              <Controller
                control={control}
                name='receptionist'
                render={({ field: { onChange, value } }) => (
                  <View className='relative'>
                    <Pressable
                      className={`border rounded-lg px-4 py-3 flex-row justify-between items-center ${
                        errors.receptionist
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      onPress={() => {
                        setShowPaymentDropdown(false); // 다른 드롭다운 닫기
                        setShowReceptionistDropdown(!showReceptionistDropdown);
                      }}
                    >
                      <Text
                        className={clsx('text-base', {
                          'text-gray-800': value,
                          'text-gray-400': !value,
                        })}
                      >
                        {value || '접수자를 선택하세요'}
                      </Text>
                      <Ionicons
                        name={
                          showReceptionistDropdown
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        size={20}
                        color='#666'
                      />
                    </Pressable>

                    {showReceptionistDropdown && (
                      <View className='absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48'>
                        <ScrollView
                          showsVerticalScrollIndicator={true}
                          nestedScrollEnabled={true}
                          className='max-h-48'
                        >
                          {receptionistOptions.map((option, index) => (
                            <Pressable
                              key={index}
                              className='px-4 py-3 border-b border-gray-100 last:border-b-0 active:bg-gray-50'
                              onPress={() => {
                                const displayText = `${option.name} (${option.phone})`;
                                onChange(displayText);
                                setValue('receptionist', displayText);
                                setShowReceptionistDropdown(false);
                              }}
                            >
                              <View className='flex-row items-center justify-between'>
                                <View className='flex-1'>
                                  <Text className='text-gray-800 font-medium'>
                                    {option.name}
                                  </Text>
                                  <Text className='text-gray-500 text-sm'>
                                    {option.phone}
                                  </Text>
                                </View>
                                {value ===
                                  `${option.name} (${option.phone})` && (
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
            <View className='mb-2'>
              <Text className='text-base font-medium mb-2 text-gray-700'>
                결제수단 *
              </Text>
              <Controller
                control={control}
                name='paymentMethod'
                render={({ field: { onChange, value } }) => (
                  <View className='relative'>
                    <Pressable
                      className={`border rounded-lg px-4 py-3 flex-row justify-between items-center ${
                        errors.paymentMethod
                          ? 'border-red-500'
                          : 'border-gray-300'
                      }`}
                      onPress={() => {
                        setShowReceptionistDropdown(false); // 다른 드롭다운 닫기
                        setShowPaymentDropdown(!showPaymentDropdown);
                      }}
                    >
                      <Text
                        className={clsx('text-base', {
                          'text-gray-800': value,
                          'text-gray-400': !value,
                        })}
                      >
                        {value || '결제수단을 선택하세요'}
                      </Text>
                      <Ionicons
                        name={
                          showPaymentDropdown ? 'chevron-up' : 'chevron-down'
                        }
                        size={20}
                        color='#666'
                      />
                    </Pressable>

                    {showPaymentDropdown && (
                      <View className='absolute top-full left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48'>
                        <ScrollView
                          showsVerticalScrollIndicator={true}
                          nestedScrollEnabled={true}
                          className='max-h-48'
                        >
                          {paymentMethods.map((option, index) => (
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
                                console.log('결제수단 선택됨:', option);
                                onChange(option);
                                setValue('paymentMethod', option);
                                setShowPaymentDropdown(false);
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

          {/* 버튼들 */}
          <View className='flex-row gap-3 mt-6'>
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
              onPress={handleSubmit(handleConfirm)}
              disabled={!isValid}
            >
              <Text
                className={`text-center font-semibold ${
                  isValid ? 'text-white' : 'text-gray-500'
                }`}
              >
                충전
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
