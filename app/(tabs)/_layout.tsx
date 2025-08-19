import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Tailwind 색상을 변수로 정의
const COLORS = {
  white: '#ffffff',
  primaryGreen: '#10B981',
  gray: {
    300: '#D1D5DB',
    500: '#6B7280',
  },
} as const;

// 탭 구성 데이터
const TAB_CONFIG = [
  { name: 'index', title: '메뉴', icon: 'restaurant-outline' as const },
  { name: 'ledger', title: '장부관리', icon: 'book-outline' as const },
  { name: 'cash', title: '시재관리', icon: 'cash-outline' as const },
  { name: 'history', title: '거래내역', icon: 'time-outline' as const },
] as const;

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 140,
          paddingBottom: Math.max(insets.bottom + 20, 45),
          paddingTop: 15,
          paddingHorizontal: 20,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray[300],
        },
        tabBarLabelStyle: {
          fontSize: 14,
          fontWeight: '600',
          marginTop: 6,
        },
        tabBarActiveTintColor: COLORS.primaryGreen,
        tabBarInactiveTintColor: COLORS.gray[500],
      }}
    >
      {TAB_CONFIG.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color }) => (
              <Ionicons name={icon} size={28} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
