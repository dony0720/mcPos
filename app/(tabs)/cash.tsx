import React, { useState } from 'react';
import { View } from 'react-native';

import {
  AdminProtectedRoute,
  CashDrawerCards,
  CashHeader,
  CashInspectionModal,
  PageHeader,
  SalesInfoCards,
} from '../../components';
import { CashDrawerMoneyItem, CashTheme } from '../../types';

// 권종별 현금 서랍 초기 데이터
const INITIAL_CASH_DRAWER_DATA: CashDrawerMoneyItem[] = [
  {
    type: '지폐',
    title: '5만원',
    theme: CashTheme.YELLOW,
    quantity: 8,
    unitValue: 50000,
  },
  {
    type: '지폐',
    title: '1만원',
    theme: CashTheme.GREEN,
    quantity: 15,
    unitValue: 10000,
  },
  {
    type: '지폐',
    title: '5천원',
    theme: CashTheme.ORANGE,
    quantity: 12,
    unitValue: 5000,
  },
  {
    type: '지폐',
    title: '1천원',
    theme: CashTheme.BLUE,
    quantity: 25,
    unitValue: 1000,
  },
  {
    type: '동전',
    title: '500원',
    theme: CashTheme.GRAY,
    quantity: 30,
    unitValue: 500,
  },
  {
    type: '동전',
    title: '100원',
    theme: CashTheme.GRAY,
    quantity: 50,
    unitValue: 100,
  },
];

export default function CashManagement() {
  const [isInspectionModalVisible, setIsInspectionModalVisible] =
    useState(false);

  // 권종별 현금 서랍 현황 데이터 상태
  const [cashDrawerData, setCashDrawerData] = useState<CashDrawerMoneyItem[]>(
    INITIAL_CASH_DRAWER_DATA
  );

  const handleInspection = () => {
    console.log('시재 점검');
  };

  const handleDailySettlement = () => {
    setIsInspectionModalVisible(true);
  };

  const handleInspectionConfirm = (updatedData: CashDrawerMoneyItem[]) => {
    setCashDrawerData(updatedData);
    console.log('시재 점검 완료:', updatedData);
  };

  const handleInspectionClose = () => {
    setIsInspectionModalVisible(false);
  };

  return (
    <AdminProtectedRoute>
      <View className='h-full w-full bg-white flex flex-col box-border px-[5%]'>
        <PageHeader />

        <CashHeader
          onInspection={handleInspection}
          onDailySettlement={handleDailySettlement}
        />

        <SalesInfoCards />

        <CashDrawerCards cashDrawerData={cashDrawerData} />

        <CashInspectionModal
          visible={isInspectionModalVisible}
          onClose={handleInspectionClose}
          onConfirm={handleInspectionConfirm}
          initialData={cashDrawerData}
        />
      </View>
    </AdminProtectedRoute>
  );
}
