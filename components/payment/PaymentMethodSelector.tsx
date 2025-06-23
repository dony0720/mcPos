import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PaymentMethodSelectorProps {
  selectedPaymentMethod: string | null;
  onPaymentMethodPress: (methodId: string) => void;
}

const paymentMethods = [
  { id: "cash", name: "현금", icon: "cash-outline" },
  { id: "transfer", name: "이체", icon: "card-outline" },
  { id: "coupon", name: "쿠폰", icon: "ticket-outline" },
  { id: "ledger", name: "장부", icon: "book-outline" },
];

export default function PaymentMethodSelector({
  selectedPaymentMethod,
  onPaymentMethodPress,
}: PaymentMethodSelectorProps) {
  return (
    <View>
      <Text className="text-3xl font-medium mt-6 mb-6">결제수단</Text>
      <View className="w-full flex flex-row gap-4">
        {paymentMethods.map((method) => (
          <Pressable
            key={method.id}
            onPress={() => onPaymentMethodPress(method.id)}
            className={`flex-1 h-[100px] rounded-lg border flex items-center justify-center gap-2 ${
              selectedPaymentMethod === method.id
                ? "border-black bg-gray-100"
                : "border-gray-300 bg-white"
            }`}
          >
            <Ionicons
              name={method.icon as any}
              size={32}
              color={
                selectedPaymentMethod === method.id ? "#000000" : "#6B7280"
              }
            />
            <Text
              className={`text-lg font-medium ${
                selectedPaymentMethod === method.id
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
