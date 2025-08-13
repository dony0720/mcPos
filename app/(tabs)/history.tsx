import 'dayjs/locale/ko';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AdminProtectedRoute } from '../../components';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/history/EmptyState';
import FilterTabs, { FilterType } from '../../components/history/FilterTabs';
import ReceiptModal from '../../components/history/ReceiptModal';
import TransactionItem from '../../components/history/TransactionItem';
import { useTransactionStore } from '../../stores';
import { Transaction } from '../../types';

// Day.js 설정
dayjs.locale('ko');
dayjs.extend(relativeTime);

export default function History() {
  // 거래내역 스토어에서 데이터 가져오기
  const { transactions: storeTransactions } = useTransactionStore();

  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);

  // 거래내역 클릭 핸들러
  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setReceiptModalVisible(true);
  };

  // 영수증 모달 닫기
  const closeReceiptModal = () => {
    setReceiptModalVisible(false);
    setSelectedTransaction(null);
  };

  // 출력 버튼 핸들러
  const handlePrint = () => {
    // 실제 출력 로직 구현
    closeReceiptModal();
  };

  // 결제 방법 ID를 한글로 변환
  const getPaymentMethodLabel = (paymentMethodId: string) => {
    switch (paymentMethodId) {
      case 'cash':
        return '현금';
      case 'transfer':
        return '이체';
      case 'coupon':
        return '쿠폰';
      case 'ledger':
        return '장부';
      default:
        return '기타';
    }
  };

  // 필터링된 거래내역
  const filteredTransactions = storeTransactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    const paymentMethodLabel = getPaymentMethodLabel(transaction.paymentMethod);
    return paymentMethodLabel === selectedFilter;
  });

  return (
    <AdminProtectedRoute>
      <View className='h-full w-full bg-white flex flex-col'>
        <View className='flex-1 max-w-7xl mx-auto w-full box-border px-[5%]'>
          <PageHeader />

          <View className='w-full mt-[20px] flex flex-col gap-3'>
            <Text className='text-3xl font-bold'>거래내역</Text>
            <Text className='text-xl text-gray-500'>
              {selectedFilter === 'all'
                ? `총 ${filteredTransactions.length}건의 거래`
                : `${selectedFilter} ${filteredTransactions.length}건의 거래`}
            </Text>
          </View>

          {/* 필터 탭 */}
          <FilterTabs
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
          />

          {/* 거래내역 목록 */}
          <ScrollView
            className='flex-1 mt-6'
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {filteredTransactions.length === 0 ? (
              <EmptyState selectedFilter={selectedFilter} />
            ) : (
              <View className='flex flex-col gap-3'>
                {filteredTransactions.map(transaction => (
                  <TransactionItem
                    key={transaction.id}
                    transaction={transaction}
                    onPress={handleTransactionPress}
                  />
                ))}
              </View>
            )}
          </ScrollView>

          {/* 영수증 모달 */}
          <ReceiptModal
            visible={receiptModalVisible}
            transaction={selectedTransaction}
            onClose={closeReceiptModal}
            onPrint={handlePrint}
          />
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
