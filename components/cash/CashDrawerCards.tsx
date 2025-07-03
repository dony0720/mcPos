import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CashDrawerCard from "./CashDrawerCard";

export default function CashDrawerCards() {
  // 권종별 현금 서랍 현황 데이터
  const cashDrawerData = [
    // 첫 번째 행
    [
      {
        type: "지폐",
        title: "5만원",
        theme: "yellow" as const,
        quantity: "8장",
        totalAmount: "400,000원",
      },
      {
        type: "지폐",
        title: "1만원",
        theme: "green" as const,
        quantity: "15장",
        totalAmount: "150,000원",
      },
    ],
    // 두 번째 행
    [
      {
        type: "지폐",
        title: "5천원",
        theme: "orange" as const,
        quantity: "12장",
        totalAmount: "60,000원",
      },
      {
        type: "지폐",
        title: "1천원",
        theme: "blue" as const,
        quantity: "25장",
        totalAmount: "25,000원",
      },
    ],
    // 세 번째 행
    [
      {
        type: "동전",
        title: "500원",
        theme: "gray" as const,
        quantity: "30개",
        totalAmount: "15,000원",
      },
      {
        type: "동전",
        title: "100원",
        theme: "gray" as const,
        quantity: "50개",
        totalAmount: "5,000원",
      },
    ],
  ];

  const handleCashDeposit = () => {
    console.log("현금 입금");
  };

  const handleCashWithdraw = () => {
    console.log("현금 출금");
  };

  return (
    <View className="mt-8">
      <Text className="text-lg font-bold text-gray-800 mb-4">
        현금 서랍 현황
      </Text>

      <View className="flex flex-row gap-4">
        {/* 권종별 현금 현황 카드 */}
        <View className="flex-1">
          <View className="flex flex-col gap-4">
            {cashDrawerData.map((row, rowIndex) => (
              <View key={rowIndex} className="flex flex-row gap-4">
                {row.map((card, cardIndex) => (
                  <CashDrawerCard
                    key={cardIndex}
                    type={card.type}
                    title={card.title}
                    theme={card.theme}
                    quantity={card.quantity}
                    totalAmount={card.totalAmount}
                  />
                ))}
              </View>
            ))}
          </View>
        </View>

        {/* 현금 입출금 버튼 */}
        <View className="w-40 flex flex-col gap-3">
          <Pressable
            className="bg-white border border-gray-300 rounded-lg p-3 justify-center items-center min-h-[80px]"
            onPress={handleCashDeposit}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Ionicons name="add-circle-outline" size={24} color="#059669" />
            <Text className="text-emerald-600 font-semibold text-sm mt-1">
              입금
            </Text>
          </Pressable>

          <Pressable
            className="bg-white border border-gray-300 rounded-lg p-3 justify-center items-center min-h-[80px]"
            onPress={handleCashWithdraw}
            style={({ pressed }) => ({
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.96 : 1 }],
            })}
          >
            <Ionicons name="remove-circle-outline" size={24} color="#DC2626" />
            <Text className="text-red-600 font-semibold text-sm mt-1">
              출금
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
