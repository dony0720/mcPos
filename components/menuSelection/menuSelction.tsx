import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

interface PaginationButtonsProps {
  onUpPress?: () => void;
  onDownPress?: () => void;
}

export default function PaginationButtons({
  onUpPress,
  onDownPress,
}: PaginationButtonsProps) {
  const [isUpPressed, setIsUpPressed] = useState(false);
  const [isDownPressed, setIsDownPressed] = useState(false);

  const onUpButtonPressIn = () => {
    setIsUpPressed(true);
  };

  const onUpButtonPressOut = () => {
    setIsUpPressed(false);
    onUpPress?.();
  };

  const onDownButtonPressIn = () => {
    setIsDownPressed(true);
  };

  const onDownButtonPressOut = () => {
    setIsDownPressed(false);
    onDownPress?.();
  };

  return (
    <View role='group' className='w-[50px] h-full pl-0 box-border'>
      <Pressable
        role='button'
        onPressIn={onUpButtonPressIn}
        onPressOut={onUpButtonPressOut}
        className={`w-full h-1/2 rounded-t-lg border border-gray-300 flex justify-center items-center ${
          isUpPressed ? 'bg-gray-200' : 'bg-white'
        }`}
      >
        <Ionicons name='chevron-up' size={24} color='#6B7280' />
      </Pressable>
      <Pressable
        role='button'
        onPressIn={onDownButtonPressIn}
        onPressOut={onDownButtonPressOut}
        className={`w-full h-1/2 border rounded-b-lg border-gray-300 border-t-0 flex justify-center items-center ${
          isDownPressed ? 'bg-gray-200' : 'bg-white'
        }`}
      >
        <Ionicons name='chevron-down' size={24} color='#6B7280' />
      </Pressable>
    </View>
  );
}
