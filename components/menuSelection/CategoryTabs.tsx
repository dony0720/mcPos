import clsx from 'clsx';
import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { useCategoryStore } from '@/stores';
import { useMenuStore } from '@/stores';

import type { CategoryTabsProps } from '../../types';

export default function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  const { categories } = useCategoryStore();
  const { menus } = useMenuStore();

  return (
    <View className='w-full box-border px-[5%]'>
      <View className='h-[45px] flex flex-row'>
        {/* 카테고리 탭 버튼들 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className='flex-row gap-6 relative'>
            {/* 전체 카테고리 */}
            <Pressable
              className='flex-1 py-3 flex justify-center items-center w-[120px]'
              onPress={() => onSelectCategory('ALL')}
            >
              <Text
                className={clsx(
                  'text-[16px] font-bold',
                  selectedCategory === 'ALL'
                    ? 'text-primaryGreen'
                    : 'text-gray-500'
                )}
              >
                전체 ({menus.length})
              </Text>
            </Pressable>
            {categories.map(category => (
              <Pressable
                role='tablist'
                key={category.id}
                onPress={() => onSelectCategory(category.id)}
                className='flex-1 py-3 flex justify-center items-center w-[120px]'
              >
                <Text
                  className={clsx('text-[16px] font-bold', {
                    'text-primaryGreen': selectedCategory === category.id,
                    'text-gray-500': selectedCategory !== category.id,
                  })}
                >
                  {category.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>
        {/* 탭 인디케이터 */}
        {/* 회색 구분선 */}
        <View className='absolute bottom-0 w-full border-t border-gray-300' />
        {/* 선택된 카테고리 아래 초록색 밑줄 */}
        {/* <View
          className='absolute bottom-0 border-t-2 border-primaryGreen w-[120px] '
          // style={{
          //   transform: [
          //     {
          //       translateX: `${categories.findIndex(cat => cat.id === selectedCategory) * 120}`,
          //     },
          //   ],
          // }}
        /> */}
      </View>
    </View>
  );
}
