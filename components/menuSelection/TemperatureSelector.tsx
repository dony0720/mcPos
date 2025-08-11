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
  const temperatures: { value: Temperature; label: string; emoji: string }[] = [
    { value: 'HOT', label: 'HOT', emoji: '🔥' },
    { value: 'ICE', label: 'ICE', emoji: '🧊' },
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
            <View className='flex items-center gap-2'>
              <Text className='text-2xl'>{temp.emoji}</Text>
              <Text
                className={clsx({
                  'text-white': selectedTemperature === temp.value,
                  'text-gray-700': selectedTemperature !== temp.value,
                })}
              >
                {temp.label}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
