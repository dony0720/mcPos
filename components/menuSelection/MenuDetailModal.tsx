import React, { useState } from "react";
import { View, Text, Modal, ScrollView, TouchableOpacity } from "react-native";
import MenuInfoCard from "./MenuInfoCard";
import TemperatureSelector from "./TemperatureSelector";
import OptionsSelector from "./OptionsSelector";
import ActionButtons from "./ActionButtons";

interface MenuDetailModalProps {
  visible: boolean;
  onClose: () => void;
  menuItem: {
    id: number;
    name: string;
    price: string;
  } | null;
}

export default function MenuDetailModal({
  visible,
  onClose,
  menuItem,
}: MenuDetailModalProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [selectedTemperature, setSelectedTemperature] = useState("Hot");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // 장바구니에 추가하는 로직
    console.log("Added to cart:", {
      item: menuItem,
      options: selectedOptions,
      temperature: selectedTemperature,
      quantity,
    });
    onClose();
  };

  if (!menuItem) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 w-full h-full box-border px-[20%] justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg w-full h-[50%] p-6">
          {/* 헤더 */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">메뉴 옵션 선택</Text>
            <TouchableOpacity onPress={onClose}>
              <Text className="text-gray-500 text-lg">✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <MenuInfoCard
              menuItem={menuItem}
              quantity={quantity}
              setQuantity={setQuantity}
            />

            <TemperatureSelector
              selectedTemperature={selectedTemperature}
              setSelectedTemperature={setSelectedTemperature}
            />

            <OptionsSelector
              selectedOptions={selectedOptions}
              setSelectedOptions={setSelectedOptions}
            />
          </ScrollView>

          <ActionButtons onClose={onClose} onAddToCart={handleAddToCart} />
        </View>
      </View>
    </Modal>
  );
}
