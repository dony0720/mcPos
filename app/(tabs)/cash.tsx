import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Alert, View } from 'react-native';

import {
  AdminProtectedRoute,
  CashDrawerCards,
  CashHeader,
  CashInspectionModal,
  PageHeader,
  SalesInfoCards,
} from '../../components';
import { useCashStore } from '../../stores';
import { CashDrawerMoneyItem, CashInspectionReceiptData } from '../../types';
import { createPrinterService } from '../../utils';

export default function CashManagement() {
  const [isInspectionModalVisible, setIsInspectionModalVisible] =
    useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  // 현금 스토어에서 실제 데이터 가져오기
  const { cashDrawer, updateCashDrawer } = useCashStore();
  const printerService = createPrinterService();

  const handleInspection = async () => {
    if (isPrinting) return;

    setIsPrinting(true);
    try {
      // 스토어에 저장된 현재 권종 정보로 영수증 출력
      const totalAmount = cashDrawer.reduce(
        (total, item) => total + item.quantity * item.unitValue,
        0
      );

      const inspectionData: CashInspectionReceiptData = {
        header: {
          storeName: 'MC카페',
          title: '시재 점검 영수증',
          dateTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        },
        cashData: cashDrawer.map(item => ({
          denomination: `${item.unitValue.toLocaleString()}원`,
          quantity: item.quantity,
          amount: item.quantity * item.unitValue,
        })),
        summary: {
          totalAmount,
          inspector: '관리자',
        },
      };

      await printerService.printCashInspection(inspectionData);
    } catch {
      Alert.alert('영수증 출력 실패', '영수증 출력에 실패했습니다.');
    } finally {
      setIsPrinting(false);
    }
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
            mode='settlement'
          />
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
