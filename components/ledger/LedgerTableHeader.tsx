import React from "react";
import { View, Text } from "react-native";

export default function LedgerTableHeader() {
  return (
    <View className="w-full flex-row rounded-lg">
      <View className="w-[50%] py-3 flex flex-row items-center justify-between">
        <View className="w-[20%]">
          <Text className="text-lg font-semibold text-gray-700">회원번호</Text>
        </View>
        <View className="w-[20%]">
          <Text className="text-lg font-semibold text-gray-700">이름</Text>
        </View>
        <View className="w-[20%]">
          <Text className="text-lg font-semibold text-gray-700">접수자</Text>
        </View>
        <View className="w-[30%]">
          <Text className="text-lg font-semibold text-gray-700">충전 금액</Text>
        </View>
      </View>
      <View className="w-[50%] py-3 flex items-center justify-center">
        <Text className="text-lg font-semibold text-gray-700">관리</Text>
      </View>
    </View>
  );
}
