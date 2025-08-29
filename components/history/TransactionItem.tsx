import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

import { Transaction, TransactionType } from '../../types';

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export default function TransactionItem({
  transaction,
  onPress,
}: TransactionItemProps) {
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

  // 결제 수단별 스타일 클래스 반환
  const getPaymentMethodClass = (label: string) => {
    switch (label) {
      case '현금':
        return {
          icon: 'cash-outline',
          bgClass: 'bg-green-100',
          textClass: 'text-green-600',
          iconColor: '#10B981',
        };
      case '이체':
        return {
          icon: 'card-outline',
          bgClass: 'bg-blue-100',
          textClass: 'text-blue-600',
          iconColor: '#3B82F6',
        };
      case '쿠폰':
        return {
          icon: 'ticket-outline',
          bgClass: 'bg-yellow-100',
          textClass: 'text-yellow-600',
          iconColor: '#F59E0B',
        };
      case '장부':
        return {
          icon: 'book-outline',
          bgClass: 'bg-purple-100',
          textClass: 'text-purple-600',
          iconColor: '#8B5CF6',
        };
      case '입금':
        return {
          icon: 'add-circle-outline',
          bgClass: 'bg-emerald-100',
          textClass: 'text-emerald-600',
          iconColor: '#10B981',
        };
      case '출금':
        return {
          icon: 'remove-circle-outline',
          bgClass: 'bg-red-100',
          textClass: 'text-red-600',
          iconColor: '#EF4444',
        };
      default:
        return {
          icon: 'document-outline',
          bgClass: 'bg-gray-100',
          textClass: 'text-gray-600',
          iconColor: '#6B7280',
        };
    }
  };

  // 날짜 포맷팅 (Date 객체 처리)
  const formatDate = (date: Date) => {
    const dayjsDate = dayjs(date);
    return {
      date: dayjsDate.format('YYYY.MM.DD'),
      time: dayjsDate.format('HH:mm'),
      isToday: dayjsDate.isSame(dayjs(), 'day'),
      isYesterday: dayjsDate.isSame(dayjs().subtract(1, 'day'), 'day'),
    };
  };

  // 날짜 표시 텍스트 생성
  const getDateDisplayText = (formattedDate: ReturnType<typeof formatDate>) => {
    if (formattedDate.isToday) {
      return '오늘';
    } else if (formattedDate.isYesterday) {
      return '어제';
    } else {
      return formattedDate.date;
    }
  };

  const transactionLabel = getTransactionLabel(transaction);
  const paymentStyle = getPaymentMethodClass(transactionLabel);
  const formattedDate = formatDate(transaction.timestamp);

  return (
    <Pressable
      onPress={() => onPress(transaction)}
      className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm active:bg-gray-50'
    >
      <View className='flex flex-row items-center justify-between'>
        {/* 좌측: 아이콘 및 기본 정보 */}
        <View className='flex flex-row items-center flex-1'>
          <View
            className={clsx(
              'w-12 h-12 rounded-full flex items-center justify-center mr-4',
              paymentStyle.bgClass
            )}
          >
            <Ionicons
              name={paymentStyle.icon as any}
              size={24}
              color={paymentStyle.iconColor}
            />
          </View>

          <View className='flex-1'>
            <View className='flex flex-row items-center gap-2 mb-1'>
              <Text className='text-gray-600 text-sm'>
                #{transaction.id.substring(4, 12)}
              </Text>
              <View
                className={clsx('px-2 py-1 rounded-full', paymentStyle.bgClass)}
              >
                <Text
                  className={clsx(
                    'text-xs font-medium',
                    paymentStyle.textClass
                  )}
                >
                  {transactionLabel}
                </Text>
              </View>
            </View>

            <View className='flex flex-row items-center gap-2'>
              <Text className='text-gray-600 text-sm font-medium'>
                {getDateDisplayText(formattedDate)}
              </Text>
              <Text className='text-gray-400 text-sm'>
                {formattedDate.time}
              </Text>
            </View>
          </View>
        </View>

        {/* 우측: 금액 및 화살표 */}
        <View className='flex flex-row items-center gap-2'>
          <Text
            className={clsx(
              'text-lg font-bold',
              transaction.type === TransactionType.CASH_WITHDRAWAL
                ? 'text-red-600'
                : 'text-gray-800'
            )}
          >
            {transaction.totalAmount.toLocaleString()}원
          </Text>
          <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
        </View>
      </View>
    </Pressable>
  );
}
