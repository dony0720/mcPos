import React, { useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import McPosLogo from '../../assets/icon/mcPosLogo.svg';
import {
  AdminModal,
  CategoryTabs,
  MenuGrid,
  OrderSection,
} from '../../components';
import { useButtonAnimation, useModal } from '../../hooks';
import { useAuthStore, useOrderStore } from '../../stores';
import type { MenuCategory } from '../../types';

/**
 * 메뉴 선택 메인 화면 컴포넌트
 * - 카페 메뉴 선택, 주문 관리, 관리자 모드 접근을 담당하는 메인 화면
 */
export default function MenuSelection() {
  // 상태 및 애니메이션 관리
  const adminAnimation = useButtonAnimation(); // 관리자 버튼 애니메이션
  const { openModal, closeModal, isModalOpen } = useModal(); // 모달 관리

  // Zustand 스토어 사용
  const { orderItems, totalAmount, addItem, updateQuantity, removeItem } =
    useOrderStore();
  const { isAdminAuthenticated, login, logout } = useAuthStore();

  // 카테고리 상태 관리 (로컬 상태)
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategory>('COFFEE');

  // 이벤트 핸들러
  /**
   * 관리자 모드 버튼 클릭 핸들러
   * 관리자 모달을 열어 비밀번호 입력을 요청
   */
  const handleAdminPress = () => {
    if (isAdminAuthenticated) {
      // 이미 인증된 상태면 로그아웃
      logout();
    } else {
      // 인증되지 않은 상태면 로그인 모달 열기
      openModal('admin');
    }
  };

  /**
   * 관리자 모달 닫기 핸들러
   */
  const handleCloseAdminModal = () => {
    closeModal();
  };

  /**
   * 관리자 비밀번호 확인 핸들러
   * @param password - 입력된 비밀번호
   */
  const handleAdminConfirm = (password: string) => {
    const isValid = login(password);
    if (isValid) {
      closeModal();
    } else {
      return;
    }
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      <View className='flex-1 max-w-7xl mx-auto w-full'>
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
                {isAdminAuthenticated ? '로그아웃' : '관리자 모드'}
              </Text>
            </Animated.View>
          </Pressable>
        </View>

        {/* 메뉴 선택 섹션 */}
        {/* 음료 카테고리 탭 */}
        <CategoryTabs
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* 메뉴 아이템 그리드 - 선택된 카테고리의 메뉴들을 표시 */}
        <MenuGrid selectedCategory={selectedCategory} onAddItem={addItem} />

        {/* 주문 내역 섹션 */}
        {/* 주문 내역 제목 */}
        <Text className='w-full box-border px-[5%] text-2xl font-bold mt-4'>
          주문 내역
        </Text>

        {/* 선택된 메뉴들의 주문 내역 및 결제 버튼 */}
        <OrderSection
          items={orderItems}
          totalAmount={totalAmount}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
        />

        {/* 모달 섹션 - 관리자 인증을 위한 비밀번호 입력 모달 */}
        <AdminModal
          visible={isModalOpen('admin')}
          onClose={handleCloseAdminModal}
          onConfirm={handleAdminConfirm}
        />
      </View>
    </View>
  );
}
