import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Modal,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { type AdminLoginFormData, adminLoginSchema } from '../schemas';

interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function AdminModal({
  visible,
  onClose,
  onConfirm,
}: AdminModalProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  });

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (visible) {
      reset();
      setShowPassword(false); // 비밀번호 가시성도 초기화
    }
  }, [visible, reset]);

  const onSubmit = (data: AdminLoginFormData) => {
    onConfirm(data.password);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      animationType='fade'
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl p-6 w-4/5 max-w-md'>
          <Text className='text-xl font-bold text-center mb-4'>
            관리자 인증
          </Text>
          <Text className='text-gray-600 text-center mb-6'>
            관리자 권한이 필요한 작업을 수행할 수 있습니다.
          </Text>

          {/* 비밀번호 입력창 */}
          <View className='relative'>
            <Controller
              control={control}
              name='password'
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className={`border rounded-lg px-4 py-3 pr-12 mb-2 ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='비밀번호를 입력하세요'
                  secureTextEntry={!showPassword}
                  value={value}
                  onChangeText={onChange}
                  autoFocus={true}
                />
              )}
            />

            {/* Eye 아이콘 버튼 */}
            <TouchableOpacity
              className='absolute right-3 top-3'
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color='#6B7280'
              />
            </TouchableOpacity>
          </View>

          {/* 에러 메시지 */}
          {errors.password && (
            <Text className='text-red-500 text-sm mb-4 px-1'>
              {errors.password.message}
            </Text>
          )}

          {/* 버튼들 */}
          <View className='flex-row gap-3'>
            <Pressable
              role='button'
              className='flex-1 p-3 border border-gray-300 rounded-lg'
              onPress={handleClose}
            >
              <Text className='text-gray-600 text-center font-semibold'>
                취소
              </Text>
            </Pressable>

            <Pressable
              role='button'
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
                확인
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
