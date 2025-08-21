import '../global.css';

import { Stack } from 'expo-router';
import React from 'react';

import { ToastProvider } from '../components';

export default function RootLayout() {
  return (
    <>
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
    </>
  );
}
