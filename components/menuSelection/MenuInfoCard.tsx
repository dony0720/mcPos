import React from "react";
import { View, Text, Image } from "react-native";
import QuantitySelector from "./QuantitySelector";

interface MenuInfoCardProps {
  menuItem: {
    id: number;
    name: string;
    price: string;
  };
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function MenuInfoCard({
  menuItem,
  quantity,
  setQuantity,
}: MenuInfoCardProps) {
  return (
    <View className="flex-row mb-6">
      <View className="w-36 h-36 rounded-lg overflow-hidden mr-4">
        <Image
          source={require("../../assets/images/coffeeTest.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 justify-between">
        <View className="flex-1 gap-3">
          <Text className="text-xl font-semibold">{menuItem.name}</Text>
          <Text className="text-gray-600 text-lg">{menuItem.price}</Text>
        </View>
        <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
      </View>
    </View>
  );
}
