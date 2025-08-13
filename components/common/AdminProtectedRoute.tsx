import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';

import { useAuthStore } from '../../stores';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({
  children,
}: AdminProtectedRouteProps) {
  const { isAdminAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAdminAuthenticated) {
      // 관리자 인증이 안된 경우 메뉴 페이지로 리다이렉트
      router.replace('/');
    }
  }, [isAdminAuthenticated, router]);

  // 인증되지 않은 경우 접근 차단 메시지 표시
  if (!isAdminAuthenticated) {
    return (
      <View className='flex-1 justify-center items-center bg-white'>
        <Text className='text-xl font-bold text-gray-600 mb-4'>
          관리자 권한이 필요합니다
        </Text>
        <Text className='text-gray-500'>
          메뉴 페이지에서 관리자 로그인을 해주세요
        </Text>
      </View>
    );
  }

  // 인증된 경우 자식 컴포넌트 렌더링
  return <>{children}</>;
}
