import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { CashDrawerMoneyItem, useCashStore } from '../../stores/useCashStore';

export default function CashInspectionModal({
  visible,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: (updatedData: CashDrawerMoneyItem[]) => void;
}) {
  const [cashData, setCashData] = useState<CashDrawerMoneyItem[]>([]);
  const cashDrawerData = useCashStore(state => state.cashDrawerData);
  const updateCashDrawerData = useCashStore(
    state => state.updateCashDrawerData
  );

  // 모달이 열릴 때 초기 데이터 설정
  useEffect(() => {
    if (visible) {
      setCashData(JSON.parse(JSON.stringify(cashDrawerData))); // 깊은 복사
    }
  }, [visible, cashDrawerData]);

  // 수량 변경 핸들러 (실시간 스토어 업데이트)
  const handleQuantityChange = (index: number, newQuantity: string) => {
    const quantity = parseInt(newQuantity) || 0;
    const newCashData = [...cashData];
    newCashData[index] = {
      ...newCashData[index],
      quantity,
    };
    setCashData(newCashData);

    // 실시간으로 스토어 업데이트
    updateCashDrawerData(newCashData);
  };

  // 확인 버튼 핸들러
  const handleConfirm = () => {
    onConfirm(cashData);
    onClose();
  };

  // 취소 버튼 핸들러
  const handleCancel = () => {
    onClose();
  };

  // 금액 포맷팅
  const formatAmount = (quantity: number, unitValue: number) => {
    return (quantity * unitValue).toLocaleString();
  };

  // 전체 금액 계산 (스토어 데이터 기준)
  const getTotalAmount = () => {
    const total = cashDrawerData.reduce(
      (total, item) => total + item.quantity * item.unitValue,
      0
    );
    return total.toLocaleString();
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className='flex-1 bg-black/50 justify-center items-center p-4'>
          <TouchableWithoutFeedback>
            <View className='bg-white rounded-2xl w-full max-w-4xl h-[80%]'>
              {/* 모달 헤더 */}
              <View className='flex-row items-center justify-between p-6 border-b border-gray-200'>
                <Text className='text-2xl font-bold text-gray-900'>
                  시재 점검
                </Text>
                <Pressable
                  onPress={onClose}
                  className='w-8 h-8 items-center justify-center'
                >
                  <Ionicons name='close' size={24} color='#6B7280' />
                </Pressable>
              </View>

              {/* 모달 내용 */}
              <View className='flex-1 p-6'>
                <Text className='text-lg font-medium text-gray-700 mb-4'>
                  현재 현금 서랍 현황을 확인하고 수정하세요
                </Text>

                {/* 현금 서랍 현황 수정 */}
                <ScrollView
                  className='flex-1 max-h-full'
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  <View className='flex-row flex-wrap gap-4 justify-between'>
                    {cashData.map((item, index) => (
                      <View
                        key={index}
                        className='bg-gray-50 border border-gray-200 rounded-xl p-4 my-2 w-[48%] max-w-[350px]'
                      >
                        {/* 권종 정보 */}
                        <View className='flex-row items-center justify-between mb-3'>
                          <Text className='text-xl font-bold text-gray-800'>
                            {item.title}
                          </Text>
                          <View className='flex-row items-center gap-1'>
                            <View className='w-2 h-2 rounded-full bg-gray-400'></View>
                            <Text className='text-sm font-medium uppercase text-gray-500'>
                              {item.type}
                            </Text>
                          </View>
                        </View>

                        {/* 수량 입력 */}
                        <View className='flex-row justify-between items-center mb-3'>
                          <Text className='text-sm font-medium text-gray-600'>
                            수량
                          </Text>
                          <View className='flex-row items-center gap-1'>
                            <TextInput
                              className='border border-gray-300 bg-white text-gray-800 rounded-lg text-center text-xl font-semibold w-20 h-10 leading-[20px]'
                              value={item.quantity.toString()}
                              onChangeText={text =>
                                handleQuantityChange(index, text)
                              }
                              keyboardType='numeric'
                              placeholder='0'
                            />
                            <Text>매</Text>
                          </View>
                        </View>

                        {/* 금액 표시 */}
                        <View className='flex-row justify-between items-center'>
                          <Text className='text-sm text-gray-600'>금액</Text>
                          <Text className='text-lg font-bold text-gray-800'>
                            {formatAmount(item.quantity, item.unitValue)}원
                          </Text>
                        </View>
                      </View>
                    ))}

                    {/* 총 현금 보유액 카드 */}
                    <View className='bg-blue-50 border-2 border-blue-300 rounded-xl p-4 my-2 w-[48%] max-w-[350px]'>
                      {/* 제목 */}
                      <View className='flex-row items-center justify-between mb-3'>
                        <Text className='text-xl font-bold text-blue-800'>
                          총 보유액
                        </Text>
                        <View className='flex-row items-center gap-1'>
                          <View className='w-2 h-2 rounded-full bg-blue-500'></View>
                          <Text className='text-sm font-medium uppercase text-blue-600'>
                            합계
                          </Text>
                        </View>
                      </View>

                      {/* 총 금액 표시 */}
                      <View className='flex-1 justify-center'>
                        <Text className='text-2xl font-bold text-blue-900 text-center'>
                          {getTotalAmount()}원
                        </Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </View>

              {/* 모달 푸터 */}
              <View className='flex-row gap-3 p-6 border-t border-gray-200'>
                <Pressable
                  onPress={handleCancel}
                  className='flex-1 bg-gray-100 rounded-xl p-4 items-center'
                >
                  <Text className='text-gray-700 font-medium text-lg'>
                    취소
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  className='flex-1 bg-green-500 rounded-xl p-4 items-center'
                >
                  <Text className='text-white font-medium text-lg'>확인</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
