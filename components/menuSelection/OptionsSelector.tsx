import clsx from 'clsx';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { MENU_OPTIONS } from '../../types';

/**
 * 옵션 선택자 컴포넌트
 * - 메뉴의 추가 옵션(샷추가, 시럽추가 등)을 선택할 수 있는 컴포넌트
 */

// Props 인터페이스
interface OptionsSelectorProps {
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

export default function OptionsSelector({
  selectedOptions,
  setSelectedOptions,
}: OptionsSelectorProps) {
  // 중앙화된 옵션 데이터 사용
  const options = MENU_OPTIONS;

  return (
    <View>
      {/* 섹션 제목 */}
      <Text className='text-xl font-semibold mb-3'>기타 옵션</Text>

      {/* 옵션 선택 버튼 그리드 */}
      <View className='flex-row flex-wrap gap-5'>
        {options.map((option, index) => {
          const isSelected = selectedOptions.includes(option.name);
          return (
            <TouchableOpacity
              key={option.name}
              onPress={() => {
                if (isSelected) {
                  setSelectedOptions(
                    selectedOptions.filter(item => item !== option.name)
                  );
                } else {
                  setSelectedOptions([...selectedOptions, option.name]);
                }
              }}
              className={clsx(
                'h-[70px] w-[48%] flex items-center justify-center rounded-lg border',
                {
                  'mb-3': index < 2,
                  'bg-[#475569] border-[#475569]': isSelected,
                  'bg-white border-gray-300': !isSelected,
                }
              )}
            >
              {/* 옵션 정보 */}
              <View className='flex items-center gap-2'>
                <Text
                  className={clsx({
                    'text-white': isSelected,
                    'text-gray-700': !isSelected,
                  })}
                >
                  {option.name}
                </Text>
                <Text
                  className={clsx({
                    'text-white': isSelected,
                    'text-gray-700': !isSelected,
                  })}
                >
                  +{option.price.toLocaleString()}원
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
