import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import {
  CashTransactionFormData,
  cashTransactionSchema,
  createWithdrawalSchema,
} from '../../schemas';
import { useCashStore } from '../../stores';
import { CashTransactionModalProps } from '../../types';

export default function CashTransactionModal({
  visible,
  onClose,
  onConfirm,
  type,
}: CashTransactionModalProps) {
  // 현금 스토어에서 현재 보유 현금 정보 가져오기
  const { getTotalCashAmount } = useCashStore();
  const totalCash = getTotalCashAmount();

  // 출금인 경우 현금 부족 체크가 포함된 스키마 사용
  const schema =
    type === 'withdraw'
      ? createWithdrawalSchema(totalCash)
      : cashTransactionSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CashTransactionFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      amount: '',
      memo: '',
    },
  });

  // 모달이 열릴 때 폼 초기화
  useEffect(() => {
    if (visible) {
      reset({ amount: '', memo: '' });
    }
  }, [visible, reset]);

  // 폼 제출 핸들러
  const onSubmit = (data: CashTransactionFormData) => {
    const amountNumber = parseFloat(data.amount.replace(/,/g, ''));
    onConfirm(amountNumber, data.memo || '');
    onClose();
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    onClose();
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
                  <Controller
                    control={control}
                    name='amount'
                    render={({ field: { onChange, value } }) => (
                      <View className='relative'>
                        <TextInput
                          className={clsx(
                            'border-2 bg-white text-gray-800 rounded-xl px-4 py-3 text-right text-2xl font-bold pr-12',
                            errors.amount ? 'border-red-300' : 'border-gray-300'
                          )}
                          value={value}
                          onChangeText={onChange}
                          keyboardType='numeric'
                          placeholder='0'
                          placeholderTextColor='#9CA3AF'
                        />
                        <Text className='absolute right-4 top-4 text-lg font-medium text-gray-600'>
                          원
                        </Text>
                      </View>
                    )}
                  />
                  {errors.amount && (
                    <Text className='text-red-500 text-sm mt-1'>
                      {errors.amount.message}
                    </Text>
                  )}
                </View>

                {/* 메모 입력 */}
                <View className='flex-col gap-2'>
                  <Text className='text-lg font-medium text-gray-700'>
                    메모 (선택사항)
                  </Text>
                  <Controller
                    control={control}
                    name='memo'
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        className={clsx(
                          'border-2 bg-white text-gray-800 rounded-xl px-4 py-3 text-base h-24',
                          errors.memo ? 'border-red-300' : 'border-gray-300'
                        )}
                        value={value || ''}
                        onChangeText={onChange}
                        placeholder='메모를 입력하세요...'
                        placeholderTextColor='#9CA3AF'
                        multiline
                        textAlignVertical='top'
                      />
                    )}
                  />
                  {errors.memo && (
                    <Text className='text-red-500 text-sm mt-1'>
                      {errors.memo.message}
                    </Text>
                  )}
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
                  onPress={handleSubmit(onSubmit)}
                  className={clsx(
                    'flex-1 rounded-xl p-3 items-center',
                    buttonColor
                  )}
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
