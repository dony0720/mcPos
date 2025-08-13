import React, { useEffect, useState } from 'react';
import { View } from 'react-native';

import {
  CashDrawerCards,
  CashHeader,
  CashInspectionModal,
  PageHeader,
  SalesInfoCards,
} from '../../components';
import { CashDrawerMoneyItem, useCashStore } from '../../stores/useCashStore';

export default function CashManagement() {
  const [isInspectionModalVisible, setIsInspectionModalVisible] =
    useState(false);

  // 스토어에서 현금 서랍 데이터 업데이트 함수 가져오기
  const updateCashDrawerData = useCashStore(
    state => state.updateCashDrawerData
  );

  // 날짜 변경 시 롤오버 수행
  const ensureDailyRollover = useCashStore(state => state.ensureDailyRollover);
  useEffect(() => {
    ensureDailyRollover();
  }, []);

  const handleInspection = () => {
    console.log('시재 점검');
  };

  const handleDailySettlement = () => {
    setIsInspectionModalVisible(true);
  };

  const handleInspectionConfirm = (updatedData: CashDrawerMoneyItem[]) => {
    updateCashDrawerData(updatedData);
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

      <CashDrawerCards />

      <CashInspectionModal
        visible={isInspectionModalVisible}
        onClose={handleInspectionClose}
        onConfirm={handleInspectionConfirm}
      />
    </View>
  );
}
