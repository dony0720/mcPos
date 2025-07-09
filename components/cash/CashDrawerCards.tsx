import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import CashDrawerCard from "./CashDrawerCard";

// 현금 서랍 아이템 타입 정의
interface CashDrawerItem {
  type: string;
  title: string;
  theme: "yellow" | "green" | "orange" | "blue" | "gray";
  quantity: number;
  unitValue: number;
}

// 컴포넌트 props 타입 정의
interface CashDrawerCardsProps {
  cashDrawerData: CashDrawerItem[][];
}

export default function CashDrawerCards({
  cashDrawerData,
}: CashDrawerCardsProps) {
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
                    quantity={`${card.quantity}${card.type === "지폐" ? "장" : "개"}`}
                    totalAmount={`${(card.quantity * card.unitValue).toLocaleString()}원`}
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
