import 'dayjs/locale/ko';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';

import { AdminProtectedRoute } from '../../components';
import PageHeader from '../../components/common/PageHeader';
import {
  CashTransactionModal,
  EmptyState,
  FilterTabs,
  ReceiptModal,
  TransactionItem,
} from '../../components/history';
import { useTransactionStore } from '../../stores';
import {
  CashInspectionReceiptData,
  FilterType,
  Transaction,
  TransactionType,
} from '../../types';
import { createPrinterService } from '../../utils';

// Day.js 설정
dayjs.locale('ko');
dayjs.extend(relativeTime);

export default function History() {
  // 거래내역 스토어에서 데이터 가져오기
  const { transactions: storeTransactions } = useTransactionStore();

  const [selectedFilter, setSelectedFilter] = useState<FilterType>(
    FilterType.ALL
  );
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [cashTransactionModalVisible, setCashTransactionModalVisible] =
    useState(false);

  // 거래내역 클릭 핸들러
  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);

    // 입출금 거래인지 확인하여 적절한 모달 열기
    if (
      transaction.type === TransactionType.CASH_DEPOSIT ||
      transaction.type === TransactionType.CASH_WITHDRAWAL
    ) {
      setCashTransactionModalVisible(true);
    } else {
      setReceiptModalVisible(true);
    }
  };

  // 영수증 모달 닫기
  const closeReceiptModal = () => {
    setReceiptModalVisible(false);
    setSelectedTransaction(null);
  };

  // 입출금 모달 닫기
  const closeCashTransactionModal = () => {
    setCashTransactionModalVisible(false);
    setSelectedTransaction(null);
  };

  /**
   * 현금 거래를 영수증 데이터로 변환하는 함수 (SRP: 단일 책임 원칙)
   * @param transaction - 현금 거래 정보
   * @returns CashInspectionReceiptData - 프린터 출력용 데이터
   */
  const convertToCashReceiptData = (
    transaction: Transaction
  ): CashInspectionReceiptData => {
    const transactionTypeText =
      transaction.type === TransactionType.CASH_DEPOSIT
        ? '현금 입금'
        : '현금 출금';
    const currentDate = new Date().toLocaleString('ko-KR');

    return {
      header: {
        storeName: 'MC POS',
        title: `${transactionTypeText} 영수증`,
        dateTime: currentDate,
      },
      cashData: transaction.cashBreakdown?.map(breakdown => ({
        denomination: `${breakdown.denomination.toLocaleString()}원`,
        quantity: breakdown.quantity,
        amount: breakdown.total,
      })) || [
        {
          denomination: '총 금액',
          quantity: 1,
          amount: transaction.totalAmount,
        },
      ],
      summary: {
        totalAmount: transaction.totalAmount,
        inspector: '관리자', // 실제 로그인한 사용자 이름으로 대체 가능
      },
    };
  };

  // 현금 거래 영수증 출력 핸들러 (실제 프린터 연동)
  const handleCashTransactionPrint = async () => {
    if (!selectedTransaction) {
      return;
    }

    const transactionTypeText =
      selectedTransaction.type === TransactionType.CASH_DEPOSIT
        ? '입금'
        : '출금';

    Alert.alert(
      '영수증 출력',
      `${transactionTypeText} 영수증을 출력하시겠습니까?`,
      [
        { text: '취소', style: 'cancel' },
        {
          text: '출력',
          onPress: async () => {
            try {
              // 프린터 서비스 인스턴스 생성 (DIP: 의존성 역전 원칙)
              const printerService = createPrinterService();

              // 현금 거래 데이터를 영수증 데이터로 변환
              const receiptData = convertToCashReceiptData(selectedTransaction);

              // 프린터로 영수증 출력
              const result =
                await printerService.printCashInspection(receiptData);

              if (result.success) {
                Alert.alert(
                  '출력 완료',
                  `${transactionTypeText} 영수증이 출력되었습니다.`
                );
              } else {
                Alert.alert(
                  '출력 실패',
                  result.message || '영수증 출력 중 오류가 발생했습니다.',
                  [
                    { text: '확인' },
                    {
                      text: '재시도',
                      onPress: () => handleCashTransactionPrint(),
                    },
                  ]
                );
              }
            } catch {
              // 영수증 출력 오류 처리
              Alert.alert(
                '출력 오류',
                '영수증 출력 중 예상치 못한 오류가 발생했습니다.',
                [
                  { text: '확인' },
                  {
                    text: '재시도',
                    onPress: () => handleCashTransactionPrint(),
                  },
                ]
              );
            }
          },
        },
      ]
    );
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

  // 거래 타입별 라벨 가져오기
  const getTransactionLabel = (transaction: Transaction) => {
    if (
      transaction.type === TransactionType.ORDER &&
      transaction.paymentMethod
    ) {
      return getPaymentMethodLabel(transaction.paymentMethod);
    } else if (transaction.type === TransactionType.CASH_DEPOSIT) {
      return '입금';
    } else if (transaction.type === TransactionType.CASH_WITHDRAWAL) {
      return '출금';
    } else if (!transaction.type && transaction.paymentMethod) {
      // 기존 거래 (type 필드가 없는 경우)
      return getPaymentMethodLabel(transaction.paymentMethod);
    }
    return '기타';
  };

  // 필터링된 거래내역
  const filteredTransactions = storeTransactions.filter(transaction => {
    if (selectedFilter === FilterType.ALL) return true;
    const transactionLabel = getTransactionLabel(transaction);
    return transactionLabel === selectedFilter;
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
            className='flex-1 mt-6 pb-5'
            showsVerticalScrollIndicator={false}
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

          {/* 영수증 모달 (주문 거래용) */}
          <ReceiptModal
            visible={receiptModalVisible}
            transaction={selectedTransaction}
            onClose={closeReceiptModal}
          />

          {/* 입출금 거래 모달 */}
          <CashTransactionModal
            visible={cashTransactionModalVisible}
            transaction={selectedTransaction}
            onClose={closeCashTransactionModal}
            onPrint={handleCashTransactionPrint}
          />
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
