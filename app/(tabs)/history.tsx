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
import { usePrinter } from '../../hooks';
import { useTransactionStore } from '../../stores';
import {
  CashInspectionReceiptData,
  FilterType,
  OrderReceiptData,
  Transaction,
  TransactionType,
} from '../../types';

// Day.js 설정
dayjs.locale('ko');
dayjs.extend(relativeTime);

export default function History() {
  // 거래내역 스토어에서 데이터 가져오기
  const { transactions: storeTransactions } = useTransactionStore();

  // 프린터 훅 사용 (SRP: 프린터 기능만 담당)
  const {
    printOrderReceipt,
    printCashInspection,
    isConnected: isPrinterConnected,
    isPrinting,
    lastError: printerError,
  } = usePrinter();

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
   * 주문 영수증 출력 핸들러 (SRP: 단일 책임 원칙)
   * @description 선택된 주문 거래의 영수증을 출력합니다
   */
  const handleReceiptPrint = async () => {
    if (!selectedTransaction) {
      Alert.alert('오류', '선택된 거래가 없습니다.');
      return;
    }

    // 주문 거래가 아닌 경우 처리
    if (selectedTransaction.type !== TransactionType.ORDER) {
      Alert.alert('오류', '주문 거래만 영수증을 출력할 수 있습니다.');
      return;
    }

    // 프린터 연결 상태 확인
    if (!isPrinterConnected) {
      Alert.alert('프린터 오류', '프린터가 연결되지 않았습니다.\n프린터 연결을 확인해주세요.');
      return;
    }

    try {
      // 거래 데이터를 영수증 데이터로 변환
      const receiptData = convertToOrderReceiptData(selectedTransaction);
      
      // 출력 확인 다이얼로그
      Alert.alert(
        '영수증 출력',
        '주문 영수증을 출력하시겠습니까?',
        [
          { text: '취소', style: 'cancel' },
          {
            text: '출력',
            onPress: async () => {
              const success = await printOrderReceipt(receiptData);
              
              if (success) {
                Alert.alert('출력 완료', '영수증이 출력되었습니다.');
                closeReceiptModal();
              } else {
                Alert.alert(
                  '출력 실패', 
                  printerError || '영수증 출력 중 오류가 발생했습니다.',
                  [
                    { text: '확인' },
                    { text: '재시도', onPress: handleReceiptPrint },
                  ]
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('오류', `영수증 데이터 변환 중 오류가 발생했습니다: ${error}`);
    }
  };

  /**
   * 현금 거래 영수증 출력 핸들러
   * @description 입금/출금 거래의 영수증을 출력합니다
   */
  const handleCashTransactionPrint = async () => {
    if (!selectedTransaction) {
      Alert.alert('오류', '선택된 거래가 없습니다.');
      return;
    }

    // 현금 거래가 아닌 경우 처리
    if (
      selectedTransaction.type !== TransactionType.CASH_DEPOSIT &&
      selectedTransaction.type !== TransactionType.CASH_WITHDRAWAL
    ) {
      Alert.alert('오류', '현금 입출금 거래만 출력할 수 있습니다.');
      return;
    }

    // 프린터 연결 상태 확인
    if (!isPrinterConnected) {
      Alert.alert('프린터 오류', '프린터가 연결되지 않았습니다.\n프린터 연결을 확인해주세요.');
      return;
    }

    try {
      const transactionTypeText =
        selectedTransaction.type === TransactionType.CASH_DEPOSIT ? '입금' : '출금';

      // 거래 데이터를 영수증 데이터로 변환
      const receiptData = convertToCashInspectionReceiptData(selectedTransaction);
      
      // 출력 확인 다이얼로그
      Alert.alert(
        '영수증 출력',
        `${transactionTypeText} 영수증을 출력하시겠습니까?`,
        [
          { text: '취소', style: 'cancel' },
          {
            text: '출력',
            onPress: async () => {
              const success = await printCashInspection(receiptData);
              
              if (success) {
                Alert.alert('출력 완료', `${transactionTypeText} 영수증이 출력되었습니다.`);
                closeCashTransactionModal();
              } else {
                Alert.alert(
                  '출력 실패',
                  printerError || '영수증 출력 중 오류가 발생했습니다.',
                  [
                    { text: '확인' },
                    { text: '재시도', onPress: handleCashTransactionPrint },
                  ]
                );
              }
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('오류', `영수증 데이터 변환 중 오류가 발생했습니다: ${error}`);
    }
  };

  /**
   * 주문 거래를 영수증 데이터로 변환하는 함수 (SRP: 단일 책임 원칙)
   * @param transaction - 주문 거래 정보
   * @returns OrderReceiptData - 프린터 출력용 데이터
   */
  const convertToOrderReceiptData = (transaction: Transaction): OrderReceiptData => {
    const currentDate = new Date(transaction.timestamp).toLocaleString('ko-KR');

    return {
      header: {
        storeName: 'MC POS',
        title: '주문 영수증',
        dateTime: currentDate,
        transactionId: `#${transaction.id.substring(0, 8)}`,
      },
      orderItems: transaction.orderItems?.map(item => ({
        name: item.menuItem.name,
        quantity: item.quantity,
        unitPrice: item.menuItem.price,
        totalPrice: item.menuItem.price * item.quantity,
        options: item.options || [],
        discount: item.discount ? {
          name: item.discount.name,
          amount: item.discount.value,
        } : undefined,
      })) || [],
      summary: {
        totalAmount: transaction.totalAmount,
        subtotal: transaction.totalAmount,
        discountAmount: 0, // TODO: 할인 금액 계산
        finalAmount: transaction.totalAmount,
        paymentMethod: getPaymentMethodLabel(transaction.paymentMethod || ''),
      },
      footer: {
        pickupNumber: transaction.pickupNumber,
        orderMethod: transaction.orderMethod ? 
          (transaction.orderMethod === 'takeout' ? '테이크아웃' : '매장') : 
          undefined,
      },
    };
  };

  /**
   * 현금 거래를 영수증 데이터로 변환하는 함수 (SRP: 단일 책임 원칙)
   * @param transaction - 현금 거래 정보
   * @returns CashInspectionReceiptData - 프린터 출력용 데이터
   */
  const convertToCashInspectionReceiptData = (
    transaction: Transaction
  ): CashInspectionReceiptData => {
    const transactionTypeText =
      transaction.type === TransactionType.CASH_DEPOSIT
        ? '현금 입금'
        : '현금 출금';
    const currentDate = new Date(transaction.timestamp).toLocaleString('ko-KR');

    return {
      header: {
        storeName: 'MC POS',
        title: `${transactionTypeText} 영수증`,
        dateTime: currentDate,
        transactionId: `#${transaction.id.substring(0, 8)}`,
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

          {/* 영수증 모달 (주문 거래용) */}
          <ReceiptModal
            visible={receiptModalVisible}
            transaction={selectedTransaction}
            onClose={closeReceiptModal}
            onPrint={handleReceiptPrint}
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
