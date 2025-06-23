import React, { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DiscountModal, { Discount } from "./DiscountModal";

interface DiscountSectionProps {
  onDiscountSelect: (discount: Discount | null) => void;
  onDiscountDelete: () => void;
}

export default function DiscountSection({
  onDiscountSelect,
  onDiscountDelete,
}: DiscountSectionProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDiscountSelect = (discount: Discount) => {
    onDiscountSelect(discount);
    setIsModalVisible(false);
  };

  const handleDiscountDelete = () => {
    onDiscountSelect(null);
    onDiscountDelete();
  };

  return (
    <>
      <View className="w-full h-[100px] rounded-lg flex flex-row items-center justify-between border border-gray-300 my-6 box-border p-4">
        <View className="flex gap-2 ">
          <Text className="text-2xl ">할인 적용</Text>
          <Text className="text-gray-600">어린이 할인 적용 (-17,000원)</Text>
        </View>
        <View className="flex flex-row items-center gap-3">
          <Pressable
            onPress={() => setIsModalVisible(true)}
            className="w-[120px] h-[50px] rounded-lg border border-primaryGreen bg-white flex flex-row items-center justify-center gap-2"
          >
            <Ionicons name="pricetag-outline" size={18} color="#2CC56F" />
            <Text className="text-primaryGreen font-medium">할인 선택</Text>
          </Pressable>
          <Pressable
            onPress={handleDiscountDelete}
            className="w-[120px] h-[50px] rounded-lg border border-red-400 bg-white flex flex-row items-center justify-center gap-2"
          >
            <Ionicons name="close-circle-outline" size={18} color="#F87171" />
            <Text className="text-red-400 font-medium">할인 삭제</Text>
          </Pressable>
        </View>
      </View>

      <DiscountModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSelectDiscount={handleDiscountSelect}
      />
    </>
  );
}
