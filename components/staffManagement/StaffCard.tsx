import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { Staff } from '../../types';

interface StaffCardProps {
  staff: Staff;
  onEdit: (staff: Staff) => void;
  onDelete: (staff: Staff) => void;
}

/**
 * 직원 카드 컴포넌트
 * - 개별 직원 정보를 카드 형태로 표시
 */
export default function StaffCard({ staff, onEdit, onDelete }: StaffCardProps) {
  return (
    <View className='bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-1'>
      {/* 직원 아이콘 */}
      <View className='items-center mb-3'>
        <View className='w-12 h-12 bg-gray-100 rounded-full items-center justify-center mb-2'>
          <Ionicons name='person-outline' size={24} color='#6B7280' />
        </View>

        {/* 직원명 */}
        <Text className='text-gray-800 text-base font-semibold text-center mb-1'>
          {staff.name}
        </Text>
      </View>

      {/* 전화번호 */}
      <View className='items-center mb-3'>
        <Text className='text-sm text-gray-600'>{staff.phone}</Text>
      </View>

      {/* 액션 버튼들 */}
      <View className='flex-row items-center justify-center gap-3'>
        {/* 편집 버튼 */}
        <TouchableOpacity
          className='w-8 h-8 rounded-full bg-blue-100 items-center justify-center'
          onPress={() => onEdit(staff)}
        >
          <Ionicons name='pencil-outline' size={16} color='#3B82F6' />
        </TouchableOpacity>

        {/* 삭제 버튼 */}
        <TouchableOpacity
          className='w-8 h-8 rounded-full bg-red-100 items-center justify-center'
          onPress={() => onDelete(staff)}
        >
          <Ionicons name='trash-outline' size={16} color='#EF4444' />
        </TouchableOpacity>
      </View>
    </View>
  );
}
