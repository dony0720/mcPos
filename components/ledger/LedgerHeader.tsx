import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LedgerHeaderProps {
  onShowRegistrationModal: () => void;
}

export default function LedgerHeader({
  onShowRegistrationModal,
}: LedgerHeaderProps) {
  return (
    <View className="w-full flex flex-row gap-2 justify-between items-center mt-[20px]">
      <View className="flex flex-col gap-3">
        <Text className="text-3xl font-bold">장부관리</Text>
        <Text className="text-xl text-gray-500">
          장부목록 및 거래내역을 관리하세요
        </Text>
      </View>
      <Pressable
        className="h-[40px] px-4 flex flex-row items-center gap-2 bg-primaryGreen rounded-lg"
        onPress={onShowRegistrationModal}
      >
        <Ionicons name="add-circle" size={20} color="white" />
        <Text className="text-white font-semibold text-base">장부등록</Text>
      </Pressable>
    </View>
  );
}
