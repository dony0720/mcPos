import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CashInfoCardProps {
  icon: keyof typeof Ionicons.glyphMap;
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

const themeStyles = {
  gray: {
    bg: "bg-white",
    border: "border-gray-200",
    iconColor: "#6B7280",
    titleColor: "text-gray-600",
    amountColor: "text-gray-900",
  },
  blue: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    iconColor: "#3B82F6",
    titleColor: "text-blue-600",
    amountColor: "text-blue-900",
  },
  green: {
    bg: "bg-green-50",
    border: "border-green-200",
    iconColor: "#10B981",
    titleColor: "text-green-600",
    amountColor: "text-green-900",
  },
  purple: {
    bg: "bg-purple-50",
    border: "border-purple-200",
    iconColor: "#8B5CF6",
    titleColor: "text-purple-600",
    amountColor: "text-purple-900",
  },
  orange: {
    bg: "bg-orange-50",
    border: "border-orange-200",
    iconColor: "#F59E0B",
    titleColor: "text-orange-600",
    amountColor: "text-orange-900",
  },
  indigo: {
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    iconColor: "#6366F1",
    titleColor: "text-indigo-600",
    amountColor: "text-indigo-900",
  },
  emerald: {
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    iconColor: "#10B981",
    titleColor: "text-emerald-600",
    amountColor: "text-emerald-900",
  },
  red: {
    bg: "bg-red-50",
    border: "border-red-200",
    iconColor: "#EF4444",
    titleColor: "text-red-600",
    amountColor: "text-red-900",
  },
};

export default function CashInfoCard({
  icon,
  title,
  amount,
  theme,
}: CashInfoCardProps) {
  const styles = themeStyles[theme];

  return (
    <View
      className={`flex-1 ${styles.bg} border ${styles.border} rounded-xl p-4`}
    >
      <View className="flex flex-row items-center gap-2">
        <Ionicons name={icon} size={20} color={styles.iconColor} />
        <Text className={`${styles.titleColor} text-sm font-medium`}>
          {title}
        </Text>
      </View>
      <Text className={`text-2xl font-bold ${styles.amountColor} mt-2`}>
        {amount}
      </Text>
    </View>
  );
}
