import React from "react";
import { View, Text } from "react-native";
import ActionButtons from "./ActionButtons";
import { LedgerData } from "./types";

interface LedgerTableRowProps {
  item: LedgerData;
  onCharge: (item: LedgerData) => void;
  onHistory: (item: LedgerData) => void;
  onEdit: (item: LedgerData) => void;
  onDelete: (item: LedgerData) => void;
}

export default function LedgerTableRow({
  item,
  onCharge,
  onHistory,
  onEdit,
  onDelete,
}: LedgerTableRowProps) {
  return (
    <View className="w-full flex-row rounded-lg border-b border-gray-100">
      <View className="w-[50%] py-3 flex flex-row items-center justify-between">
        <View className="w-[20%]">
          <Text className="text-base text-gray-800">{item.memberNumber}</Text>
        </View>
        <View className="w-[20%]">
          <Text className="text-base text-gray-800">{item.name}</Text>
        </View>
        <View className="w-[20%]">
          <Text className="text-base text-gray-800">{item.receptionist}</Text>
        </View>
        <View className="w-[30%]">
          <Text className="text-base text-gray-800 font-medium">
            {item.chargeAmount}
          </Text>
        </View>
      </View>

      <ActionButtons
        item={item}
        onCharge={onCharge}
        onHistory={onHistory}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </View>
  );
}
