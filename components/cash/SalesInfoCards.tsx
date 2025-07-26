import React from 'react';
import { View } from 'react-native';

import SalesInfoCard from './SalesInfoCard';

// 매출 정보 카드 초기 데이터
const INITIAL_SALES_INFO_DATA = [
  // 첫 번째 행: 시작금액, 오늘 매출, 입금, 출금
  [
    {
      icon: 'play-circle' as const,
      title: '시작금액',
      amount: '1,000,000원',
      theme: 'gray' as const,
    },
    {
      icon: 'trending-up' as const,
      title: '오늘 매출',
      amount: '850,000원',
      theme: 'blue' as const,
    },
    {
      icon: 'arrow-down-circle' as const,
      title: '입금',
      amount: '+50,000원',
      theme: 'emerald' as const,
    },
    {
      icon: 'arrow-up-circle' as const,
      title: '출금',
      amount: '-30,000원',
      theme: 'red' as const,
    },
  ],
  // 두 번째 행: 현금, 이체, 쿠폰, 장부
  [
    {
      icon: 'cash' as const,
      title: '현금',
      amount: '450,000원',
      theme: 'green' as const,
    },
    {
      icon: 'card' as const,
      title: '이체',
      amount: '280,000원',
      theme: 'purple' as const,
    },
    {
      icon: 'ticket' as const,
      title: '쿠폰',
      amount: '45,000원',
      theme: 'orange' as const,
    },
    {
      icon: 'book' as const,
      title: '장부',
      amount: '75,000원',
      theme: 'indigo' as const,
    },
  ],
];

export default function SalesInfoCards() {
  // 매출 관련 카드 데이터
  const salesInfoData = INITIAL_SALES_INFO_DATA;

  return (
    <View className='mt-8'>
      {/* 매출 정보 그리드 */}
      <View className='flex flex-col gap-4'>
        {salesInfoData.map((row, rowIndex) => (
          <View key={rowIndex} className='flex flex-row gap-4'>
            {row.map((card, cardIndex) => (
              <SalesInfoCard
                key={cardIndex}
                icon={card.icon}
                title={card.title}
                amount={card.amount}
                theme={card.theme}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
