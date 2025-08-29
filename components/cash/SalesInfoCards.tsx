import React from 'react';
import { View } from 'react-native';

import {
  useCashStore,
  useLedgerStore,
  useTransactionStore,
} from '../../stores';
import { SalesTheme, TransactionType } from '../../types';
import SalesInfoCard from './SalesInfoCard';

export default function SalesInfoCards() {
  // 실제 데이터 가져오기
  const { getTodayDeposits, getTodayWithdrawals, getTotalCashAmount } =
    useCashStore();
  const { getTransactionStats, getTodayTransactions } = useTransactionStore();
  const { ledgerData, parseAmount } = useLedgerStore();

  // 오늘의 통계 계산
  const todayStats = getTransactionStats({
    startDate: new Date(new Date().setHours(0, 0, 0, 0)),
    endDate: new Date(new Date().setHours(23, 59, 59, 999)),
  });

  const todayTransactions = getTodayTransactions();
  const totalCash = getTotalCashAmount();

  // 오늘 입출금 데이터
  const todayDeposits = getTodayDeposits();
  const todayWithdrawals = getTodayWithdrawals();

  // 결제 방법별 매출 계산 (paymentBreakdown 사용)
  // 완료된 주문 거래만 필터링 (입출금 제외)
  const completedOrderTransactions = todayTransactions.filter(
    t =>
      (t.status === 'completed' || t.status === 'picked_up') &&
      (t.type === TransactionType.ORDER || !t.type) // 기존 거래는 type이 없을 수 있음
  );

  const cashSales = completedOrderTransactions.reduce((sum, t) => {
    if (t.paymentBreakdown?.cash) {
      return sum + t.paymentBreakdown.cash;
    }
    // 기존 데이터 호환성: paymentBreakdown이 없는 경우 기존 로직 사용
    return sum + (t.paymentMethod === 'cash' ? t.totalAmount : 0);
  }, 0);

  const transferSales = completedOrderTransactions.reduce((sum, t) => {
    if (t.paymentBreakdown?.transfer) {
      return sum + t.paymentBreakdown.transfer;
    }
    return sum + (t.paymentMethod === 'transfer' ? t.totalAmount : 0);
  }, 0);

  const couponSales = completedOrderTransactions.reduce((sum, t) => {
    if (t.paymentBreakdown?.coupon) {
      return sum + t.paymentBreakdown.coupon;
    }
    return sum + (t.paymentMethod === 'coupon' ? t.totalAmount : 0);
  }, 0);

  // 장부 결제 매출 (현재는 사용하지 않지만 나중에 필요할 수 있음)
  // const ledgerSales = completedOrderTransactions.reduce((sum, t) => {
  //   if (t.paymentBreakdown?.ledger) {
  //     return sum + t.paymentBreakdown.ledger;
  //   }
  //   return sum + (t.paymentMethod === 'ledger' ? t.totalAmount : 0);
  // }, 0);

  // 장부관리의 모든 장부 총 충전 금액 계산
  const totalLedgerAmount = ledgerData.reduce((sum, ledger) => {
    return sum + parseAmount(ledger.chargeAmount);
  }, 0);

  // 실제 데이터로 카드 구성
  const salesInfoData = [
    // 첫 번째 행: 시작금액, 오늘 매출, 현금 서랍, 거스름돈
    [
      {
        icon: 'play-circle' as const,
        title: '시작금액',
        amount: `${totalCash.toLocaleString()}원`, // 고정값 (나중에 설정 가능하게 할 수 있음)
        theme: SalesTheme.GRAY,
      },
      {
        icon: 'trending-up' as const,
        title: '오늘 매출',
        amount: `${todayStats.totalSales.toLocaleString()}원`,
        theme: SalesTheme.BLUE,
      },
      {
        icon: 'wallet' as const,
        title: '입금',
        amount: `${todayDeposits.toLocaleString()}원`,
        theme: SalesTheme.EMERALD,
      },
      {
        icon: 'refresh' as const,
        title: '출금',
        amount: `${todayWithdrawals.toLocaleString()}원`,
        theme: SalesTheme.RED,
      },
    ],
    // 두 번째 행: 현금, 이체, 쿠폰, 장부
    [
      {
        icon: 'cash' as const,
        title: '현금',
        amount: `${cashSales.toLocaleString()}원`,
        theme: SalesTheme.GREEN,
      },
      {
        icon: 'card' as const,
        title: '이체',
        amount: `${transferSales.toLocaleString()}원`,
        theme: SalesTheme.PURPLE,
      },
      {
        icon: 'ticket' as const,
        title: '쿠폰',
        amount: `${couponSales.toLocaleString()}원`,
        theme: SalesTheme.ORANGE,
      },
      {
        icon: 'book' as const,
        title: '장부',
        amount: `${totalLedgerAmount.toLocaleString()}원`,
        theme: SalesTheme.INDIGO,
      },
    ],
  ];

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
