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
  TouchableOpacity,
  View,
} from 'react-native';

import {
  staffFormSchema,
  type StaffFormSchemaType,
} from '../../schemas/staffSchema';
import type { Staff } from '../../types';

interface StaffEditModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (staffData: StaffFormSchemaType) => void;
  staff: Staff | null;
}

/**
 * 직원 편집 모달 컴포넌트
 * - 기존 직원 정보를 수정할 수 있는 폼 모달
 */
export default function StaffEditModal({
  visible,
  onClose,
  onConfirm,
  staff,
}: StaffEditModalProps) {
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

  // 모달이 열릴 때마다 폼 초기화 및 기존 데이터 설정
  useEffect(() => {
    if (visible && staff) {
      reset({
        name: staff.name,
      });
    }
  }, [visible, staff, reset]);

  const onSubmit = (data: StaffFormSchemaType) => {
    onConfirm(data);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl w-4/5 max-w-md p-6'>
          {/* 헤더 */}
          <View className='flex-row justify-between items-center mb-6'>
            <Text className='text-xl font-bold text-gray-800'>
              직원 정보 편집
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name='close-outline' size={24} color='#6B7280' />
            </TouchableOpacity>
          </View>

          {/* 직원명 입력 */}
          <View className='mb-6'>
            <Text className='text-sm font-medium text-gray-700 mb-2'>
              직원명 *
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

          {/* 하단 버튼들 */}
          <View>
            <View className='flex-row gap-3'>
              <Pressable
                className='flex-1 p-3 border border-gray-300 rounded-lg'
                onPress={handleClose}
              >
                <Text className='text-center text-gray-700 font-medium'>
                  취소
                </Text>
              </Pressable>
              <Pressable
                className={clsx(
                  'flex-1 p-3 rounded-lg',
                  isValid ? 'bg-blue-500' : 'bg-gray-300'
                )}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid}
              >
                <Text
                  className={clsx(
                    'text-center font-medium',
                    isValid ? 'text-white' : 'text-gray-500'
                  )}
                >
                  수정
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
