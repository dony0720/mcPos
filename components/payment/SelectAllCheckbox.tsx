import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SelectAllCheckboxProps {
  isChecked: boolean;
  onCheckboxPress: () => void;
  title?: string;
}

export default function SelectAllCheckbox({
  isChecked,
  onCheckboxPress,
  title = '결제 정보',
}: SelectAllCheckboxProps) {
  return (
    <View className='w-full px-[5%] box-border mt-6'>
      <View className='flex flex-row justify-between items-center'>
        <Text className='text-3xl font-medium mb-6'>{title}</Text>
        <View className='flex flex-row items-center gap-2'>
          <Pressable onPress={onCheckboxPress}>
            <View
              className={`w-6 h-6 rounded flex items-center justify-center ${
                isChecked ? 'bg-black' : 'bg-white border-2 border-gray-400'
              }`}
            >
              {isChecked && (
                <Ionicons name='checkmark' size={16} color='white' />
              )}
            </View>
          </Pressable>
          <Text className='text-gray-600 text-2xl'>전체 선택</Text>
        </View>
      </View>
    </View>
  );
}
