import React from 'react';
import { View } from 'react-native';
import PageHeader from '../../components/common/PageHeader';
import CashHeader from '../../components/cash/CashHeader';
import SalesInfoCards from '../../components/cash/SalesInfoCards';
import CashDrawerCards from '../../components/cash/CashDrawerCards';

export default function CashManagement() {
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

      <SalesInfoCards />

      <CashDrawerCards />
    </View>
  );
}
