// payment.tsx - 퍼블리싱 작업용 간소화된 결제 페이지

import { useFocusEffect } from '@react-navigation/native';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import {
  CashAmountModal,
  CouponAmountModal,
  DiscountSection,
  LedgerSelectionModal,
  NumberInputModal,
  OrderMethodSelector,
  PaymentHeader,
  PaymentMenuItem,
  PaymentMethodSelector,
  SelectAllCheckbox,
} from '../components';
import { useButtonAnimation, useModal } from '../hooks';
import {
  useCashStore,
  useLedgerStore,
  useOrderStore,
  useTransactionStore,
} from '../stores';
import {
  CashRegisterPaymentId,
  CashTransactionType,
  Discount,
  LedgerData,
  NumberInputType,
  OrderReceiptMethod as OrderReceiptMethodEnum,
  OrderReceiptMethodId,
  PaymentDetails,
  PaymentDetailsType,
  PaymentMethod,
  ReceiptData,
  TransactionStatus,
  TransactionType,
} from '../types';
import { calculateDiscountedUnitPrice, createPrinterService } from '../utils';

export default function Payment() {
  // Zustand 스토어에서 주문 데이터 가져오기
  const {
    orderItems,
    totalAmount,
    removeItem,
    applyDiscount,
    removeDiscount,
    clearOrder,
  } = useOrderStore();

  // 거래내역 스토어
  const { addTransaction } = useTransactionStore();

  // 현금 관리 스토어
  const {
    applyCashBreakdown,
    calculateOptimalBreakdown,
    calculateOptimalChangeBreakdown,
  } = useCashStore();

  // 장부 관리 스토어
  const { getLedgersByPhoneLastDigits, useLedger } = useLedgerStore();

  // 간단한 상태 관리
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<CashRegisterPaymentId | null>(null);
  const [selectedOrderMethod, setSelectedOrderMethod] =
    useState<OrderReceiptMethodId>(OrderReceiptMethodEnum.DINE_IN);

  // 모달 관리
  const { openModal, closeModal, isModalOpen } = useModal();
  const [modalType, setModalType] = useState<NumberInputType>('pickup');
  const [isLedgerFirstStep, setIsLedgerFirstStep] = useState(false);
  const [modalErrorMessage, setModalErrorMessage] = useState<string>('');

  // 현금 결제 관련 상태
  const [receivedAmount, setReceivedAmount] = useState(0);
  const [changeAmount, setChangeAmount] = useState(0);

  // 쿠폰 결제 관련 상태
  const [couponAmount, setCouponAmount] = useState(0);
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [shouldOpenCashModal, setShouldOpenCashModal] = useState(false);

  // 장부 결제 관련 상태
  const [phoneLastDigits, setPhoneLastDigits] = useState('');
  const [selectedLedger, setSelectedLedger] = useState<LedgerData | null>(null);
  const [isLedgerSelectionModalVisible, setIsLedgerSelectionModalVisible] =
    useState(false);

  const paymentButtonAnimation = useButtonAnimation();

  // 결제 방법별 세부 정보 생성
  const createPaymentDetails = (): PaymentDetails => {
    // 결제수단이 선택되지 않은 경우 기본값
    if (!selectedPaymentMethod) {
      return {
        type: PaymentDetailsType.CASH,
        receivedAmount: 0,
        changeAmount: 0,
      };
    }

    switch (selectedPaymentMethod) {
      case PaymentMethod.CASH:
        return {
          type: PaymentDetailsType.CASH,
          receivedAmount,
          changeAmount,
        };
      case PaymentMethod.COUPON:
        if (remainingAmount > 0) {
          return {
            type: PaymentDetailsType.COUPON_CASH,
            couponAmount,
            remainingAmount,
            receivedAmount,
            changeAmount,
          };
        } else {
          return {
            type: PaymentDetailsType.COUPON,
            couponAmount,
          };
        }
      case PaymentMethod.TRANSFER:
        return {
          type: PaymentDetailsType.TRANSFER,
        };
      case PaymentMethod.LEDGER:
        return {
          type: PaymentDetailsType.LEDGER,
          phoneNumber: selectedLedger?.phoneNumber || '',
        };
      default:
        return {
          type: PaymentDetailsType.CASH,
          receivedAmount: 0,
          changeAmount: 0,
        };
    }
  };

  // 결제 방법별 실제 금액 분리 생성
  const createPaymentBreakdown = () => {
    const breakdown: {
      cash?: number;
      transfer?: number;
      coupon?: number;
      ledger?: number;
    } = {};

    // 결제수단이 선택되지 않은 경우 기본값
    if (!selectedPaymentMethod) {
      return breakdown;
    }

    switch (selectedPaymentMethod) {
      case PaymentMethod.CASH:
        breakdown.cash = totalAmount;
        break;
      case PaymentMethod.COUPON:
        if (remainingAmount > 0) {
          // 쿠폰 + 현금 조합
          breakdown.coupon = couponAmount;
          breakdown.cash = remainingAmount;
        } else {
          // 쿠폰 전액 결제 또는 초과 결제
          breakdown.coupon = couponAmount;
        }
        break;
      case PaymentMethod.TRANSFER:
        breakdown.transfer = totalAmount;
        break;
      case PaymentMethod.LEDGER:
        breakdown.ledger = totalAmount;
        break;
    }

    return breakdown;
  };

  // 영수증 출력 함수
  const printReceipt = async (
    transactionId: string,
    pickupNumber: string
  ): Promise<void> => {
    try {
      const printerService = createPrinterService();

      // 영수증 데이터 생성
      const receiptData: ReceiptData = {
        header: {
          storeName: 'MC POS',
          storeAddress: '',
          storePhone: '',
          receiptNumber: pickupNumber,
          dateTime: new Date().toLocaleString('ko-KR'),
        },
        items: orderItems.map(item => {
          const unitPrice = calculateDiscountedUnitPrice(item);

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
            unitPrice: unitPrice,
            totalPrice: unitPrice * item.quantity,
            options: allOptions.length > 0 ? allOptions : undefined,
          };
        }),
        summary: {
          subtotal: totalAmount,
          discount: 0, // 할인은 이미 아이템 가격에 반영됨
          total: totalAmount,
          paymentMethod: getPaymentMethodName(selectedPaymentMethod),
          couponAmount:
            selectedPaymentMethod === PaymentMethod.COUPON && couponAmount > 0
              ? couponAmount
              : undefined,
          receivedAmount: receivedAmount > 0 ? receivedAmount : undefined,
          changeAmount: changeAmount > 0 ? changeAmount : undefined,
        },
        footer: {
          message: getOrderMethodName(selectedOrderMethod),
        },
      };

      // 영수증 2장 출력
      for (let i = 0; i < 2; i++) {
        const result = await printerService.printReceipt(receiptData);

        if (!result.success) {
          Alert.alert(
            '영수증 출력 실패',
            result.message || `${i + 1}번째 영수증 출력에 실패했습니다.`
          );
          break; // 첫 번째 출력 실패 시 중단
        }
      }
    } catch {
      Alert.alert('영수증 출력 오류', '영수증 출력 중 오류가 발생했습니다.');
    }
  };

  // 결제 방법 이름 변환
  const getPaymentMethodName = (
    method: CashRegisterPaymentId | null
  ): string => {
    if (!method) {
      return '미선택';
    }
    switch (method) {
      case PaymentMethod.CASH:
        return '현금';
      case PaymentMethod.COUPON:
        return remainingAmount > 0 ? '쿠폰+현금' : '쿠폰';
      case PaymentMethod.TRANSFER:
        return '계좌이체';
      case PaymentMethod.LEDGER:
        return '장부결제';
      default:
        return '기타';
    }
  };

  // 주문 방법 이름 변환
  const getOrderMethodName = (method: OrderReceiptMethodId): string => {
    switch (method) {
      case OrderReceiptMethodEnum.DINE_IN:
        return '매장식사';
      case OrderReceiptMethodEnum.TAKEOUT:
        return '테이크아웃';
      default:
        return '';
    }
  };

  // 페이지 포커스 시 선택 상태만 초기화 (할인은 유지)
  useFocusEffect(
    useCallback(() => {
      // 선택 상태만 초기화
      setCheckedItems(new Set());
      setIsAllChecked(false);
    }, [])
  );

  // 간단한 핸들러들
  const handleBack = () => {
    router.push('/(tabs)');
  };

  // 전체 선택/해제 핸들러
  const handleAllCheckboxPress = () => {
    if (isAllChecked) {
      // 전체 해제
      setIsAllChecked(false);
      setCheckedItems(new Set());
    } else {
      // 전체 선택
      setIsAllChecked(true);
      const allItemIds = new Set(orderItems.map(item => item.id));
      setCheckedItems(allItemIds);
    }
  };

  // 개별 아이템 체크박스 핸들러
  const handleItemCheckboxPress = (itemId: string) => {
    const newCheckedItems = new Set(checkedItems);

    if (newCheckedItems.has(itemId)) {
      newCheckedItems.delete(itemId);
    } else {
      newCheckedItems.add(itemId);
    }

    setCheckedItems(newCheckedItems);

    // 전체 선택 상태 업데이트
    const isAllSelected =
      newCheckedItems.size === orderItems.length && orderItems.length > 0;
    setIsAllChecked(isAllSelected);
  };

  // 선택된 아이템들 삭제 핸들러
  const handleDeleteSelected = () => {
    // 선택된 아이템들을 삭제
    checkedItems.forEach(itemId => {
      removeItem(itemId);
    });

    // 상태 초기화
    setCheckedItems(new Set());
    setIsAllChecked(false);
  };

  const handleDiscountSelect = (discount: Discount | null) => {
    if (discount && checkedItems.size > 0) {
      const selectedItemIds = Array.from(checkedItems);
      applyDiscount(selectedItemIds, {
        id: discount.id,
        name: discount.name,
        value: discount.value,
        type: discount.type,
      });

      // 할인 적용 후 선택 해제
      setCheckedItems(new Set());
      setIsAllChecked(false);
    }
  };

  const handleDiscountDelete = () => {
    if (checkedItems.size > 0) {
      const selectedItemIds = Array.from(checkedItems);
      removeDiscount(selectedItemIds);

      // 할인 제거 후 선택 해제
      setCheckedItems(new Set());
      setIsAllChecked(false);
    }
  };

  // 결제 수단 선택 핸들러 (선택 시 바로 모달 열기)
  const handlePaymentMethodPress = (method: CashRegisterPaymentId) => {
    // 결제 수단 변경
    setSelectedPaymentMethod(method);

    // 이전 결제 수단의 데이터 초기화
    if (method !== PaymentMethod.CASH && method !== PaymentMethod.COUPON) {
      setReceivedAmount(0);
      setChangeAmount(0);
    }
    if (method !== PaymentMethod.COUPON) {
      setCouponAmount(0);
      setRemainingAmount(0);
    }
    if (method !== PaymentMethod.LEDGER) {
      setSelectedLedger(null);
      setPhoneLastDigits('');
    }

    // 결제 수단에 따라 모달 열기
    if (method === PaymentMethod.CASH) {
      // 현금 결제: 받은 금액 입력 모달 열기
      openModal('cashAmount');
    } else if (method === PaymentMethod.COUPON) {
      // 쿠폰 결제: 쿠폰 금액 입력 모달 열기
      openModal('couponAmount');
    } else if (method === PaymentMethod.LEDGER) {
      // 장부 결제: 핸드폰 뒷자리 입력 모달 열기
      setModalType('phone');
      setIsLedgerFirstStep(true);
      setModalErrorMessage(''); // 에러 메시지 초기화
      openModal('numberInput');
    }
    // 계좌이체는 모달 없이 바로 선택만
  };

  // 결제하기 버튼 핸들러 (수령번호 입력)
  const handlePaymentPress = () => {
    // 수령번호 입력 모달 열기 (결제수단 체크 없이 바로 진행)
    setModalType('pickup');
    setIsLedgerFirstStep(false);
    openModal('numberInput');
  };

  // 쿠폰 결제: 쿠폰 금액 확인 핸들러
  const handleCouponAmountConfirm = (coupon: number, remaining: number) => {
    setCouponAmount(coupon);
    setRemainingAmount(remaining);
    closeModal();

    if (remaining > 0) {
      // 남은 금액이 있으면 현금 결제 모달 열기
      setShouldOpenCashModal(true);
    }
    // 수령번호는 "결제하기" 버튼을 눌러야 입력
  };

  // 현금 결제: 받은 금액 확인 핸들러
  const handleCashAmountConfirm = (received: number, change: number) => {
    setReceivedAmount(received);
    setChangeAmount(change);
    closeModal();
    // 수령번호는 "결제하기" 버튼을 눌러야 입력
  };

  // 쿠폰 결제 후 현금 모달 열기를 위한 useEffect
  useEffect(() => {
    if (shouldOpenCashModal) {
      openModal('cashAmount');
      setShouldOpenCashModal(false);
    }
  }, [shouldOpenCashModal, openModal]);

  const handleModalConfirm = (number: string) => {
    if (isLedgerFirstStep) {
      // 핸드폰 뒷자리 입력 완료 → 장부 검색 및 선택
      setPhoneLastDigits(number);
      const matchingLedgers = getLedgersByPhoneLastDigits(number);

      if (matchingLedgers.length === 0) {
        // 일치하는 장부가 없는 경우
        setModalErrorMessage(
          `입력하신 번호 "${number}"와 일치하는 장부를 찾을 수 없습니다.\n장부에 등록된 핸드폰 번호의 뒷자리 4자리를 정확히 입력해주세요.`
        );
        return false; // 에러 발생으로 모달 유지
      } else if (matchingLedgers.length === 1) {
        // 일치하는 장부가 하나인 경우 자동 선택
        const ledger = matchingLedgers[0];
        const currentAmount = parseInt(
          ledger.chargeAmount.replace(/[^\d]/g, ''),
          10
        );

        if (currentAmount < totalAmount) {
          setModalErrorMessage(
            `${ledger.name}님의 장부 잔액이 부족합니다.\n\n잔액: ${ledger.chargeAmount}\n결제 금액: ${totalAmount.toLocaleString()}원\n\n충전 후 다시 시도해주세요.`
          );
          return false; // 에러 발생으로 모달 유지
        }

        setSelectedLedger(ledger);
        setIsLedgerFirstStep(false);
        closeModal();
        // 수령 번호는 "결제하기" 버튼을 눌러야 입력
        return true;
      } else {
        // 일치하는 장부가 여러 개인 경우 선택 모달 표시
        setIsLedgerSelectionModalVisible(true);
        closeModal();
        return true; // 성공적으로 처리됨 (모달 전환)
      }
    } else {
      // 수령 번호 입력 완료 또는 일반 결제 완료

      // 장부 결제인데 선택된 장부가 없는 경우 차단
      if (selectedPaymentMethod === PaymentMethod.LEDGER && !selectedLedger) {
        setModalErrorMessage(
          '장부 결제 오류가 발생했습니다.\n장부를 다시 선택해주세요.'
        );
        return false; // 에러 발생으로 모달 유지
      }

      // 거래내역 저장
      const transactionId = addTransaction({
        type: TransactionType.ORDER,
        orderItems: orderItems,
        paymentMethod: selectedPaymentMethod || PaymentMethod.CASH,
        orderMethod: selectedOrderMethod,
        totalAmount: totalAmount,
        pickupNumber: number,
        paymentDetails: createPaymentDetails(),
        paymentBreakdown: createPaymentBreakdown(),
        status: TransactionStatus.COMPLETED,
      });

      if (selectedPaymentMethod === PaymentMethod.CASH) {
        // 자동 권종 분리 처리
        const receivedBreakdown = calculateOptimalBreakdown(receivedAmount);
        const changeBreakdown = calculateOptimalChangeBreakdown(changeAmount);

        // 현금 서랍에 자동으로 적용
        applyCashBreakdown(
          receivedBreakdown,
          changeBreakdown,
          CashTransactionType.SALE,
          '현금 결제',
          transactionId
        );
      } else if (selectedPaymentMethod === PaymentMethod.COUPON) {
        if (remainingAmount > 0) {
          // 쿠폰+현금 결제에서 현금 부분 자동 권종 분리
          const receivedBreakdown = calculateOptimalBreakdown(receivedAmount);
          const changeBreakdown = calculateOptimalChangeBreakdown(changeAmount);

          // 현금 서랍에 자동으로 적용
          applyCashBreakdown(
            receivedBreakdown,
            changeBreakdown,
            CashTransactionType.SALE,
            '쿠폰+현금 결제',
            transactionId
          );
        }
      } else if (
        selectedPaymentMethod === PaymentMethod.LEDGER &&
        selectedLedger
      ) {
        // 장부 결제: 장부에서 금액 차감
        try {
          useLedger(selectedLedger.memberNumber, {
            amount: totalAmount,
            receptionist: 'POS 시스템',
          });
        } catch {
          closeModal();
          return false; // 에러 발생
        }
      }

      // 영수증 출력
      printReceipt(transactionId, number);

      // 결제 완료 후 주문 데이터 초기화
      clearOrder();

      // 장부 결제 관련 상태 초기화
      setSelectedLedger(null);
      setPhoneLastDigits('');

      closeModal();

      // 메뉴 선택 페이지로 이동
      router.push('/(tabs)');
    }

    return true; // 성공적으로 처리됨
  };

  // 장부 선택 핸들러
  const handleLedgerSelect = (ledger: LedgerData) => {
    // 잔액 확인
    const currentAmount = parseInt(
      ledger.chargeAmount.replace(/[^\d]/g, ''),
      10
    );
    if (currentAmount < totalAmount) {
      return;
    }

    setSelectedLedger(ledger);
    setIsLedgerSelectionModalVisible(false); // 장부 선택 모달 닫기
    setIsLedgerFirstStep(false);
    // 수령 번호는 "결제하기" 버튼을 눌러야 입력
  };

  return (
    <View className='h-full w-full bg-white flex flex-col'>
      <View className='flex-1 max-w-7xl mx-auto w-full'>
        {/* 상단 헤더 섹션 */}
        <PaymentHeader onBack={handleBack} />

        {/* 전체 선택 체크박스 섹션 */}
        <SelectAllCheckbox
          isChecked={isAllChecked}
          onCheckboxPress={handleAllCheckboxPress}
          onDeletePress={handleDeleteSelected}
          hasSelectedItems={checkedItems.size > 0}
          title='결제 정보'
        />

        {/* 주문 메뉴 목록 섹션 */}
        <ScrollView
          className='w-full h-[50%] px-[5%] box-border overflow-hidden'
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingVertical: 16 }}
        >
          {orderItems.map(item => {
            // 할인이 적용된 단위 가격 계산
            const unitPrice = calculateDiscountedUnitPrice(item);
            const itemTotalPrice = unitPrice * item.quantity;

            // 메뉴명에 할인 정보 추가
            const menuName = item.discount
              ? `${item.menuItem.name} (${item.menuItem.temperature}) x${item.quantity} [${item.discount.name}]`
              : `${item.menuItem.name} (${item.menuItem.temperature}) x${item.quantity}`;

            return (
              <PaymentMenuItem
                key={item.id}
                isChecked={checkedItems.has(item.id)}
                onCheckboxPress={() => handleItemCheckboxPress(item.id)}
                menuName={menuName}
                options={item.options.join(', ')}
                price={`${itemTotalPrice.toLocaleString()}원`}
                menuImage={item.menuItem.image || ''}
              />
            );
          })}
        </ScrollView>

        {/* 구분선 */}
        <View className='w-full h-[1px] bg-gray-300' />

        <View className='w-full h-[50%] px-[5%] pb-10 box-border flex flex-col justify-between'>
          {/* 결제 방법 선택 섹션 */}
          <PaymentMethodSelector
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodPress={handlePaymentMethodPress}
          />

          {/* 주문 방법 선택 섹션 */}
          <OrderMethodSelector
            selectedOrderMethod={selectedOrderMethod}
            onOrderMethodPress={setSelectedOrderMethod}
          />

          {/* 할인 적용 섹션 */}
          <DiscountSection
            onDiscountSelect={handleDiscountSelect}
            onDiscountDelete={handleDiscountDelete}
            hasSelectedItems={checkedItems.size > 0}
          />

          {/* 최종 결제 버튼 섹션 */}
          <Pressable
            onPressIn={paymentButtonAnimation.onPressIn}
            onPressOut={paymentButtonAnimation.onPressOut}
            onPress={handlePaymentPress}
          >
            <Animated.View
              className='w-full h-16 sm:h-20 lg:h-24 min-h-16 max-h-28 bg-primaryGreen flex items-center justify-center rounded-lg'
              style={{
                transform: [{ scale: paymentButtonAnimation.scaleAnim }],
              }}
            >
              <Text className='text-white text-3xl font-bold'>
                {totalAmount.toLocaleString()}원 결제하기
              </Text>
            </Animated.View>
          </Pressable>

          {/* 현금 결제: 받은 금액 입력 모달 */}
          <CashAmountModal
            visible={isModalOpen('cashAmount')}
            totalAmount={remainingAmount > 0 ? remainingAmount : totalAmount}
            onClose={closeModal}
            onConfirm={handleCashAmountConfirm}
          />

          {/* 쿠폰 결제: 쿠폰 금액 입력 모달 */}
          <CouponAmountModal
            visible={isModalOpen('couponAmount')}
            totalAmount={totalAmount}
            onClose={closeModal}
            onConfirm={handleCouponAmountConfirm}
          />

          {/* 번호 입력 모달 */}
          <NumberInputModal
            visible={isModalOpen('numberInput')}
            onClose={() => {
              setModalErrorMessage(''); // 에러 메시지 초기화
              closeModal();
            }}
            onConfirm={handleModalConfirm}
            type={modalType}
            errorMessage={modalErrorMessage}
            onInputChange={() => setModalErrorMessage('')}
          />

          {/* 장부 선택 모달 */}
          <LedgerSelectionModal
            visible={isLedgerSelectionModalVisible}
            onClose={() => setIsLedgerSelectionModalVisible(false)}
            onSelect={handleLedgerSelect}
            ledgers={getLedgersByPhoneLastDigits(phoneLastDigits)}
            phoneLastDigits={phoneLastDigits}
            totalAmount={totalAmount}
          />
        </View>
      </View>
    </View>
  );
}
