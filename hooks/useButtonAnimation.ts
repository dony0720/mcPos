import { useRef } from 'react';
import { Animated } from 'react-native';

export const useButtonAnimation = () => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return {
    scaleAnim,
    onPressIn,
    onPressOut,
  };
};
