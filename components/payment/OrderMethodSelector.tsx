import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface OrderMethod {
  id: string;
  name: string;
  icon: string;
}

interface OrderMethodSelectorProps {
  selectedOrderMethod: string | null;
  onOrderMethodPress: (methodId: string) => void;
}

const orderMethods: OrderMethod[] = [
  { id: "takeout", name: "테이크아웃", icon: "bag-outline" },
  { id: "dine-in", name: "매장", icon: "restaurant-outline" },
];

export default function OrderMethodSelector({
  selectedOrderMethod,
  onOrderMethodPress,
}: OrderMethodSelectorProps) {
  return (
    <View>
      <Text className="text-3xl font-medium my-6">주문 방식</Text>
      <View className="w-full flex flex-row gap-4">
        {orderMethods.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => onOrderMethodPress(method.id)}
            className={`flex-1 h-[100px] rounded-lg border flex items-center justify-center gap-2 ${
              selectedOrderMethod === method.id
                ? "border-black bg-gray-100"
                : "border-gray-300 bg-white"
            }`}
          >
            <Ionicons
              name={method.icon as any}
              size={32}
              color={selectedOrderMethod === method.id ? "#000000" : "#6B7280"}
            />
            <Text
              className={`text-lg font-medium ${
                selectedOrderMethod === method.id
                  ? "text-black"
                  : "text-gray-500"
              }`}
            >
              {method.name}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
