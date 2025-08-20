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
  TouchableOpacity,
  View,
} from 'react-native';

import {
  discountFormSchema,
  type DiscountFormSchemaType,
} from '../../schemas/discountSchema';
import type { DiscountType } from '../../types';
import { formatPrice, handlePriceInput } from '../../utils';

interface DiscountAddModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (discountData: DiscountFormSchemaType) => void;
}

/**
 * 할인 추가 모달 컴포넌트
 * - 새로운 할인을 추가할 수 있는 폼 모달
 */
export default function DiscountAddModal({
  visible,
  onClose,
  onConfirm,
}: DiscountAddModalProps) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<DiscountFormSchemaType>({
    resolver: zodResolver(discountFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      type: 'PERCENTAGE',
      value: 0,
      isActive: true,
      description: '',
    },
  });

  const selectedType = watch('type');

  // 할인 유형 옵션
  const TYPE_OPTIONS = [
    { value: 'PERCENTAGE' as DiscountType, label: '퍼센트 할인 (%)' },
    { value: 'FIXED_AMOUNT' as DiscountType, label: '고정금액 할인 (원)' },
  ];

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (visible) {
      reset();
      setShowTypeDropdown(false);
    }
  }, [visible, reset]);

  const onSubmit = (data: DiscountFormSchemaType) => {
    onConfirm(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    setShowTypeDropdown(false);
    onClose();
  };

  const handleTypeSelect = (type: DiscountType) => {
    setValue('type', type, { shouldValidate: true });
    setValue('value', 0); // 유형 변경 시 값 초기화
    setShowTypeDropdown(false);
  };

  const selectedTypeLabel = TYPE_OPTIONS.find(
    option => option.value === selectedType
  )?.label;

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl w-4/5 h-3/5 max-w-lg max-h-[600px]'>
          {/* 헤더 */}
          <View className='p-6 border-b border-gray-200'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-xl font-bold text-gray-800'>
                새 할인 추가
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name='close-outline' size={24} color='#6B7280' />
              </TouchableOpacity>
            </View>
            <Text className='text-sm text-gray-500 mt-1'>
              새로운 할인 정책을 등록합니다
            </Text>
          </View>

          {/* 폼 내용 */}
          <ScrollView
            className='flex-1 p-6'
            showsVerticalScrollIndicator={false}
          >
            {/* 할인명 입력 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                할인명 *
              </Text>
              <Controller
                control={control}
                name='name'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={clsx(
                      'border rounded-lg px-4 py-3',
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    )}
                    placeholder='할인명을 입력하세요'
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize='none'
                  />
                )}
              />
              {errors.name && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.name.message}
                </Text>
              )}
            </View>

            {/* 할인 유형 선택 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                할인 유형 *
              </Text>
              <TouchableOpacity
                className={clsx(
                  'border rounded-lg px-4 py-3 flex-row justify-between items-center',
                  errors.type ? 'border-red-500' : 'border-gray-300',
                  showTypeDropdown && 'rounded-b-none border-b-0'
                )}
                onPress={() => setShowTypeDropdown(!showTypeDropdown)}
              >
                <Text
                  className={clsx(
                    selectedType ? 'text-gray-800' : 'text-gray-400'
                  )}
                >
                  {selectedTypeLabel || '할인 유형을 선택하세요'}
                </Text>
                <Ionicons
                  name={showTypeDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color='#6B7280'
                />
              </TouchableOpacity>

              {/* 드롭다운 목록 */}
              {showTypeDropdown && (
                <View className='border border-t-0 border-gray-300 rounded-b-lg bg-white'>
                  {TYPE_OPTIONS.map((option, index) => (
                    <TouchableOpacity
                      key={option.value}
                      className={clsx(
                        'px-4 py-4',
                        index !== TYPE_OPTIONS.length - 1 &&
                          'border-b border-gray-100'
                      )}
                      onPress={() => handleTypeSelect(option.value)}
                    >
                      <Text className='text-gray-800 text-base'>
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {errors.type && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.type.message}
                </Text>
              )}
            </View>

            {/* 할인값 입력 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                할인값 *
              </Text>
              <Controller
                control={control}
                name='value'
                render={({ field: { onChange, value } }) => (
                  <View className='flex-row items-center'>
                    <TextInput
                      className={clsx(
                        'flex-1 border rounded-lg px-4 py-3',
                        errors.value ? 'border-red-500' : 'border-gray-300'
                      )}
                      placeholder={
                        selectedType === 'PERCENTAGE'
                          ? '할인 퍼센트 (1-100)'
                          : '할인 금액 (원)'
                      }
                      value={
                        selectedType === 'PERCENTAGE'
                          ? value?.toString() || ''
                          : formatPrice(value) || ''
                      }
                      onChangeText={text => {
                        if (selectedType === 'PERCENTAGE') {
                          const numValue = parseInt(text) || 0;
                          onChange(numValue);
                        } else {
                          handlePriceInput(text, onChange);
                        }
                      }}
                      keyboardType='numeric'
                    />
                    <Text className='ml-2 text-gray-500 text-base'>
                      {selectedType === 'PERCENTAGE' ? '%' : '원'}
                    </Text>
                  </View>
                )}
              />
              {errors.value && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.value.message}
                </Text>
              )}
              <Text className='text-gray-400 text-xs mt-1 px-1'>
                {selectedType === 'PERCENTAGE'
                  ? '1-100 사이의 퍼센트를 입력하세요'
                  : '할인할 금액을 원 단위로 입력하세요'}
              </Text>
            </View>

            {/* 할인 설명 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                설명 (선택)
              </Text>
              <Controller
                control={control}
                name='description'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={clsx(
                      'border rounded-lg px-4 py-3',
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    )}
                    placeholder='할인에 대한 설명을 입력하세요'
                    value={value || ''}
                    onChangeText={onChange}
                    multiline
                    numberOfLines={2}
                  />
                )}
              />
              {errors.description && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.description.message}
                </Text>
              )}
            </View>

            {/* 활성화 여부 */}
            <View className='mb-4'>
              <Controller
                control={control}
                name='isActive'
                render={({ field: { onChange, value } }) => (
                  <TouchableOpacity
                    className='flex-row items-center'
                    onPress={() => onChange(!value)}
                  >
                    <View
                      className={clsx(
                        'w-5 h-5 rounded border-2 mr-3 items-center justify-center',
                        value
                          ? 'bg-primaryGreen border-primaryGreen'
                          : 'border-gray-300'
                      )}
                    >
                      {value && (
                        <Ionicons name='checkmark' size={14} color='white' />
                      )}
                    </View>
                    <Text className='text-gray-700 text-base'>
                      할인 활성화 (즉시 사용 가능)
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          </ScrollView>

          {/* 하단 버튼들 */}
          <View className='p-6 border-t border-gray-200'>
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
                className={clsx(
                  'flex-1 p-3 rounded-lg',
                  isValid ? 'bg-primaryGreen' : 'bg-gray-300'
                )}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
              >
                <Text
                  className={clsx(
                    'text-center font-semibold',
                    isValid ? 'text-white' : 'text-gray-500'
                  )}
                >
                  추가
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
