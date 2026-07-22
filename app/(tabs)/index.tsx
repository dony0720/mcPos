import React, { useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';

import McPos from '../../assets/icon/McPos.svg';
import {
  AdminModal,
  CategoryTabs,
  MenuGrid,
  OrderSection,
} from '../../components';
import { useButtonAnimation, useModal } from '../../hooks';
import { useAuthStore, useOrderStore } from '../../stores';

/**
 * 메뉴 선택 메인 화면 컴포넌트
 * - 카페 메뉴 선택, 주문 관리, 관리자 모드 접근을 담당하는 메인 화면
 */
export default function MenuSelection() {
  // 상태 및 애니메이션 관리
  const adminAnimation = useButtonAnimation(); // 관리자 버튼 애니메이션
  const { openModal, closeModal, isModalOpen } = useModal(); // 모달 관리

  // Zustand 스토어 사용
  const {
    orderItems,
    itemCount,
    totalAmount,
    addItem,
    updateQuantity,
    removeItem,
    clearOrder,
  } = useOrderStore();
  const { isAdminAuthenticated, login, logout } = useAuthStore();

  // 카테고리 상태 관리 (로컬 상태)
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

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
    <View className='h-full w-full bg-[#f2f4f6] flex flex-col'>
      {/* 헤더 섹션 - 로고, 영업중 배지, 관리자 모드 버튼이 포함된 상단 헤더 */}
      <View className='w-full h-[68px] bg-white box-border px-[28px] flex flex-row items-center gap-3 border-b border-[#f2f4f6]'>
        {/* 로고 */}
        <McPos width={64} height={64} />

        {/* 영업중 배지 */}
        <View className='bg-[#f0faf6] px-[10px] py-[5px] rounded-lg'>
          <Text className='text-primaryGreen text-[13px] font-pretendard-semibold'>
            영업중
          </Text>
        </View>

        {/* 관리자 모드 버튼 */}
        <Pressable
          role='button'
          className='ml-auto'
          onPressIn={adminAnimation.onPressIn}
          onPressOut={adminAnimation.onPressOut}
          onPress={handleAdminPress}
        >
          <Animated.View
            className='flex justify-center items-center bg-primaryGreen rounded-xl w-[150px] h-[40px]'
            style={{
              transform: [{ scale: adminAnimation.scaleAnim }],
            }}
          >
            <Text className='text-white text-[15px] font-pretendard-bold'>
              {isAdminAuthenticated ? '로그아웃' : '관리자 모드'}
            </Text>
          </Animated.View>
        </Pressable>
      </View>

      {/* 본문: 좌측 메뉴 그리드 / 우측 주문서 패널 2컬럼 */}
      <View className='flex-1 flex flex-row min-h-0'>
        {/* 좌측: 카테고리 탭 + 메뉴 그리드 */}
        <View className='flex-1 flex flex-col min-w-0 pt-4'>
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />
          <View className='flex-1'>
            <MenuGrid selectedCategory={selectedCategory} onAddItem={addItem} />
          </View>
        </View>

        {/* 우측: 고정폭 주문서 패널 */}
        <OrderSection
          items={orderItems}
          itemCount={itemCount}
          totalAmount={totalAmount}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeItem}
          onClearAll={clearOrder}
        />
      </View>

      {/* 모달 섹션 - 관리자 인증을 위한 비밀번호 입력 모달 */}
      <AdminModal
        visible={isModalOpen('admin')}
        onClose={handleCloseAdminModal}
        onConfirm={handleAdminConfirm}
      />
    </View>
  );
}
