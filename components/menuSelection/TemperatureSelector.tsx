import clsx from 'clsx';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

/**
 * 온도 선택자 컴포넌트
 * - 음료의 온도(Hot/Iced)를 선택할 수 있는 컴포넌트
 */
import { Temperature, TemperatureSelectorProps } from '../../types';

export default function TemperatureSelector({
  selectedTemperature,
  setSelectedTemperature,
}: TemperatureSelectorProps) {
  // 온도 옵션 데이터
  const temperatures: {
    value: Temperature;
    label: string;
    emoji: string;
    price: number;
    priceLabel: string;
  }[] = [
    { value: 'HOT', label: 'HOT', emoji: '🔥', price: 0, priceLabel: '' },
    {
      value: 'ICE',
      label: 'ICE',
      emoji: '🧊',
      price: 500,
      priceLabel: '+500원',
    },
  ];

  return (
    <View className='mb-6'>
      {/* 섹션 제목 */}
      <Text className='text-xl font-semibold mb-3'>온도</Text>

      {/* 온도 선택 버튼 그리드 */}
      <View className='flex-row flex-wrap gap-5'>
        {temperatures.map(temp => (
          <TouchableOpacity
            key={temp.value}
            onPress={() => setSelectedTemperature(temp.value)}
            className={clsx(
              'h-[70px] w-[48%] flex items-center justify-center rounded-lg border',
              {
                'bg-[#475569] border-[#475569]':
                  selectedTemperature === temp.value,
                'bg-white border-gray-300': selectedTemperature !== temp.value,
              }
            )}
          >
            {/* 온도 옵션 정보 */}
            <View className='flex items-center gap-1'>
              <Text className='text-2xl'>{temp.emoji}</Text>
              <Text
                className={clsx('font-medium', {
                  'text-white': selectedTemperature === temp.value,
                  'text-gray-700': selectedTemperature !== temp.value,
                })}
              >
                {temp.label}
              </Text>
              {/* 가격 정보 표시 */}
              {temp.priceLabel && (
                <Text
                  className={clsx('text-xs', {
                    'text-white/80': selectedTemperature === temp.value,
                    'text-gray-500': selectedTemperature !== temp.value,
                  })}
                >
                  {temp.priceLabel}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
