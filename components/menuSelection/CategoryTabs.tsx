import clsx from 'clsx';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import type { CategoryTabsProps, MenuCategory } from '../../types';

const CATEGORIES: { id: MenuCategory; name: string }[] = [
  { id: 'COFFEE', name: '커피' },
  { id: 'NON_COFFEE', name: '논커피' },
  { id: 'TEA', name: '차' },
  { id: 'ADE', name: '에이드' },
  { id: 'DESSERT', name: '디저트' },
];

export default function CategoryTabs({
  selectedCategory,
  onSelectCategory,
}: CategoryTabsProps) {
  return (
    <View className='w-full box-border px-[5%]'>
      <View className='h-[45px] flex flex-row relative'>
        {/* 카테고리 탭 버튼들 */}
        {CATEGORIES.map(category => (
          <Pressable
            role='tablist'
            key={category.id}
            onPress={() => onSelectCategory(category.id)}
            className='flex-1 py-3 flex justify-center items-center'
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

        {/* 탭 인디케이터 */}
        {/* 회색 구분선 */}
        <View className='absolute bottom-0 w-full border-t border-gray-300' />
        {/* 선택된 카테고리 아래 초록색 밑줄 */}
        <View
          className='absolute bottom-0 border-t-2 border-primaryGreen'
          style={{
            width: `${100 / CATEGORIES.length}%`,
            transform: [
              {
                translateX: `${CATEGORIES.findIndex(cat => cat.id === selectedCategory) * 100}%`,
              },
            ],
          }}
        />
      </View>
    </View>
  );
}
