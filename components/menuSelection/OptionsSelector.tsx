import clsx from 'clsx';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
  // 옵션 데이터
  const options = ['샷추가', '시럽추가', '휘핑크림'];

  return (
    <View>
      {/* 섹션 제목 */}
      <Text className='text-xl font-semibold mb-3'>기타 옵션</Text>

      {/* 옵션 선택 버튼 그리드 */}
      <View className='flex-row flex-wrap gap-5'>
        {options.map((option, index) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => {
                if (isSelected) {
                  setSelectedOptions(
                    selectedOptions.filter(item => item !== option)
                  );
                } else {
                  setSelectedOptions([...selectedOptions, option]);
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
                  {option}
                </Text>
                <Text
                  className={clsx({
                    'text-white': isSelected,
                    'text-gray-700': !isSelected,
                  })}
                >
                  +500원
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
