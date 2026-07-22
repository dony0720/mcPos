// payment.tsx - 퍼블리싱 작업용 간소화된 결제 페이지

import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import clsx from 'clsx';
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
  DiscountStepModal,
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
  useSettingsStore,
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

  // 설정 스토어
  const { receiptCopies } = useSettingsStore();

  // 주문 아이템 삭제용 선택 상태 (왼쪽 주문 요약 패널)
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

  // 할인이 적용된 아이템 개수 ("할인 적용" 버튼에 요약 표시용)
  const discountedItemCount = orderItems.filter(item => item.discount).length;

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

      // 영수증 출력 (설정에 따라 1장 또는 2장)
      for (let i = 0; i < receiptCopies; i++) {
        const result = await printerService.printReceipt(receiptData);

        if (!result.success) {
          Alert.alert(
            '영수증 출력 실패',
            result.message || `${i + 1}번째 영수증 출력에 실패했습니다.`
          );
          break; // 출력 실패 시 중단
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

  // 전체 선택/해제 핸들러 (주문 아이템 삭제용)
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

  // 개별 아이템 체크박스 핸들러 (주문 아이템 삭제용)
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

  // 할인 단계에서 선택된 아이템들에 할인 적용
  const handleApplyDiscount = (itemIds: string[], discount: Discount) => {
    applyDiscount(itemIds, {
      id: discount.id,
      name: discount.name,
      value: discount.value,
      type: discount.type,
    });
  };

  // 할인 단계에서 선택된 아이템들의 할인 제거
  const handleRemoveDiscountItems = (itemIds: string[]) => {
    removeDiscount(itemIds);
  };

  // 결제 수단 선택 핸들러 (선택만, 단계 진행은 "결제하기"를 눌러야 시작)
  const handleSelectPaymentMethod = (method: CashRegisterPaymentId) => {
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
  };

  // "할인 적용" 버튼 - 필요할 때만 여는 온디맨드 할인 모달
  const handleOpenDiscountModal = () => {
    openModal('discountStep');
  };

  // "결제하기" 버튼 - 단계별 결제 진행 시작 (결제수단 세부입력부터)
  const handleStartPayment = () => {
    if (!selectedPaymentMethod) {
      return;
    }
    goToMethodDetailStep();
  };

  // 결제수단에 따라 세부입력 단계로 진입 (계좌이체는 입력 없이 바로 수령번호 단계)
  const goToMethodDetailStep = () => {
    if (selectedPaymentMethod === PaymentMethod.CASH) {
      openModal('cashAmount');
    } else if (selectedPaymentMethod === PaymentMethod.COUPON) {
      openModal('couponAmount');
    } else if (selectedPaymentMethod === PaymentMethod.LEDGER) {
      setModalType('phone');
      setIsLedgerFirstStep(true);
      setModalErrorMessage('');
      openModal('numberInput');
    } else {
      goToPickupStep();
    }
  };

  // 수령번호 입력 단계로 진행 (마지막 단계)
  const goToPickupStep = () => {
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
      // 남은 금액이 있으면 현금 결제 단계로 진행
      setShouldOpenCashModal(true);
    } else {
      // 쿠폰으로 전액 결제되면 바로 수령번호 단계로 진행
      goToPickupStep();
    }
  };

  // 현금 결제: 받은 금액 확인 핸들러
  const handleCashAmountConfirm = (received: number, change: number) => {
    setReceivedAmount(received);
    setChangeAmount(change);
    closeModal();
    // 현금 결제(또는 쿠폰+현금 결제) 완료 후 수령번호 단계로 진행
    goToPickupStep();
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
        // 장부 확인 완료 → 수령번호 단계로 진행
        goToPickupStep();
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
    // 장부 선택 완료 → 수령번호 단계로 진행
    goToPickupStep();
  };

  return (
    <View className='h-full w-full bg-white flex-row'>
      {/* 왼쪽: 어두운 주문 요약 패널 */}
      <View className='w-[420px] h-full bg-[#191f28] px-8 pt-8 pb-6 flex flex-col'>
        <PaymentHeader onBack={handleBack} />

        <Text className='text-[#b0b8c1] text-sm font-pretendard-semibold mt-7'>
          결제할 금액
        </Text>
        <Text className='text-white text-[44px] font-pretendard-bold mt-1'>
          {totalAmount.toLocaleString()}원
        </Text>

        <View className='h-[1px] bg-white/10 my-6' />

        {/* 전체 선택 컨트롤 - 잘못 담긴 아이템 삭제용 */}
        <SelectAllCheckbox
          isChecked={isAllChecked}
          onCheckboxPress={handleAllCheckboxPress}
          onDeletePress={handleDeleteSelected}
          hasSelectedItems={checkedItems.size > 0}
        />

        {/* 주문 메뉴 목록 */}
        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
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
              />
            );
          })}
        </ScrollView>
      </View>

      {/* 오른쪽: 결제 수단 및 주문 방식 선택 패널 */}
      <View className='flex-1 h-full px-11 pt-11 pb-8 flex flex-col'>
        <Text className='text-[22px] font-pretendard-bold text-[#191f28] mb-6'>
          결제 수단을 선택하세요
        </Text>

        <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
          {/* 결제 방법 선택 섹션 */}
          <PaymentMethodSelector
            selectedPaymentMethod={selectedPaymentMethod}
            onPaymentMethodPress={handleSelectPaymentMethod}
          />

          {/* 주문 방법 선택 섹션 */}
          <OrderMethodSelector
            selectedOrderMethod={selectedOrderMethod}
            onOrderMethodPress={setSelectedOrderMethod}
          />

          {/* 할인 적용 - 필요할 때만 여는 온디맨드 버튼 */}
          <Pressable
            onPress={handleOpenDiscountModal}
            className='w-full rounded-2xl border border-gray-200 mt-6 px-4 py-4 flex-row items-center justify-between'
          >
            <View className='flex-row items-center gap-2'>
              <Ionicons name='pricetag-outline' size={18} color='#03b26c' />
              <Text className='text-base font-pretendard-bold text-[#191f28]'>
                할인 적용
              </Text>
            </View>
            {discountedItemCount > 0 ? (
              <Text className='text-primaryGreen text-sm font-pretendard-semibold'>
                {discountedItemCount}개 항목 적용됨
              </Text>
            ) : (
              <Ionicons name='chevron-forward' size={18} color='#8b95a1' />
            )}
          </Pressable>
        </ScrollView>

        {/* 취소 · 결제하기(단계별 진행 시작) 버튼 */}
        <View className='flex-row gap-3 mt-6'>
          <Pressable
            onPress={handleBack}
            className='w-[140px] h-[62px] rounded-2xl bg-gray-100 flex items-center justify-center'
          >
            <Text className='text-[#4e5968] text-lg font-pretendard-bold'>
              취소
            </Text>
          </Pressable>

          <Pressable
            onPressIn={paymentButtonAnimation.onPressIn}
            onPressOut={paymentButtonAnimation.onPressOut}
            onPress={handleStartPayment}
            disabled={!selectedPaymentMethod}
            className='flex-1'
          >
            <Animated.View
              className={clsx(
                'h-[62px] flex items-center justify-center rounded-2xl',
                {
                  'bg-primaryGreen': !!selectedPaymentMethod,
                  'bg-gray-200': !selectedPaymentMethod,
                }
              )}
              style={{
                transform: [{ scale: paymentButtonAnimation.scaleAnim }],
              }}
            >
              <Text
                className={clsx('text-lg font-pretendard-bold', {
                  'text-white': !!selectedPaymentMethod,
                  'text-gray-400': !selectedPaymentMethod,
                })}
              >
                {totalAmount.toLocaleString()}원 결제하기
              </Text>
            </Animated.View>
          </Pressable>
        </View>

        {/* 할인 적용 (온디맨드) */}
        <DiscountStepModal
          visible={isModalOpen('discountStep')}
          orderItems={orderItems}
          onApplyDiscount={handleApplyDiscount}
          onRemoveDiscount={handleRemoveDiscountItems}
          onDone={closeModal}
          onClose={closeModal}
        />

        {/* 1단계(현금): 받은 금액 입력 */}
        <CashAmountModal
          visible={isModalOpen('cashAmount')}
          totalAmount={remainingAmount > 0 ? remainingAmount : totalAmount}
          onClose={closeModal}
          onConfirm={handleCashAmountConfirm}
        />

        {/* 1단계(쿠폰): 쿠폰 금액 입력 */}
        <CouponAmountModal
          visible={isModalOpen('couponAmount')}
          totalAmount={totalAmount}
          onClose={closeModal}
          onConfirm={handleCouponAmountConfirm}
        />

        {/* 1단계(장부) / 2단계(수령번호): 번호 입력 */}
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

        {/* 1단계(장부): 장부 선택 */}
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
  );
}
