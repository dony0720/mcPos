import React from "react";
import { View } from "react-native";
import CashInfoCard from "./CashInfoCard";

interface CashCardData {
  icon: keyof typeof import("@expo/vector-icons").Ionicons.glyphMap;
  title: string;
  amount: string;
  theme:
    | "gray"
    | "blue"
    | "green"
    | "purple"
    | "orange"
    | "indigo"
    | "emerald"
    | "red";
}

interface CashInfoGridProps {
  data: CashCardData[][];
}

export default function CashInfoGrid({ data }: CashInfoGridProps) {
  return (
    <View className="mt-8">
      {/* 금액 정보 그리드 */}
      <View className="flex flex-col gap-4">
        {data.map((row, rowIndex) => (
          <View key={rowIndex} className="flex flex-row gap-4">
            {row.map((card, cardIndex) => (
              <CashInfoCard
                key={cardIndex}
                icon={card.icon}
                title={card.title}
                amount={card.amount}
                theme={card.theme}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}
