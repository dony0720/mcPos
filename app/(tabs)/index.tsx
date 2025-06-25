import React, { useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import McPosLogo from '../../assets/icon/mcPosLogo.svg';
import AdminModal from '../../components/AdminModal';
import CategoryTabs from '../../components/menuSelection/CategoryTabs';
import MenuGrid from '../../components/menuSelection/MenuGrid';
import OrderSection from '../../components/order/OrderSection';
import { useButtonAnimation } from '../../hooks/useButtonAnimation';

export default function MenuSelection() {
  const adminAnimation = useButtonAnimation();
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false);

  const handleAdminPress = () => {
    setIsAdminModalVisible(true);
  };

  const closeAdminModal = () => {
    setIsAdminModalVisible(false);
  };

  const handleAdminConfirm = (password: string) => {
    // 비밀번호 검증 로직
    if (password === 'admin123') {
      // 인증 성공 - 관리자 모드로 이동하거나 원하는 동작 수행
      console.log('관리자 인증 성공');
      setIsAdminModalVisible(false);
    } else {
      // 인증 실패
      console.log('비밀번호가 틀렸습니다');
      // 필요시 에러 메시지 표시
    }
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      {/* 헤더 */}
      <View className='w-full h-[80px] box-border px-[5%] mt-[25px] flex flex-row justify-between items-center '>
        <McPosLogo width={150} height={150} />
        <Pressable
          role='button'
          onPressIn={adminAnimation.onPressIn}
          onPressOut={adminAnimation.onPressOut}
          onPress={handleAdminPress}
        >
          <Animated.View
            className='flex justify-center items-center bg-primaryGreen rounded-lg w-[150px] h-[40px]'
            style={{
              transform: [{ scale: adminAnimation.scaleAnim }],
            }}
          >
            <Text className='text-white text-[16px] font-bold'>
              관리자 모드
            </Text>
          </Animated.View>
        </Pressable>
      </View>
      {/* 카테고리 탭 */}
      <CategoryTabs />
      {/* 메뉴 리스트 */}
      <MenuGrid />
      <Text className='w-full box-border px-[5%] text-2xl font-bold'>
        주문 내역
      </Text>
      {/* 주문 내역 */}
      <OrderSection />

      {/* 관리자 모달 */}
      <AdminModal
        visible={isAdminModalVisible}
        onClose={closeAdminModal}
        onConfirm={handleAdminConfirm}
      />
    </View>
  );
}
