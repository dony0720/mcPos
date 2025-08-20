import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import React, { useEffect } from 'react';
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
  categoryFormSchema,
  type CategoryFormSchemaType,
} from '../../schemas/categorySchema';

interface CategoryAddModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (categoryData: CategoryFormSchemaType) => void;
}

/**
 * 카테고리 추가 모달 컴포넌트
 * - 새로운 카테고리를 추가할 수 있는 폼 모달
 */
export default function CategoryAddModal({
  visible,
  onClose,
  onConfirm,
}: CategoryAddModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CategoryFormSchemaType>({
    resolver: zodResolver(categoryFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      displayOrder: 1,
    },
  });

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible, reset]);

  const onSubmit = (data: CategoryFormSchemaType) => {
    onConfirm(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl w-4/5 h-3/5 max-w-lg max-h-[1500px]'>
          {/* 헤더 */}
          <View className='p-6 border-b border-gray-200'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-xl font-bold text-gray-800'>
                새 카테고리 추가
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name='close-outline' size={24} color='#6B7280' />
              </TouchableOpacity>
            </View>
            <Text className='text-sm text-gray-500 mt-1'>
              새로운 카테고리를 등록합니다
            </Text>
          </View>

          {/* 폼 내용 */}
          <ScrollView
            className='flex-1 p-6'
            showsVerticalScrollIndicator={false}
          >
            {/* 카테고리명 입력 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                카테고리명 *
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
                    placeholder='카테고리명을 입력하세요'
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

            {/* 표시순서 입력 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                표시순서 *
              </Text>
              <Controller
                control={control}
                name='displayOrder'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={clsx(
                      'border rounded-lg px-4 py-3',
                      errors.displayOrder ? 'border-red-500' : 'border-gray-300'
                    )}
                    placeholder='표시순서를 입력하세요 (1-99)'
                    value={value?.toString() || ''}
                    onChangeText={text => {
                      const numValue = parseInt(text) || 0;
                      onChange(numValue);
                    }}
                    keyboardType='numeric'
                  />
                )}
              />
              {errors.displayOrder && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.displayOrder.message}
                </Text>
              )}
              <Text className='text-gray-400 text-xs mt-1 px-1'>
                낮은 숫자일수록 앞에 표시됩니다
              </Text>
            </View>

            {/* 안내 메시지 */}
            <View className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
              <View className='flex-row items-start gap-3'>
                <Ionicons name='information-circle' size={20} color='#3B82F6' />
                <View className='flex-1'>
                  <Text className='text-blue-800 text-sm font-medium mb-1'>
                    카테고리 추가 안내
                  </Text>
                  <Text className='text-blue-700 text-xs leading-4'>
                    • 카테고리명은 20자 이하로 입력해주세요{'\n'}• 표시순서는
                    메뉴 선택 화면의 탭 순서를 결정합니다{'\n'}• 추가된
                    카테고리는 언제든 수정/삭제할 수 있습니다
                  </Text>
                </View>
              </View>
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
