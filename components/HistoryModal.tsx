import React from "react";
import { Modal, Pressable, Text, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
  customerInfo: {
    name: string;
    memberNumber: string;
    phoneNumber: string;
  };
}

export default function HistoryModal({
  visible,
  onClose,
  customerInfo,
}: HistoryModalProps) {
  // 임의의 거래 내역 데이터 (고객별로 다른 데이터)
  const getTransactionData = (memberNumber: string) => {
    const baseData = {
      M001: [
        {
          id: "1",
          date: "2024-12-15 14:30",
          type: "등록",
          amount: "50,000원",
          receptionist: "홍길동",
          paymentMethod: "현금",
        },
        {
          id: "2",
          date: "2024-12-14 16:45",
          type: "사용",
          amount: "4,500원",
          receptionist: "김직원",
          paymentMethod: "장부",
        },
        {
          id: "3",
          date: "2024-12-13 11:20",
          type: "충전",
          amount: "30,000원",
          receptionist: "이사장",
          paymentMethod: "계좌이체",
        },
        {
          id: "4",
          date: "2024-12-12 09:15",
          type: "사용",
          amount: "3,000원",
          receptionist: "박매니저",
          paymentMethod: "장부",
        },
        {
          id: "5",
          date: "2024-12-12 09:15",
          type: "사용",
          amount: "3,000원",
          receptionist: "박매니저",
          paymentMethod: "장부",
        },
        {
          id: "6",
          date: "2024-12-12 09:15",
          type: "사용",
          amount: "3,000원",
          receptionist: "박매니저",
          paymentMethod: "장부",
        },
        {
          id: "7",
          date: "2024-12-12 09:15",
          type: "사용",
          amount: "3,000원",
          receptionist: "박매니저",
          paymentMethod: "장부",
        },
      ],
      M002: [
        {
          id: "1",
          date: "2024-12-14 10:30",
          type: "등록",
          amount: "30,000원",
          receptionist: "김직원",
          paymentMethod: "카드",
        },
        {
          id: "2",
          date: "2024-12-13 15:20",
          type: "사용",
          amount: "5,500원",
          receptionist: "홍길동",
          paymentMethod: "장부",
        },
        {
          id: "3",
          date: "2024-12-11 14:10",
          type: "수정",
          amount: "25,000원",
          receptionist: "최대리",
          paymentMethod: "현금",
        },
      ],
      M003: [
        {
          id: "1",
          date: "2024-12-10 16:00",
          type: "등록",
          amount: "100,000원",
          receptionist: "홍길동",
          paymentMethod: "계좌이체",
        },
        {
          id: "2",
          date: "2024-12-09 13:45",
          type: "사용",
          amount: "8,000원",
          receptionist: "이사장",
          paymentMethod: "장부",
        },
      ],
      M004: [
        {
          id: "1",
          date: "2024-12-12 11:30",
          type: "등록",
          amount: "25,000원",
          receptionist: "이사장",
          paymentMethod: "카드",
        },
        {
          id: "2",
          date: "2024-12-11 14:20",
          type: "충전",
          amount: "15,000원",
          receptionist: "박매니저",
          paymentMethod: "현금",
        },
        {
          id: "3",
          date: "2024-12-10 16:50",
          type: "사용",
          amount: "2,500원",
          receptionist: "김직원",
          paymentMethod: "장부",
        },
        {
          id: "4",
          date: "2024-12-09 12:15",
          type: "수정",
          amount: "35,000원",
          receptionist: "홍길동",
          paymentMethod: "계좌이체",
        },
      ],
      M005: [
        {
          id: "1",
          date: "2024-12-13 09:45",
          type: "등록",
          amount: "75,000원",
          receptionist: "김직원",
          paymentMethod: "현금",
        },
        {
          id: "2",
          date: "2024-12-12 17:30",
          type: "충전",
          amount: "25,000원",
          receptionist: "홍길동",
          paymentMethod: "계좌이체",
        },
        {
          id: "3",
          date: "2024-12-11 10:20",
          type: "사용",
          amount: "6,500원",
          receptionist: "최대리",
          paymentMethod: "장부",
        },
      ],
    };

    return baseData[memberNumber as keyof typeof baseData] || [];
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "충전":
        return { name: "add-circle", color: "#10B981" };
      case "수정":
        return { name: "create", color: "#F59E0B" };
      case "등록":
        return { name: "person-add", color: "#3B82F6" };
      case "사용":
        return { name: "remove-circle", color: "#EF4444" };
      default:
        return { name: "document", color: "#6B7280" };
    }
  };

  const transactionHistory = getTransactionData(customerInfo.memberNumber);

  return (
    <Modal transparent={true} visible={visible} onRequestClose={onClose}>
      <View className="flex-1 justify-center box-border px-[20%] items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[95%] min-h-[80%] flex flex-col">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-bold">거래 내역</Text>
            <Pressable onPress={onClose} className="p-2">
              <Ionicons name="close" size={24} color="#666" />
            </Pressable>
          </View>

          {/* 고객 정보 표시 */}
          <View className="mb-6 p-4 bg-gray-50 rounded-lg">
            <Text className="text-lg font-semibold text-gray-800 mb-2">
              고객 정보
            </Text>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">회원번호:</Text>
              <Text className="text-gray-800 font-medium">
                {customerInfo.memberNumber}
              </Text>
            </View>
            <View className="flex-row justify-between mb-1">
              <Text className="text-gray-600">이름:</Text>
              <Text className="text-gray-800 font-medium">
                {customerInfo.name}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">전화번호:</Text>
              <Text className="text-gray-800 font-medium">
                {customerInfo.phoneNumber}
              </Text>
            </View>
          </View>

          {/* 거래 내역 목록 */}
          <View className="flex-1">
            <Text className="text-lg font-semibold mb-3">
              거래 내역 ({transactionHistory.length}건)
            </Text>

            {transactionHistory.length === 0 ? (
              <View className="flex-1 justify-center items-center">
                <Ionicons name="document-outline" size={48} color="#D1D5DB" />
                <Text className="text-gray-500 text-center mt-2">
                  거래 내역이 없습니다.
                </Text>
              </View>
            ) : (
              <ScrollView
                showsVerticalScrollIndicator={false}
                className="flex-1"
              >
                {transactionHistory.map((transaction) => {
                  const icon = getTransactionIcon(transaction.type);
                  return (
                    <View
                      key={transaction.id}
                      className="mb-4 p-4 border border-gray-200 rounded-lg bg-white shadow-sm"
                    >
                      {/* 거래 헤더 */}
                      <View className="flex-row items-center justify-between mb-3">
                        <View className="flex-row items-center">
                          <Ionicons
                            name={icon.name as any}
                            size={20}
                            color={icon.color}
                          />
                          <Text className="ml-2 font-semibold text-gray-800">
                            {transaction.type}
                          </Text>
                        </View>
                        <Text className="text-sm text-gray-500">
                          {transaction.date}
                        </Text>
                      </View>

                      {/* 거래 정보 */}
                      <View className="flex flex-col gap-2">
                        <View className="flex-row justify-between">
                          <Text className="text-gray-600">금액:</Text>
                          <Text
                            className={`font-semibold ${
                              transaction.type === "사용"
                                ? "text-red-600"
                                : transaction.type === "충전"
                                  ? "text-green-600"
                                  : "text-gray-800"
                            }`}
                          >
                            {transaction.type === "사용" ? "-" : "+"}
                            {transaction.amount}
                          </Text>
                        </View>
                        <View className="flex-row justify-between">
                          <Text className="text-gray-600">접수자:</Text>
                          <Text className="text-gray-800">
                            {transaction.receptionist}
                          </Text>
                        </View>
                        <View className="flex-row justify-between">
                          <Text className="text-gray-600">결제수단:</Text>
                          <Text className="text-gray-800">
                            {transaction.paymentMethod}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* 닫기 버튼 */}
          <View className="mt-4">
            <Pressable className="p-3 bg-gray-500 rounded-lg" onPress={onClose}>
              <Text className="text-white text-center font-semibold">닫기</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
