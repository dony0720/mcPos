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
import { useCashStore } from '../../stores';
import { CashDrawerMoneyItem } from '../../types';

export default function CashManagement() {
  const [isInspectionModalVisible, setIsInspectionModalVisible] =
    useState(false);

  // 현금 스토어에서 실제 데이터 가져오기
  const { cashDrawer, updateCashDrawer } = useCashStore();

  const handleInspection = () => {
    console.log('시재 점검');
  };

  const handleDailySettlement = () => {
    setIsInspectionModalVisible(true);
  };

  const handleInspectionConfirm = (updatedData: CashDrawerMoneyItem[]) => {
    updateCashDrawer(updatedData);
  };

  const handleInspectionClose = () => {
    setIsInspectionModalVisible(false);
  };

  return (
    <AdminProtectedRoute>
      <View className='h-full w-full bg-white flex flex-col'>
        <View className='flex-1 max-w-7xl mx-auto w-full box-border px-[5%]'>
          <PageHeader />

          <CashHeader
            onInspection={handleInspection}
            onDailySettlement={handleDailySettlement}
          />

          <SalesInfoCards />

          <CashDrawerCards cashDrawerData={cashDrawer} />

          <CashInspectionModal
            visible={isInspectionModalVisible}
            onClose={handleInspectionClose}
            onConfirm={handleInspectionConfirm}
            initialData={cashDrawer}
          />
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
