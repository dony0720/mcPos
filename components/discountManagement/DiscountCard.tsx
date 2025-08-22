import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Discount, DiscountType } from '../../types';

interface DiscountCardProps {
  discount: Discount;
  onEdit: (discount: Discount) => void;
  onDelete: (discount: Discount) => void;
  onToggleActive: (discount: Discount) => void;
}

/**
 * 할인 카드 컴포넌트
 * - 개별 할인 정보를 카드 형태로 표시
 */
export default function DiscountCard({
  discount,
  onEdit,
  onDelete,
  onToggleActive,
}: DiscountCardProps) {
  const getDiscountValueText = () => {
    if (discount.type === DiscountType.PERCENTAGE) {
      return `${discount.value}%`;
    }
    return `${discount.value.toLocaleString()}원`;
  };

  return (
    <View className='bg-white rounded-lg border border-gray-100 p-4 flex-1 relative'>
      {/* 액션 버튼들 - 오른쪽 상단 */}
      <View className='absolute top-2 right-2 flex-row gap-1'>
        <TouchableOpacity
          className='w-6 h-6 items-center justify-center'
          onPress={() => onToggleActive(discount)}
        >
          <Ionicons
            name={discount.isActive ? 'pause-outline' : 'play-outline'}
            size={14}
            color='#6B7280'
          />
        </TouchableOpacity>

        <TouchableOpacity
          className='w-6 h-6 items-center justify-center'
          onPress={() => onEdit(discount)}
        >
          <Ionicons name='pencil-outline' size={14} color='#6B7280' />
        </TouchableOpacity>

        <TouchableOpacity
          className='w-6 h-6 items-center justify-center'
          onPress={() => onDelete(discount)}
        >
          <Ionicons name='trash-outline' size={14} color='#6B7280' />
        </TouchableOpacity>
      </View>

      {/* 할인 정보 */}
      <View className='pr-12'>
        {/* 할인명 */}
        <Text className='text-gray-900 text-base font-semibold mb-1'>
          {discount.name}
        </Text>

        {/* 할인 타입 */}
        <Text className='text-gray-500 text-sm mb-3'>
          {discount.type === DiscountType.PERCENTAGE
            ? '비율 할인'
            : '금액 할인'}
        </Text>

        {/* 할인값과 상태 */}
        <View className='flex-row items-center justify-between'>
          <Text className='text-primaryGreen text-lg font-bold'>
            {getDiscountValueText()}
          </Text>

          <View
            className={`px-2 py-1 rounded-full ${
              discount.isActive ? 'bg-green-100' : 'bg-gray-100'
            }`}
          >
            <Text
              className={`text-xs font-medium ${
                discount.isActive ? 'text-green-700' : 'text-gray-700'
              }`}
            >
              {discount.isActive ? '활성' : '비활성'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
