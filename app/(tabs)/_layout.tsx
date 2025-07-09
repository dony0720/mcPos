import { Tabs } from 'expo-router';
import React from 'react';
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false, // 모든 탭의 헤더를 숨김
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          title: '메뉴',
        }}
      />
      <Tabs.Screen
        name='ledger'
        options={{
          title: '장부관리',
        }}
      />
      <Tabs.Screen
        name='cash'
        options={{
          title: '시재관리',
        }}
      />
    </Tabs>
  );
}
