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
        {options.map(option => {
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
              className={`h-[70px] flex items-center justify-center rounded-lg border flex-[0_0_45%] ${
                isSelected
                  ? 'bg-[#475569] border-[#475569]'
                  : 'bg-white border-gray-300'
              }`}
            >
              {/* 옵션 정보 */}
              <View className='flex items-center gap-2'>
                <Text
                  className={`${isSelected ? 'text-white' : 'text-gray-700'}`}
                >
                  {option}
                </Text>
                <Text
                  className={`${isSelected ? 'text-white' : 'text-gray-700'}`}
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
