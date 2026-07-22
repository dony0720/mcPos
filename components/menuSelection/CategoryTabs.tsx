import clsx from 'clsx';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useCategoryStore } from '@/stores';

import type { CategoryTabsProps } from '../../types';

export default function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const { categories } = useCategoryStore();

  return (
    <View className='w-full box-border px-[5%]'>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className='flex-row gap-2 py-3'>
          {/* 전체 카테고리 */}
          <Pressable
            className={clsx(
              'px-[18px] py-[10px] rounded-xl',
              selectedCategory === 'ALL' ? 'bg-primaryGreen' : 'bg-white'
            )}
            onPress={() => onSelectCategory('ALL')}
          >
            <Text
              className={clsx(
                'text-[15px] font-pretendard-bold',
                selectedCategory === 'ALL' ? 'text-white' : 'text-gray-500'
              )}
            >
              전체
            </Text>
          </Pressable>
          {categories
            .filter(category => category.id !== 'All' && category.id !== 'ALL')
            .map(category => (
              <Pressable
                role='tablist'
                key={category.id}
                onPress={() => onSelectCategory(category.id)}
                className={clsx(
                  'px-[18px] py-[10px] rounded-xl',
                  selectedCategory === category.id
                    ? 'bg-primaryGreen'
                    : 'bg-white'
                )}
              >
                <Text
                  className={clsx('text-[15px] font-pretendard-bold', {
                    'text-white': selectedCategory === category.id,
                    'text-gray-500': selectedCategory !== category.id,
                  })}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))}
        </View>
      </ScrollView>
    </View>
  );
}
