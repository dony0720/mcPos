import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React from 'react';
import { Pressable, Text, View } from 'react-native';

export interface OrderItem {
  id: string;
  menuName: string;
  options: string;
  price: number;
  quantity: number;
}

export interface Transaction {
  id: string;
  date: string;
  paymentMethod: string;
  amount: number;
  orderItems?: OrderItem[];
  orderMethod?: string; // 테이크아웃, 매장
}

interface TransactionItemProps {
  transaction: Transaction;
  onPress: (transaction: Transaction) => void;
}

export default function TransactionItem({
  transaction,
  onPress,
}: TransactionItemProps) {
  // 결제 수단별 스타일 클래스 반환
  const getPaymentMethodClass = (paymentMethod: string) => {
    switch (paymentMethod) {
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
      default:
        return {
          icon: 'document-outline',
          bgClass: 'bg-gray-100',
          textClass: 'text-gray-600',
          iconColor: '#6B7280',
        };
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    const date = dayjs(dateString);
    return {
      date: date.format('YYYY.MM.DD'),
      time: date.format('HH:mm'),
      relative: date.fromNow(),
      isToday: date.isSame(dayjs(), 'day'),
      isYesterday: date.isSame(dayjs().subtract(1, 'day'), 'day'),
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

  const paymentStyle = getPaymentMethodClass(transaction.paymentMethod);
  const formattedDate = formatDate(transaction.date);

  return (
    <Pressable
      onPress={() => onPress(transaction)}
      className='bg-white border border-gray-200 rounded-lg p-4 shadow-sm active:bg-gray-50'
    >
      <View className='flex flex-row items-center justify-between'>
        {/* 좌측: 아이콘 및 기본 정보 */}
        <View className='flex flex-row items-center flex-1'>
          <View
            className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${paymentStyle.bgClass}`}
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
                #{transaction.id.split('_')[1]}
              </Text>
              <View
                className={`px-2 py-1 rounded-full ${paymentStyle.bgClass}`}
              >
                <Text
                  className={`text-xs font-medium ${paymentStyle.textClass}`}
                >
                  {transaction.paymentMethod}
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
              <Text className='text-gray-400 text-xs'>
                ({formattedDate.relative})
              </Text>
            </View>
          </View>
        </View>

        {/* 우측: 금액 및 화살표 */}
        <View className='flex flex-row items-center gap-2'>
          <Text className='text-lg font-bold text-gray-800'>
            {transaction.amount.toLocaleString()}원
          </Text>
          <Ionicons name='chevron-forward' size={20} color='#9CA3AF' />
        </View>
      </View>
    </Pressable>
  );
}
