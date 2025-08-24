import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { useCategoryStore } from '@/stores';

import { menuFormSchema } from '../../schemas';
import type { MenuEditModalProps, MenuFormData } from '../../types';
import {
  formatPrice,
  handleImageSelection,
  handlePriceInput,
  ImageToast,
} from '../../utils';

/**
 * 메뉴 편집 모달 컴포넌트
 * - 기존 메뉴 정보를 수정할 수 있는 폼 모달
 */
export default function MenuEditModal({
  visible,
  onClose,
  onConfirm,
  menuItem,
}: MenuEditModalProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const { categories } = useCategoryStore();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<MenuFormData>({
    resolver: zodResolver(menuFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      price: 0,
      category: 'COFFEE',
      image: undefined,
    },
  });

  const selectedCategory = watch('category');

  // 모달이 열릴 때마다 폼을 메뉴 데이터로 초기화
  useEffect(() => {
    if (visible && menuItem) {
      setValue('name', menuItem.name);
      setValue('price', menuItem.price);
      setValue('category', menuItem.category);
      setValue('image', menuItem.image);
      setShowCategoryDropdown(false);
    } else if (visible) {
      reset();
      setShowCategoryDropdown(false);
    }
  }, [visible, menuItem, setValue, reset]);

  const onSubmit = (data: MenuFormData) => {
    onConfirm(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    setShowCategoryDropdown(false);
    onClose();
  };

  const handleCategorySelect = (category: string) => {
    setValue('category', category as MenuFormData['category'], {
      shouldValidate: true,
    });
    setShowCategoryDropdown(false);
  };

  const selectedCategoryLabel = categories.find(
    category => category.id === selectedCategory
  )?.name;

  if (!menuItem) return null;

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl w-4/5 h-4/5 max-w-lg max-h-[1500px]'>
          {/* 헤더 */}
          <View className='p-6 border-b border-gray-200'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-xl font-bold text-gray-800'>메뉴 편집</Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name='close-outline' size={24} color='#6B7280' />
              </TouchableOpacity>
            </View>
            <Text className='text-sm text-gray-500 mt-1'>
              "{menuItem.name}" 메뉴를 편집합니다
            </Text>
          </View>

          {/* 폼 내용 */}
          <ScrollView
            className='flex-1 p-6'
            showsVerticalScrollIndicator={false}
          >
            {/* 메뉴명 입력 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                메뉴명 *
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
                    placeholder='메뉴명을 입력하세요'
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

            {/* 가격 입력 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                가격 *
              </Text>
              <Controller
                control={control}
                name='price'
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className={clsx(
                      'border rounded-lg px-4 py-3',
                      errors.price ? 'border-red-500' : 'border-gray-300'
                    )}
                    placeholder='가격을 입력하세요'
                    value={formatPrice(value)}
                    onChangeText={text => handlePriceInput(text, onChange)}
                    keyboardType='numeric'
                  />
                )}
              />
              {errors.price && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.price.message}
                </Text>
              )}
            </View>

            {/* 카테고리 선택 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                카테고리 *
              </Text>
              <TouchableOpacity
                className={clsx(
                  'border rounded-lg px-4 py-3 flex-row justify-between items-center',
                  errors.category ? 'border-red-500' : 'border-gray-300',
                  showCategoryDropdown && 'rounded-b-none border-b-0'
                )}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text
                  className={clsx(
                    selectedCategory ? 'text-gray-800' : 'text-gray-400'
                  )}
                >
                  {selectedCategoryLabel || '카테고리를 선택하세요'}
                </Text>
                <Ionicons
                  name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color='#6B7280'
                />
              </TouchableOpacity>

              {/* 드롭다운 목록 */}
              {showCategoryDropdown && (
                <View className='border border-t-0 border-gray-300 rounded-b-lg bg-white'>
                  {categories.map((category, index) => (
                    <TouchableOpacity
                      key={category.id}
                      className={clsx(
                        'px-4 py-4',
                        index !== categories.length - 1 &&
                          'border-b border-gray-100'
                      )}
                      onPress={() => handleCategorySelect(category.id)}
                    >
                      <Text className='text-gray-800 text-base'>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {errors.category && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.category.message}
                </Text>
              )}
            </View>

            {/* 이미지 선택 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                메뉴 이미지
              </Text>
              <Controller
                control={control}
                name='image'
                render={({ field: { onChange: _onChange, value } }) => (
                  <TouchableOpacity
                    className='border border-dashed border-gray-300 rounded-lg items-center justify-center bg-gray-50 aspect-square'
                    onPress={async () => {
                      const result = await handleImageSelection();
                      if (result.success && result.uri) {
                        setValue('image', result.uri, { shouldValidate: true });
                        // 이미지 선택 성공 Toast 표시
                        if (result.source === 'camera') {
                          ImageToast.cameraSuccess();
                        } else if (result.source === 'gallery') {
                          ImageToast.gallerySuccess();
                        }
                      }
                    }}
                  >
                    {value ? (
                      <View className='flex-1 w-full relative'>
                        <Image
                          source={{ uri: value }}
                          className='flex-1 w-full rounded-lg'
                          resizeMode='cover'
                        />
                        <View className='absolute inset-0 bg-black/20 rounded-lg items-center justify-center'>
                          <View className='bg-white/90 rounded-full p-2'>
                            <Ionicons
                              name='camera-outline'
                              size={20}
                              color='#6B7280'
                            />
                          </View>
                          <Text className='text-white text-xs font-medium mt-2 text-center bg-black/50 px-2 py-1 rounded'>
                            탭하여 변경
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <View className='items-center justify-center'>
                        <Ionicons
                          name='camera-outline'
                          size={32}
                          color='#9CA3AF'
                        />
                        <Text className='text-gray-500 text-sm font-medium mt-2 text-center'>
                          이미지 선택
                        </Text>
                        <Text className='text-gray-400 text-xs mt-1 text-center'>
                          탭하여 갤러리에서 이미지를 선택하세요
                        </Text>
                      </View>
                    )}
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
                  수정
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
      <Toast />
    </Modal>
  );
}
