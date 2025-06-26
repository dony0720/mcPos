import React, { useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import McPosLogo from '../../assets/icon/mcPosLogo.svg';
import AdminModal from '../../components/AdminModal';
import CategoryTabs from '../../components/menuSelection/CategoryTabs';
import MenuGrid from '../../components/menuSelection/MenuGrid';
import OrderSection from '../../components/order/OrderSection';
import { useButtonAnimation } from '../../hooks/useButtonAnimation';

/**
 * 메뉴 선택 메인 화면 컴포넌트
 * - 카페 메뉴 선택, 주문 관리, 관리자 모드 접근을 담당하는 메인 화면
 */
export default function MenuSelection() {
  // 상태 및 애니메이션 관리
  const adminAnimation = useButtonAnimation(); // 관리자 버튼 애니메이션
  const [isAdminModalVisible, setIsAdminModalVisible] = useState(false); // 관리자 모달 표시 상태

  // 이벤트 핸들러
  /**
   * 관리자 모드 버튼 클릭 핸들러
   * 관리자 모달을 열어 비밀번호 입력을 요청
   */
  const handleAdminPress = () => {
    setIsAdminModalVisible(true);
  };

  /**
   * 관리자 모달 닫기 핸들러
   */
  const closeAdminModal = () => {
    setIsAdminModalVisible(false);
  };

  /**
   * 관리자 비밀번호 확인 핸들러
   * @param password - 입력된 비밀번호
   */
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
      {/* 헤더 섹션 - 로고와 관리자 모드 버튼이 포함된 상단 헤더 */}
      <View className='w-full h-[80px] box-border px-[5%] mt-[25px] flex flex-row justify-between items-center '>
        {/* 로고 */}
        <McPosLogo width={150} height={150} />

        {/* 관리자 모드 버튼 */}
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

      {/* 메뉴 선택 섹션 */}
      {/* 음료 카테고리 탭 (HOT/COLD/DESSERT 등) */}
      <CategoryTabs />

      {/* 메뉴 아이템 그리드 - 선택된 카테고리의 메뉴들을 표시 */}
      <MenuGrid />

      {/* 주문 내역 섹션 */}
      {/* 주문 내역 제목 */}
      <Text className='w-full box-border px-[5%] text-2xl font-bold'>
        주문 내역
      </Text>

      {/* 선택된 메뉴들의 주문 내역 및 결제 버튼 */}
      <OrderSection />

      {/* 모달 섹션 - 관리자 인증을 위한 비밀번호 입력 모달 */}
      <AdminModal
        visible={isAdminModalVisible}
        onClose={closeAdminModal}
        onConfirm={handleAdminConfirm}
      />
    </View>
  );
}
