import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { FILTER_OPTIONS } from '../../data/filterOptions';
import { FilterTabsProps } from '../../types';

export default function FilterTabs({
  selectedFilter,
  onFilterChange,
}: FilterTabsProps) {
  return (
    <View className='flex flex-row gap-3 mt-6'>
      {FILTER_OPTIONS.map(option => (
        <Pressable
          key={option.key}
          onPress={() => onFilterChange(option.key)}
          className={clsx(
            'flex flex-row items-center px-3 py-2 rounded-full border',
            selectedFilter === option.key
              ? 'bg-blue-50 border-blue-500'
              : 'bg-white border-gray-200'
          )}
        >
          <Ionicons
            name={option.icon as any}
            size={18}
            color={selectedFilter === option.key ? '#3B82F6' : option.color}
          />
          <Text
            className={clsx('ml-2 font-medium', {
              'text-blue-600': selectedFilter === option.key,
              'text-gray-600': selectedFilter !== option.key,
            })}
          >
            {option.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
