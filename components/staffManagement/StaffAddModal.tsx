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

import { staffFormSchema, StaffFormSchemaType } from '../../schemas';
import { useStaffStore } from '../../stores';

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
  const { staffs } = useStaffStore();
  const [duplicateError, setDuplicateError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<StaffFormSchemaType>({
    resolver: zodResolver(staffFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      phone: '',
    },
  });

  // 폼 데이터 실시간 감시
  const watchedName = watch('name');
  const watchedPhone = watch('phone');

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (visible) {
      reset();
      setDuplicateError(null);
    }
  }, [visible, reset]);

  // 실시간 중복 검증
  useEffect(() => {
    if (watchedName && watchedPhone) {
      const isDuplicate = staffs.some(
        staff =>
          staff.name.trim().toLowerCase() ===
            watchedName.trim().toLowerCase() && staff.phone === watchedPhone
      );

      if (isDuplicate) {
        setDuplicateError(
          '동일한 이름과 전화번호를 가진 직원이 이미 존재합니다.'
        );
      } else {
        setDuplicateError(null);
      }
    } else {
      setDuplicateError(null);
    }
  }, [watchedName, watchedPhone, staffs]);

  const onSubmit = (data: StaffFormSchemaType) => {
    // 최종 중복 검증
    const isDuplicate = staffs.some(
      staff =>
        staff.name.trim().toLowerCase() === data.name.trim().toLowerCase() &&
        staff.phone === data.phone
    );

    if (isDuplicate) {
      setDuplicateError(
        '동일한 이름과 전화번호를 가진 직원이 이미 존재합니다.'
      );
      return;
    }

    onConfirm(data);
    reset();
    setDuplicateError(null);
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl w-4/5 h-[40%] max-w-md max-h-[600px]'>
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

            {/* 전화번호 입력 */}
            <View className='mb-6'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                전화번호 *
              </Text>
              <Controller
                control={control}
                name='phone'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={clsx(
                      'border rounded-lg px-4 py-3 bg-white',
                      errors.phone ? 'border-red-500' : 'border-gray-300'
                    )}
                    placeholder='010-1234-5678'
                    value={value}
                    onChangeText={onChange}
                    keyboardType='phone-pad'
                  />
                )}
              />
              {errors.phone && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.phone.message}
                </Text>
              )}
            </View>

            {/* 중복 검증 에러 표시 */}
            {duplicateError && (
              <View className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                <View className='flex-row items-center'>
                  <Ionicons name='warning' size={16} color='#EF4444' />
                  <Text className='text-red-600 text-sm ml-2 flex-1'>
                    {duplicateError}
                  </Text>
                </View>
              </View>
            )}
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
                  isValid && !duplicateError ? 'bg-primaryGreen' : 'bg-gray-300'
                )}
                onPress={handleSubmit(onSubmit)}
                disabled={!isValid || !!duplicateError}
              >
                <Text
                  className={clsx(
                    'text-center font-semibold',
                    isValid && !duplicateError ? 'text-white' : 'text-gray-500'
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
