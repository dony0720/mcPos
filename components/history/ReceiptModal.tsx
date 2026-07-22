import 'dayjs/locale/ko';

import { Ionicons } from '@expo/vector-icons';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { DiscountType, ReceiptData, Transaction } from '../../types';
import { createPrinterService } from '../../utils';

dayjs.locale('ko');

interface ReceiptModalProps {
  visible: boolean;
  transaction?: Transaction | null;
  onClose: () => void;
}

export default function ReceiptModal({
  visible,
  transaction,
  onClose,
}: ReceiptModalProps) {
  const [isPrinting, setIsPrinting] = useState(false);
  const printerService = createPrinterService();

  // 거래 정보가 없으면 빈 모달 표시
  if (!transaction) {
    return null;
  }

  /**
   * 영수증 출력 핸들러
   * - SRP: 영수증 출력만 담당
   */
  const handlePrint = async () => {
    if (isPrinting) return;

    setIsPrinting(true);
    try {
      // 쿠폰 금액 추출
      let couponAmount = 0;
      if (transaction.paymentDetails) {
        if (
          transaction.paymentDetails.type === 'COUPON' ||
          transaction.paymentDetails.type === 'COUPON_CASH'
        ) {
          couponAmount = transaction.paymentDetails.couponAmount;
        }
      }

      // 받은 금액과 거스름돈 추출
      let receivedAmount: number | undefined;
      let changeAmount: number | undefined;
      if (transaction.paymentDetails) {
        if (transaction.paymentDetails.type === 'CASH') {
          receivedAmount = transaction.paymentDetails.receivedAmount;
          changeAmount = transaction.paymentDetails.changeAmount;
        } else if (transaction.paymentDetails.type === 'COUPON_CASH') {
          receivedAmount = transaction.paymentDetails.receivedAmount;
          changeAmount = transaction.paymentDetails.changeAmount;
        }
      }

      // 거래 데이터를 영수증 데이터로 변환
      const receiptData: ReceiptData = {
        header: {
          storeName: 'MC POS',
          storeAddress: '',
          storePhone: '',
          receiptNumber: transaction.pickupNumber || transaction.id,
          dateTime: dayjs(transaction.timestamp).format(
            'YYYY-MM-DD A hh:mm:ss'
          ),
        },
        items:
          transaction.orderItems?.map(item => {
            // 온도와 옵션을 합쳐서 표시
            const allOptions: string[] = [];

            // 온도가 있으면 첫 번째 옵션으로 추가
            if (
              item.menuItem.temperatureRestriction !== 'NONE' &&
              item.menuItem.temperature
            ) {
              allOptions.push(item.menuItem.temperature);
            }

            // 나머지 옵션 추가
            if (item.options.length > 0) {
              allOptions.push(...item.options);
            }

            return {
              name: item.menuItem.name,
              quantity: item.quantity,
              unitPrice: item.menuItem.price,
              totalPrice: item.menuItem.price * item.quantity,
              options: allOptions.length > 0 ? allOptions : undefined,
            };
          }) || [],
        summary: {
          subtotal: transaction.totalAmount,
          discount: 0, // 할인은 이미 아이템 가격에 반영됨
          total: transaction.totalAmount,
          paymentMethod: getPaymentMethodLabel(
            transaction.paymentMethod || 'cash'
          ),
          couponAmount: couponAmount > 0 ? couponAmount : undefined,
          receivedAmount:
            receivedAmount && receivedAmount > 0 ? receivedAmount : undefined,
          changeAmount:
            changeAmount && changeAmount > 0 ? changeAmount : undefined,
        },
        footer: {
          message: transaction.orderMethod
            ? getOrderMethodLabel(transaction.orderMethod)
            : '',
        },
      };

      // 프린터로 출력
      await printerService.printReceipt(receiptData);
    } catch {
      // 에러 무시
    } finally {
      setIsPrinting(false);
    }
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

  // 주문 방법 ID를 한글로 변환
  const getOrderMethodLabel = (orderMethodId: string) => {
    switch (orderMethodId) {
      case 'takeout':
        return '테이크아웃';
      case 'dine-in':
        return '매장식사';
      default:
        return '기타';
    }
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
      supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
    >
      <View className='flex-1 justify-center items-center bg-black/50 px-8'>
        <View className='bg-white rounded-2xl p-6 w-full max-w-md h-[70%]'>
          {/* 모달 헤더 */}
          <View className='flex-row justify-end'>
            <Pressable onPress={onClose} className='p-2'>
              <Ionicons name='close' size={24} color='#666' />
            </Pressable>
          </View>

          <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
            {/* 가게 정보 */}
            <View className='items-center mb-6'>
              <Text className='text-lg font-bold mb-2'>
                목천카페{' '}
                {new Date(transaction.timestamp).toLocaleDateString('ko-KR')}{' '}
                {new Date(transaction.timestamp).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
              <Text className='text-base font-medium'>
                주문번호: #{transaction.pickupNumber}
              </Text>
              <Text className='text-sm text-gray-600 mt-1'>
                {transaction.orderMethod
                  ? getOrderMethodLabel(transaction.orderMethod)
                  : '알 수 없음'}{' '}
                |{' '}
                {transaction.paymentMethod
                  ? getPaymentMethodLabel(transaction.paymentMethod)
                  : '알 수 없음'}
              </Text>
            </View>

            {/* 구분선 */}
            <View className='w-full h-px bg-gray-300 mb-4' />

            {/* 주문 내역 */}
            {transaction.orderItems?.map((item, index) => {
              // 할인이 적용된 경우 실제 가격 계산
              const actualPrice = item.discount
                ? item.discount.type === DiscountType.FIXED_AMOUNT
                  ? item.discount.value
                  : item.menuItem.price - item.discount.value
                : item.menuItem.price;

              return (
                <View key={`${item.id}-${index}`} className='mb-4'>
                  {/* 메인 메뉴 */}
                  <View className='flex-row justify-between items-center mb-2'>
                    <View className='flex-1'>
                      <Text className='font-medium text-base'>
                        {item.menuItem.name}
                      </Text>
                      <Text className='text-sm text-gray-600'>
                        {item.menuItem.temperature || 'HOT'}
                        {item.discount && (
                          <Text className='text-red-500 ml-2'>
                            ({item.discount.name} 적용)
                          </Text>
                        )}
                      </Text>
                    </View>
                    <View className='flex-row items-center gap-4'>
                      <Text className='text-gray-600 text-sm w-6 text-center'>
                        {item.quantity}
                      </Text>
                      <Text className='font-medium text-base w-16 text-right'>
                        {actualPrice.toLocaleString()}원
                      </Text>
                    </View>
                  </View>

                  {/* 옵션들 */}
                  {item.options && item.options.length > 0 && (
                    <View className='ml-3'>
                      {item.options.map((optionName, optionIndex) => {
                        // 옵션 가격 찾기 (MENU_OPTIONS에서)
                        const optionPrice =
                          optionName === '샷추가'
                            ? 500
                            : optionName === '시럽추가'
                              ? 300
                              : optionName === '휘핑크림'
                                ? 700
                                : 0;

                        return (
                          <View
                            key={optionIndex}
                            className='flex-row justify-between items-center mb-1'
                          >
                            <Text className='text-gray-600 text-sm flex-1'>
                              - {optionName}
                            </Text>
                            <View className='flex-row items-center gap-4'>
                              <Text className='text-gray-600 text-sm w-6 text-center'>
                                {item.quantity}
                              </Text>
                              <Text className='text-gray-600 text-sm w-16 text-right'>
                                {optionPrice > 0
                                  ? `${optionPrice.toLocaleString()}원`
                                  : '0원'}
                              </Text>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* 구분선 */}
          <View className='w-full h-px bg-gray-300 mb-4' />

          {/* 하단 정보 */}
          <View className='items-center mb-6'>
            <Text className='text-xl font-bold mb-3'>
              총 결제금액: {transaction.totalAmount.toLocaleString()}원
            </Text>
          </View>

          {/* 출력 버튼 */}
          <Pressable
            onPress={handlePrint}
            disabled={isPrinting}
            className={`${
              isPrinting ? 'bg-gray-400' : 'bg-blue-500'
            } rounded-lg py-3 px-6 items-center`}
          >
            <View className='flex-row items-center'>
              <Ionicons
                name={isPrinting ? 'hourglass' : 'print'}
                size={20}
                color='white'
              />
              <Text className='text-white font-medium ml-2'>
                {isPrinting ? '출력 중...' : '출력하기'}
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
