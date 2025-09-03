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

import { menuFormSchema, menuOptionSchema } from '../../schemas';
import type { MenuAddModalProps, MenuFormData, MenuOption } from '../../types';
import {
  formatPrice,
  handleImageSelection,
  handlePriceInput,
  ImageToast,
} from '../../utils';

// 옵션 폼용 타입
type OptionFormData = {
  name: string;
  price: number;
};

/**
 * 메뉴 추가 모달 컴포넌트
 * - 새로운 메뉴를 추가할 수 있는 폼 모달
 */
export default function MenuAddModal({
  visible,
  onClose,
  onConfirm,
}: MenuAddModalProps) {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [availableOptions, setAvailableOptions] = useState<MenuOption[]>([]);
  const [showAddOption, setShowAddOption] = useState(false);
  const { categories } = useCategoryStore();
  // 메인 메뉴 폼
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
      categories: [],
      temperatureRestriction: undefined,
      image: undefined,
      availableOptions: [],
    },
  });

  // 옵션 추가 폼
  const {
    control: optionControl,
    handleSubmit: handleOptionSubmit,
    reset: resetOption,
    formState: { errors: optionErrors, isValid: isOptionValid },
  } = useForm<OptionFormData>({
    resolver: zodResolver(menuOptionSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      price: 0,
    },
  });

  const selectedCategories = watch('categories');

  // 모달이 열릴 때마다 폼 초기화
  useEffect(() => {
    if (visible) {
      reset();
      resetOption();
      setShowCategoryDropdown(false);
      setAvailableOptions([]);
      setShowAddOption(false);
    }
  }, [visible, reset, resetOption]);

  const onSubmit = (data: MenuFormData) => {
    const menuData = {
      ...data,
      availableOptions,
    };
    onConfirm(menuData);
    reset();
    setAvailableOptions([]);
    onClose();
  };

  const handleClose = () => {
    reset();
    resetOption();
    setShowCategoryDropdown(false);
    setAvailableOptions([]);
    setShowAddOption(false);
    onClose();
  };

  const handleCategoryToggle = (categoryId: string) => {
    const currentCategories = selectedCategories || [];
    const isSelected = currentCategories.includes(categoryId);

    let newCategories: string[];
    if (isSelected) {
      // 이미 선택된 경우 제거
      newCategories = currentCategories.filter(id => id !== categoryId);
    } else {
      // 선택되지 않은 경우 추가
      newCategories = [...currentCategories, categoryId];
    }

    setValue('categories', newCategories, {
      shouldValidate: true,
    });
  };

  const getSelectedCategoriesLabel = () => {
    if (!selectedCategories || selectedCategories.length === 0) {
      return '카테고리를 선택하세요';
    }

    const selectedNames = selectedCategories
      .map(id => categories.find(cat => cat.id === id)?.name)
      .filter(Boolean);

    if (selectedNames.length === 1) {
      return selectedNames[0];
    } else if (selectedNames.length <= 3) {
      return selectedNames.join(', ');
    } else {
      return `${selectedNames[0]} 외 ${selectedNames.length - 1}개`;
    }
  };

  // 옵션 추가 함수 (Controller 사용)
  const handleAddOption = (data: OptionFormData) => {
    // 중복 검증
    if (availableOptions.some(option => option.name === data.name.trim())) {
      // 중복 에러를 수동으로 설정
      Toast.show({
        type: 'error',
        text1: '이미 존재하는 옵션명입니다',
      });
      return;
    }

    const newOption: MenuOption = {
      name: data.name.trim(),
      price: data.price,
    };

    setAvailableOptions([...availableOptions, newOption]);
    resetOption();
    setShowAddOption(false);
  };

  // 옵션 삭제 함수
  const handleRemoveOption = (index: number) => {
    setAvailableOptions(availableOptions.filter((_, i) => i !== index));
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className='flex-1 justify-center items-center bg-black/50'>
        <View className='bg-white rounded-2xl w-4/5 h-4/5  max-w-lg max-h-[1500px]'>
          {/* 헤더 */}
          <View className='p-6 border-b border-gray-200'>
            <View className='flex-row justify-between items-center'>
              <Text className='text-xl font-bold text-gray-800'>
                새 메뉴 추가
              </Text>
              <TouchableOpacity onPress={handleClose}>
                <Ionicons name='close-outline' size={24} color='#6B7280' />
              </TouchableOpacity>
            </View>
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

            {/* 카테고리 선택 (다중 선택) */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-2'>
                카테고리
              </Text>
              <TouchableOpacity
                className={clsx(
                  'border rounded-lg px-4 py-3 flex-row justify-between items-center',
                  errors.categories ? 'border-red-500' : 'border-gray-300',
                  showCategoryDropdown && 'rounded-b-none border-b-0'
                )}
                onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <Text
                  className={clsx(
                    selectedCategories && selectedCategories.length > 0
                      ? 'text-gray-800'
                      : 'text-gray-400'
                  )}
                >
                  {getSelectedCategoriesLabel()}
                </Text>
                <Ionicons
                  name={showCategoryDropdown ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color='#6B7280'
                />
              </TouchableOpacity>

              {/* 드롭다운 목록 (체크박스 형태) */}
              {showCategoryDropdown && (
                <View className='border border-t-0 border-gray-300 rounded-b-lg bg-white'>
                  {categories.map((category, index) => {
                    const isSelected =
                      selectedCategories?.includes(category.id) || false;
                    return (
                      <TouchableOpacity
                        key={category.id}
                        className={clsx(
                          'px-4 py-4 flex-row items-center justify-between',
                          index !== categories.length - 1 &&
                            'border-b border-gray-100',
                          isSelected && 'bg-green-50'
                        )}
                        onPress={() => handleCategoryToggle(category.id)}
                      >
                        <Text
                          className={clsx(
                            'text-base',
                            isSelected
                              ? 'text-primaryGreen font-medium'
                              : 'text-gray-800'
                          )}
                        >
                          {category.name}
                        </Text>
                        {isSelected && (
                          <Ionicons
                            name='checkmark-circle'
                            size={20}
                            color='#10B981'
                          />
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {errors.categories && (
                <Text className='text-red-500 text-sm mt-1 px-1'>
                  {errors.categories.message}
                </Text>
              )}
            </View>

            {/* 온도 제한 옵션 */}
            <View className='mb-4'>
              <Text className='text-sm font-medium text-gray-700 mb-3'>
                온도 제한 (선택사항)
              </Text>
              <Controller
                control={control}
                name='temperatureRestriction'
                render={({ field: { onChange, value } }) => (
                  <View className='flex-row gap-4'>
                    {/* HOT ONLY */}
                    <TouchableOpacity
                      className={clsx(
                        'flex-1 border rounded-lg px-4 py-3 flex-row items-center',
                        value === 'HOT_ONLY'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300'
                      )}
                      onPress={() =>
                        onChange(value === 'HOT_ONLY' ? undefined : 'HOT_ONLY')
                      }
                    >
                      <View
                        className={clsx(
                          'w-5 h-5 rounded border-2 mr-3 items-center justify-center',
                          value === 'HOT_ONLY'
                            ? 'border-orange-500 bg-orange-500'
                            : 'border-gray-300'
                        )}
                      >
                        {value === 'HOT_ONLY' && (
                          <Text className='text-white text-xs font-bold'>
                            ✓
                          </Text>
                        )}
                      </View>
                      <View className='flex-row items-center'>
                        <Text className='mr-1'>🔥</Text>
                        <Text
                          className={clsx(
                            'text-sm font-medium',
                            value === 'HOT_ONLY'
                              ? 'text-orange-500'
                              : 'text-gray-700'
                          )}
                        >
                          HOT ONLY
                        </Text>
                      </View>
                    </TouchableOpacity>

                    {/* ICE ONLY */}
                    <TouchableOpacity
                      className={clsx(
                        'flex-1 border rounded-lg px-4 py-3 flex-row items-center',
                        value === 'ICE_ONLY'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300'
                      )}
                      onPress={() =>
                        onChange(value === 'ICE_ONLY' ? undefined : 'ICE_ONLY')
                      }
                    >
                      <View
                        className={clsx(
                          'w-5 h-5 rounded border-2 mr-3 items-center justify-center',
                          value === 'ICE_ONLY'
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        )}
                      >
                        {value === 'ICE_ONLY' && (
                          <Text className='text-white text-xs font-bold'>
                            ✓
                          </Text>
                        )}
                      </View>
                      <View className='flex-row items-center'>
                        <Text className='mr-1'>🧊</Text>
                        <Text
                          className={clsx(
                            'text-sm font-medium',
                            value === 'ICE_ONLY'
                              ? 'text-blue-500'
                              : 'text-gray-700'
                          )}
                        >
                          ICE ONLY
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              />
              <Text className='text-xs text-gray-500 mt-2'>
                선택하지 않으면 HOT, ICE 모두 선택 가능합니다.
              </Text>
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

            {/* 메뉴 옵션 관리 */}
            <View className='mb-4'>
              <View className='flex-row justify-between items-center mb-2'>
                <Text className='text-sm font-medium text-gray-700'>
                  메뉴 옵션
                </Text>
                <TouchableOpacity
                  className='bg-primaryGreen px-3 py-1 rounded-md'
                  onPress={() => setShowAddOption(true)}
                >
                  <Text className='text-white text-sm font-medium'>
                    옵션 추가
                  </Text>
                </TouchableOpacity>
              </View>
              {/* 옵션 추가 폼 */}
              {showAddOption && (
                <View className='border border-gray-200 rounded-lg p-4 bg-gray-50'>
                  <Text className='text-sm font-medium text-gray-700 mb-3'>
                    새 옵션 추가
                  </Text>

                  {/* 옵션명 입력 */}
                  <View className='mb-3'>
                    <Text className='text-xs text-gray-600 mb-1'>옵션명</Text>
                    <Controller
                      control={optionControl}
                      name='name'
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          className={clsx(
                            'border rounded-lg px-3 py-2 bg-white',
                            optionErrors.name
                              ? 'border-red-500'
                              : 'border-gray-300'
                          )}
                          placeholder='옵션명 입력'
                          value={value}
                          onChangeText={onChange}
                          autoCapitalize='none'
                        />
                      )}
                    />
                    {optionErrors.name && (
                      <Text className='text-red-500 text-xs mt-1'>
                        {optionErrors.name.message}
                      </Text>
                    )}
                  </View>

                  {/* 옵션 가격 입력 */}
                  <View className='mb-3'>
                    <Text className='text-xs text-gray-600 mb-1'>
                      추가 가격
                    </Text>
                    <Controller
                      control={optionControl}
                      name='price'
                      render={({ field: { onChange, value } }) => (
                        <TextInput
                          className={clsx(
                            'border rounded-lg px-3 py-2 bg-white',
                            optionErrors.price
                              ? 'border-red-500'
                              : 'border-gray-300'
                          )}
                          placeholder='추가 가격 입력'
                          value={formatPrice(value)}
                          onChangeText={text =>
                            handlePriceInput(text, onChange)
                          }
                          keyboardType='numeric'
                        />
                      )}
                    />
                    {optionErrors.price && (
                      <Text className='text-red-500 text-xs mt-1'>
                        {optionErrors.price.message}
                      </Text>
                    )}
                  </View>

                  {/* 버튼들 */}
                  <View className='flex-row gap-2'>
                    <TouchableOpacity
                      className='flex-1 bg-gray-300 py-2 rounded-lg'
                      onPress={() => {
                        setShowAddOption(false);
                        resetOption();
                      }}
                    >
                      <Text className='text-gray-700 text-center font-medium'>
                        취소
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={clsx(
                        'flex-1 py-2 rounded-lg',
                        isOptionValid ? 'bg-primaryGreen' : 'bg-gray-300'
                      )}
                      onPress={handleOptionSubmit(handleAddOption)}
                      disabled={!isOptionValid}
                    >
                      <Text
                        className={clsx(
                          'text-center font-medium',
                          isOptionValid ? 'text-white' : 'text-gray-500'
                        )}
                      >
                        추가
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {/* 옵션 목록 */}
              {availableOptions.length > 0 && (
                <View className='flex-1 gap-2'>
                  {availableOptions.map((option, index) => (
                    <View
                      key={index}
                      className='flex-row justify-between items-center p-3 border border-gray-300 rounded-lg'
                    >
                      <View>
                        <Text className='text-gray-800 font-medium'>
                          {option.name}
                        </Text>
                        <Text className='text-gray-500 text-sm'>
                          +{formatPrice(option.price)}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleRemoveOption(index)}
                        className='p-1'
                      >
                        <Ionicons name='close' size={20} color='#EF4444' />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
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
      <Toast />
    </Modal>
  );
}
