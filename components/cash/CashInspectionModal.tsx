import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// 현금 서랍 아이템 타입 정의
interface CashDrawerItem {
  type: string;
  title: string;
  theme: "yellow" | "green" | "orange" | "blue" | "gray";
  quantity: number;
  unitValue: number;
}

// 모달 props 타입 정의
interface CashInspectionModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (updatedData: CashDrawerItem[][]) => void;
  initialData: CashDrawerItem[][];
}

export default function CashInspectionModal({
  visible,
  onClose,
  onConfirm,
  initialData,
}: CashInspectionModalProps) {
  const [cashData, setCashData] = useState<CashDrawerItem[][]>([]);

  // 모달이 열릴 때 초기 데이터 설정
  useEffect(() => {
    if (visible) {
      setCashData(JSON.parse(JSON.stringify(initialData))); // 깊은 복사
    }
  }, [visible, initialData]);

  // 수량 변경 핸들러
  const handleQuantityChange = (
    rowIndex: number,
    cardIndex: number,
    newQuantity: string
  ) => {
    const quantity = parseInt(newQuantity) || 0;
    const newCashData = [...cashData];
    newCashData[rowIndex][cardIndex] = {
      ...newCashData[rowIndex][cardIndex],
      quantity,
    };
    setCashData(newCashData);
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

  // 전체 금액 계산
  const getTotalAmount = () => {
    return cashData
      .flat()
      .reduce((total, item) => total + item.quantity * item.unitValue, 0)
      .toLocaleString();
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-2xl w-full max-w-4xl h-[80%]">
              {/* 모달 헤더 */}
              <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-900">
                  시재 점검
                </Text>
                <Pressable
                  onPress={onClose}
                  className="w-8 h-8 items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </Pressable>
              </View>

              {/* 모달 내용 */}
              <ScrollView className="flex-1 p-6">
                <Text className="text-lg font-medium text-gray-700 mb-4">
                  현재 현금 서랍 현황을 확인하고 수정하세요
                </Text>

                {/* 현금 서랍 현황 수정 */}
                <View className="flex-1 gap-5">
                  {cashData.map((row, rowIndex) => (
                    <View key={rowIndex} className="flex-row gap-4">
                      {row.map((item, cardIndex) => (
                        <View
                          key={cardIndex}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4"
                        >
                          {/* 권종 정보 */}
                          <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-xl font-bold text-gray-800">
                              {item.title}
                            </Text>
                            <View className="flex-row items-center gap-1">
                              <View className="w-2 h-2 rounded-full bg-gray-400"></View>
                              <Text className="text-sm font-medium text-gray-500 uppercase">
                                {item.type}
                              </Text>
                            </View>
                          </View>

                          {/* 수량 입력 */}
                          <View className="mb-3">
                            <Text className="text-sm font-medium text-gray-600 mb-1">
                              수량
                            </Text>
                            <TextInput
                              className="border border-gray-300 rounded-lg px-3 py-2 text-center text-lg font-medium"
                              value={item.quantity.toString()}
                              onChangeText={(text) =>
                                handleQuantityChange(rowIndex, cardIndex, text)
                              }
                              keyboardType="numeric"
                              placeholder="0"
                            />
                          </View>

                          {/* 금액 표시 */}
                          <View className="flex-row justify-between items-center">
                            <Text className="text-sm text-gray-600">금액</Text>
                            <Text className="text-lg font-bold text-gray-800">
                              {formatAmount(item.quantity, item.unitValue)}원
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ))}
                </View>

                {/* 총 금액 표시 */}
                <View className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-lg font-medium text-blue-800">
                      총 현금 보유액
                    </Text>
                    <Text className="text-2xl font-bold text-blue-900">
                      {getTotalAmount()}원
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* 모달 푸터 */}
              <View className="flex-row gap-3 p-6 border-t border-gray-200">
                <Pressable
                  onPress={handleCancel}
                  className="flex-1 bg-gray-100 rounded-xl p-4 items-center"
                >
                  <Text className="text-gray-700 font-medium text-lg">
                    취소
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  className="flex-1 bg-green-500 rounded-xl p-4 items-center"
                >
                  <Text className="text-white font-medium text-lg">확인</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
