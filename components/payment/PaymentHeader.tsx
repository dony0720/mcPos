import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Animated, Pressable } from 'react-native';

import { useButtonAnimation } from '../../hooks';
import { PaymentHeaderProps } from '../../types';

export default function PaymentHeader({ onBack }: PaymentHeaderProps) {
  const backAnimation = useButtonAnimation();

  return (
    // 상단 헤더 - 어두운 주문 요약 패널의 뒤로가기 버튼
    <Pressable
      onPressIn={backAnimation.onPressIn}
      onPressOut={backAnimation.onPressOut}
      onPress={onBack}
      className='self-start'
    >
      <Animated.View
        className='w-11 h-11 bg-white/10 rounded-xl flex items-center justify-center'
        style={{
          transform: [{ scale: backAnimation.scaleAnim }],
        }}
      >
        <Ionicons name='arrow-back' size={20} color='#fff' />
      </Animated.View>
    </Pressable>
  );
}
