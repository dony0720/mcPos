import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { STAFF } from '../../data/staff';
import { useModal } from '../../hooks';
import type { StaffFormSchemaType } from '../../schemas';
import type { Staff } from '../../types';
import {
  StaffAddModal,
  StaffCard,
  StaffDeleteModal,
  StaffEditModal,
} from './index';

/**
 * 직원 관리 메인 화면 컴포넌트
 * - 직원 목록 테이블과 액션 버튼들을 포함하는 메인 화면
 */
export default function StaffManagementMain() {
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const { openModal, closeModal, isModalOpen } = useModal();

  // 재직 상태별로 정렬 (재직자 먼저)
  const sortedStaff = [...STAFF].sort((a, b) => {
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return a.name.localeCompare(b.name);
  });

  // 이벤트 핸들러
  const handleAddStaff = () => {
    openModal('staffAdd');
  };

  const handleAddStaffConfirm = (_staffData: StaffFormSchemaType) => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    openModal('staffEdit');
  };

  const handleEditStaffConfirm = (_staffData: StaffFormSchemaType) => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
    setSelectedStaff(null);
  };

  const handleDeleteStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    openModal('staffDelete');
  };

  const handleDeleteStaffConfirm = () => {
    // 퍼블리싱 단계 - 기능 구현 없이 모달만 닫기
    closeModal();
    setSelectedStaff(null);
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      <View className='flex-1 max-w-7xl mx-auto w-full'>
        {/* 헤더 섹션 */}
        <View className='w-full box-border px-[5%] my-7 flex flex-row justify-between items-center'>
          <Text className='text-3xl font-bold text-gray-800'>직원 관리</Text>
          <TouchableOpacity
            className='bg-primaryGreen rounded-lg px-4 py-2 flex-row items-center gap-2'
            onPress={handleAddStaff}
          >
            <Ionicons name='add-circle-outline' size={20} color='white' />
            <Text className='text-white text-base font-semibold'>
              직원 추가
            </Text>
          </TouchableOpacity>
        </View>

        {/* 직원 카드 그리드 섹션 */}
        <View className='flex-[0.9] box-border px-[5%]'>
          <ScrollView showsVerticalScrollIndicator={false}>
            {sortedStaff.length > 0 ? (
              <View className='flex-row flex-wrap gap-4 pb-4'>
                {sortedStaff.map(staff => (
                  <StaffCard
                    key={staff.id}
                    staff={staff}
                    onEdit={handleEditStaff}
                    onDelete={handleDeleteStaff}
                  />
                ))}
              </View>
            ) : (
              <View className='p-8 items-center justify-center'>
                <Ionicons name='people-outline' size={48} color='#9CA3AF' />
                <Text className='text-gray-500 mt-4 text-base text-center'>
                  등록된 직원이 없습니다
                </Text>
                <Text className='text-gray-400 mt-1 text-sm text-center'>
                  직원 추가 버튼을 눌러 새로운 직원을 등록해보세요
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* 하단 여백 */}
        <View className='h-16' />
      </View>

      {/* 직원 추가 모달 */}
      <StaffAddModal
        visible={isModalOpen('staffAdd')}
        onClose={closeModal}
        onConfirm={handleAddStaffConfirm}
      />

      {/* 직원 편집 모달 */}
      <StaffEditModal
        visible={isModalOpen('staffEdit')}
        onClose={closeModal}
        onConfirm={handleEditStaffConfirm}
        staff={selectedStaff}
      />

      {/* 직원 삭제 확인 모달 */}
      <StaffDeleteModal
        visible={isModalOpen('staffDelete')}
        onClose={closeModal}
        onConfirm={handleDeleteStaffConfirm}
        staff={selectedStaff}
      />
    </View>
  );
}
