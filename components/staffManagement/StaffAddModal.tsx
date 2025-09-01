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

import { staffFormSchema, StaffFormSchemaType } from '../../schemas';

interface StaffAddModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (staffData: StaffFormSchemaType) => void;
}

/**
 * 직원 추가 모달 컴포넌트
 * - 새로운 직원을 추가할 수 있는 폼 모달
 */
export default function StaffAddModal({
  visible,
  onClose,
  onConfirm,
}: StaffAddModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<StaffFormSchemaType>({
    resolver: zodResolver(staffFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (visible) {
      reset();
    }
  }, [visible, reset]);

  const onSubmit = (data: StaffFormSchemaType) => {
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
        <View className='bg-white rounded-2xl w-4/5 h-[20%] max-w-md max-h-[600px]'>
          {/* 헤더 */}
          <View className='flex-row justify-between items-center p-6 pb-4'>
            <Text className='text-xl font-bold text-gray-800'>
              새 직원 추가
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name='close-outline' size={24} color='#6B7280' />
            </TouchableOpacity>
          </View>

          {/* 폼 컨텐츠 */}
          <ScrollView
            className='flex-1 px-6'
            showsVerticalScrollIndicator={false}
          >
            {/* 직원명 입력 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                직원명 *
              </Text>
              <Controller
                control={control}
                name='name'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={clsx(
                      'border rounded-lg px-4 py-3 bg-white',
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    )}
                    placeholder='직원명을 입력하세요'
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize='words'
                  />
                )}
              />
              {errors.name && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.name.message}
                </Text>
              )}
            </View>
          </ScrollView>

          {/* 하단 버튼들 */}
          <View className='p-6 pt-4'>
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
