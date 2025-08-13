import React, { useMemo } from 'react';
import { View } from 'react-native';

import { useCashStore } from '../../stores/useCashStore';
import { SalesTheme } from '../../types';
import SalesInfoCard from './SalesInfoCard';

// 스토어 기반 동적 카드 데이터 구성
function useSalesCards() {
  const salesInfo = useCashStore(state => state.salesInfo);
  const transactions = useCashStore(state => state.transactions);
  const cashDrawerData = useCashStore(state => state.cashDrawerData);

  return useMemo(() => {
    // 입금/출금 총액 계산
    const depositAmount = transactions
      .filter(t => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
    const withdrawAmount = transactions
      .filter(t => t.type === 'withdraw')
      .reduce((sum, t) => sum + t.amount, 0);

    const format = (n: number) => `${n.toLocaleString()}원`;

    // 현금 보유액 계산 (권종별 수량 기반)
    const currentCashAmount = cashDrawerData.reduce(
      (total, item) => total + item.quantity * item.unitValue,
      0
    );

    return [
      [
        {
          icon: 'play-circle' as const,
          title: '시작금액',
          amount: format(0), // 시작금액은 별도 설정 필요
          theme: SalesTheme.GRAY,
        },
        {
          icon: 'trending-up' as const,
          title: '오늘 매출',
          amount: format(salesInfo.totalSales),
          theme: SalesTheme.BLUE,
        },
        {
          icon: 'arrow-down-circle' as const,
          title: '입금',
          amount: `${format(depositAmount)}`,
          theme: SalesTheme.EMERALD,
        },
        {
          icon: 'arrow-up-circle' as const,
          title: '출금',
          amount: `${format(withdrawAmount)}`,
          theme: SalesTheme.RED,
        },
      ],
      [
        {
          icon: 'cash' as const,
          title: '현금',
          amount: format(currentCashAmount),
          theme: SalesTheme.GREEN,
        },
        {
          icon: 'card' as const,
          title: '이체',
          amount: format(salesInfo.cardSales),
          theme: SalesTheme.PURPLE,
        },
        {
          icon: 'ticket' as const,
          title: '쿠폰',
          amount: format(salesInfo.discounts),
          theme: SalesTheme.ORANGE,
        },
        {
          icon: 'book' as const,
          title: '장부',
          amount: format(0),
          theme: SalesTheme.INDIGO,
        },
      ],
    ];
  }, [salesInfo, transactions, cashDrawerData]);
}

export default function SalesInfoCards() {
  // 스토어에서 동적으로 계산된 매출 데이터 사용
  const salesInfoData = useSalesCards();

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
