import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export type FilterType = 'all' | '현금' | '이체' | '쿠폰' | '장부';

interface FilterOption {
  key: FilterType;
  label: string;
  icon: string;
  color: string;
}

interface FilterTabsProps {
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function FilterTabs({
  selectedFilter,
  onFilterChange,
}: FilterTabsProps) {
  const filterOptions: FilterOption[] = [
    {
      key: 'all',
      label: '전체',
      icon: 'apps-outline',
      color: '#6B7280',
    },
    {
      key: '현금',
      label: '현금',
      icon: 'cash-outline',
      color: '#10B981',
    },
    {
      key: '이체',
      label: '이체',
      icon: 'card-outline',
      color: '#3B82F6',
    },
    {
      key: '쿠폰',
      label: '쿠폰',
      icon: 'ticket-outline',
      color: '#F59E0B',
    },
    {
      key: '장부',
      label: '장부',
      icon: 'book-outline',
      color: '#8B5CF6',
    },
  ];

  return (
    <View className='flex flex-row gap-3 mt-6'>
      {filterOptions.map(option => (
        <Pressable
          key={option.key}
          onPress={() => onFilterChange(option.key)}
          className={`flex flex-row items-center px-3 py-2 rounded-full border ${
            selectedFilter === option.key
              ? 'bg-blue-50 border-blue-500'
              : 'bg-white border-gray-200'
          }`}
        >
          <Ionicons
            name={option.icon as any}
            size={18}
            color={selectedFilter === option.key ? '#3B82F6' : option.color}
          />
          <Text
            className={`ml-2 font-medium ${
              selectedFilter === option.key ? 'text-blue-600' : 'text-gray-600'
            }`}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
