import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');
const isTablet = width >= 768 || height >= 1024;

// Tailwind 색상을 변수로 정의
const COLORS = {
  white: '#ffffff',
  primaryGreen: '#10B981',
  gray: {
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
  },
  black: '#000000',
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
          height: isTablet ? 140 : 100,
          paddingBottom: Math.max(insets.bottom + 20, isTablet ? 45 : 30),
          paddingTop: 15,
          paddingHorizontal: isTablet ? 20 : 0,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.gray[300],
          elevation: 8,
          shadowColor: COLORS.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: isTablet ? 14 : 12,
          fontWeight: '600',
          marginTop: isTablet ? 6 : 4,
        },
        tabBarActiveTintColor: COLORS.primaryGreen,
        tabBarInactiveTintColor: COLORS.gray[500],
        tabBarIconStyle: {
          marginTop: isTablet ? 2 : 0,
        },
      }}
    >
      {TAB_CONFIG.map(({ name, title, icon }) => (
        <Tabs.Screen
          key={name}
          name={name}
          options={{
            title,
            tabBarIcon: ({ color, size }) => (
              <Ionicons name={icon} size={isTablet ? 28 : size} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
