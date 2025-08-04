import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { KeypadProps } from '../../types';

export default function Keypad({
  onNumberPress,
  onBackspace,
  maxLength,
  currentInput = '',
}: KeypadProps) {
  const NumberButton = ({ number }: { number: string }) => {
    const isDisabled = maxLength ? currentInput.length >= maxLength : false;

    return (
      <Pressable
        onPress={() => !isDisabled && onNumberPress(number)}
        className={clsx('w-24 h-24 mx-4 my-2', {
          'opacity-50': isDisabled,
        })}
        disabled={isDisabled}
      >
        <View className='w-full h-full flex items-center justify-center'>
          <Text className='text-3xl font-normal text-gray-800'>{number}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className='items-center mb-8'>
      {/* 1-3 행 */}
      <View className='flex-row justify-center'>
        <NumberButton number='1' />
        <NumberButton number='2' />
        <NumberButton number='3' />
      </View>
      {/* 4-6 행 */}
      <View className='flex-row justify-center'>
        <NumberButton number='4' />
        <NumberButton number='5' />
        <NumberButton number='6' />
      </View>
      {/* 7-9 행 */}
      <View className='flex-row justify-center'>
        <NumberButton number='7' />
        <NumberButton number='8' />
        <NumberButton number='9' />
      </View>
      {/* 하단 행: 00, 0, 삭제 */}
      <View className='flex-row justify-center'>
        <Pressable
          onPress={() => {
            const isDisabled = maxLength
              ? currentInput.length >= maxLength - 1
              : false;
            if (!isDisabled) onNumberPress('00');
          }}
          className={`w-24 h-24 mx-4 my-2 ${
            maxLength && currentInput.length >= maxLength - 1
              ? 'opacity-50'
              : ''
          }`}
          disabled={maxLength ? currentInput.length >= maxLength - 1 : false}
        >
          <View className='w-full h-full flex items-center justify-center'>
            <Text className='text-3xl font-normal text-gray-800'>00</Text>
          </View>
        </Pressable>
        <NumberButton number='0' />
        <Pressable onPress={onBackspace} className='w-24 h-24 mx-4 my-2'>
          <View className='w-full h-full flex items-center justify-center'>
            <Text className='text-3xl font-normal text-gray-800'>←</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
