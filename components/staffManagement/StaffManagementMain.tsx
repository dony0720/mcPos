import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { useModal } from '../../hooks';
import { StaffFormSchemaType } from '../../schemas';
import { useStaffStore } from '../../stores';
import { Staff } from '../../types';
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

  // 스토어에서 직원 데이터와 액션들 가져오기
  const { staffs, addStaff, updateStaff, deleteStaff } = useStaffStore();

  // 이벤트 핸들러
  const handleAddStaff = () => {
    openModal('staffAdd');
  };

  const handleAddStaffConfirm = (staffData: StaffFormSchemaType) => {
    addStaff(staffData);
    closeModal();
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    openModal('staffEdit');
  };

  const handleEditStaffConfirm = (staffData: StaffFormSchemaType) => {
    if (selectedStaff) {
      updateStaff(selectedStaff.id, staffData);
    }
    closeModal();
    setSelectedStaff(null);
  };

  const handleDeleteStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    openModal('staffDelete');
  };

  const handleDeleteStaffConfirm = () => {
    if (selectedStaff) {
      deleteStaff(selectedStaff.id);
    }
    closeModal();
    setSelectedStaff(null);
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      <View className='flex-1 max-w-7xl mx-auto w-full'>
        {/* 헤더 섹션 */}
        <View className='w-full box-border px-[5%] mb-6 flex flex-row justify-between items-center'>
          {/* 페이지 제목 */}
          <Text className='text-3xl font-bold text-gray-800'>직원 관리</Text>

          {/* 직원 추가 버튼 */}
          <TouchableOpacity
            className='bg-primaryGreen rounded-lg px-6 py-3 flex-row items-center'
            onPress={handleAddStaff}
          >
            <Ionicons name='add-outline' size={20} color='white' />
            <Text className='text-white font-bold ml-2'>직원 추가</Text>
          </TouchableOpacity>
        </View>

        {/* 직원 카드 그리드 섹션 */}
        <View className='flex-1 box-border px-[5%]'>
          <ScrollView showsVerticalScrollIndicator={false}>
            {staffs.length > 0 ? (
              <View className='pb-4'>
                {Array.from(
                  { length: Math.ceil(staffs.length / 3) },
                  (_, rowIndex) => (
                    <View key={rowIndex} className='flex-row gap-4 mb-4'>
                      {staffs
                        .slice(rowIndex * 3, (rowIndex + 1) * 3)
                        .map(staff => (
                          <StaffCard
                            key={staff.id}
                            staff={staff}
                            onEdit={handleEditStaff}
                            onDelete={handleDeleteStaff}
                          />
                        ))}
                      {/* 빈 공간 채우기 (3개 미만인 경우) */}
                      {Array.from(
                        {
                          length:
                            3 -
                            staffs.slice(rowIndex * 3, (rowIndex + 1) * 3)
                              .length,
                        },
                        (_, emptyIndex) => (
                          <View
                            key={`empty-${emptyIndex}`}
                            className='flex-1'
                          />
                        )
                      )}
                    </View>
                  )
                )}
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
