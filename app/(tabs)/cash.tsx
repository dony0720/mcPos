import React from 'react';
import { View } from 'react-native';
import PageHeader from '../../components/common/PageHeader';
import CashHeader from '../../components/cash/CashHeader';
import CashInfoGrid from '../../components/cash/CashInfoGrid';

export default function CashManagement() {
  // 카드 데이터 정의
  const cashInfoData = [
    // 첫 번째 행
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
    ],
    // 두 번째 행
    [
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
  ];

  const handleInspection = () => {
    console.log('시재 점검');
  };

  const handleDailySettlement = () => {
    console.log('일일정산');
  };

  return (
    <View className='h-full w-full bg-white flex flex-col box-border px-[5%]'>
      <PageHeader />

      <CashHeader
        onInspection={handleInspection}
        onDailySettlement={handleDailySettlement}
      />

      <CashInfoGrid data={cashInfoData} />
    </View>
  );
}
