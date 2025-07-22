import React, { useState } from 'react';
import { View } from 'react-native';

import {
  CashDrawerCards,
  CashHeader,
  CashInspectionModal,
  PageHeader,
  SalesInfoCards,
} from '../../components';

// 현금 서랍 아이템 타입 정의
interface CashDrawerItem {
  type: string;
  title: string;
  theme: 'yellow' | 'green' | 'orange' | 'blue' | 'gray';
  quantity: number;
  unitValue: number;
}

export default function CashManagement() {
  const [isInspectionModalVisible, setIsInspectionModalVisible] =
    useState(false);

  // 권종별 현금 서랍 현황 데이터 상태
  const [cashDrawerData, setCashDrawerData] = useState<CashDrawerItem[]>([
    {
      type: '지폐',
      title: '5만원',
      theme: 'yellow' as const,
      quantity: 8,
      unitValue: 50000,
    },
    {
      type: '지폐',
      title: '1만원',
      theme: 'green' as const,
      quantity: 15,
      unitValue: 10000,
    },
    {
      type: '지폐',
      title: '5천원',
      theme: 'orange' as const,
      quantity: 12,
      unitValue: 5000,
    },
    {
      type: '지폐',
      title: '1천원',
      theme: 'blue' as const,
      quantity: 25,
      unitValue: 1000,
    },
    {
      type: '동전',
      title: '500원',
      theme: 'gray' as const,
      quantity: 30,
      unitValue: 500,
    },
    {
      type: '동전',
      title: '100원',
      theme: 'gray' as const,
      quantity: 50,
      unitValue: 100,
    },
  ]);

  const handleInspection = () => {
    console.log('시재 점검');
  };

  const handleDailySettlement = () => {
    setIsInspectionModalVisible(true);
  };

  const handleInspectionConfirm = (updatedData: CashDrawerItem[]) => {
    setCashDrawerData(updatedData);
    console.log('시재 점검 완료:', updatedData);
  };

  const handleInspectionClose = () => {
    setIsInspectionModalVisible(false);
  };

  return (
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
  );
}
