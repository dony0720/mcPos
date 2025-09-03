import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { useAuthStore } from '../../stores/useAuthStore';

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
  {
    name: 'settings',
    title: '설정',
    icon: 'settings-outline' as const,
  },
] as const;

export default function TabLayout() {
  const { isAdminAuthenticated } = useAuthStore();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: isAdminAuthenticated
          ? {
              height: 100,
              paddingBottom: 15,
              paddingTop: 15,
              paddingHorizontal: 20,
              backgroundColor: COLORS.white,
              borderTopWidth: 1,
              borderTopColor: COLORS.gray[300],
            }
          : {
              display: 'none', // 관리자 모드가 아닐 때 탭바 숨김
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
