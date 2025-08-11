import 'dayjs/locale/ko';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { AdminProtectedRoute } from '../../components';
import PageHeader from '../../components/common/PageHeader';
import EmptyState from '../../components/history/EmptyState';
import FilterTabs, { FilterType } from '../../components/history/FilterTabs';
import ReceiptModal from '../../components/history/ReceiptModal';
import TransactionItem, {
  Transaction,
} from '../../components/history/TransactionItem';

// Day.js 설정
dayjs.locale('ko');
dayjs.extend(relativeTime);

export default function History() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);

  // 임시 거래내역 데이터 (실제로는 서비스에서 가져올 것)
  const mockTransactions: Transaction[] = [
    {
      id: 'CASH_1734567890123',
      date: '2024-12-19 14:30:15',
      paymentMethod: '현금',
      amount: 15000,
    },
    {
      id: 'LEDGER_1734567890124',
      date: '2024-12-19 13:25:42',
      paymentMethod: '장부',
      amount: 8500,
    },
    {
      id: 'CASH_1734567890125',
      date: '2024-12-19 12:18:30',
      paymentMethod: '이체',
      amount: 12000,
    },
    {
      id: 'CASH_1734567890126',
      date: '2024-12-19 11:45:20',
      paymentMethod: '쿠폰',
      amount: 6000,
    },
    {
      id: 'CASH_1734567890127',
      date: '2024-12-19 10:30:15',
      paymentMethod: '현금',
      amount: 4500,
    },
    {
      id: 'LEDGER_1734567890128',
      date: '2024-12-18 16:22:35',
      paymentMethod: '장부',
      amount: 9000,
    },
    {
      id: 'CASH_1734567890129',
      date: '2024-12-18 15:10:45',
      paymentMethod: '이체',
      amount: 18000,
    },
    {
      id: 'CASH_1734567890130',
      date: '2024-12-18 14:05:20',
      paymentMethod: '현금',
      amount: 7500,
    },
  ];

  useEffect(() => {
    // 거래내역 불러오기 (실제로는 API 호출)
    setTransactions(mockTransactions);
  }, []);

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
    console.log('영수증 출력:', selectedTransaction);
    // 실제 출력 로직 구현
    closeReceiptModal();
  };

  // 필터링된 거래내역
  const filteredTransactions = transactions.filter(transaction => {
    if (selectedFilter === 'all') return true;
    return transaction.paymentMethod === selectedFilter;
  });

  return (
    <AdminProtectedRoute>
      <View className='h-full w-full bg-white flex flex-col box-border px-[5%]'>
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
          onClose={closeReceiptModal}
          onPrint={handlePrint}
        />
      </View>
    </AdminProtectedRoute>
  );
}
