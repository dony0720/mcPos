import '../global.css';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ToastProvider } from '../components';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('../assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-SemiBold': require('../assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('../assets/fonts/Pretendard-Bold.otf'),
  });

  if (!fontsLoaded) {
    return <View className='flex-1 bg-white' />;
  }

  return (
    <GestureHandlerRootView className='flex-1'>
      <Stack
        screenOptions={{
          headerShown: false, // 모든 화면의 헤더를 숨김
          gestureEnabled: false, // 제스처 비활성화
        }}
      >
        <Stack.Screen
          name='index'
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name='(tabs)'
          options={{
            headerShown: false,
            gestureEnabled: false,
            headerBackVisible: false,
          }}
        />
        {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
      </Stack>
      <ToastProvider />
    </GestureHandlerRootView>
  );
}
