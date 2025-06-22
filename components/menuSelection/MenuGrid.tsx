import React from "react";
import { View, Text, Image } from "react-native";
import PaginationButtons from "./menuSelction";

interface MenuItem {
  id: number;
  name: string;
  price: string;
}

export default function MenuGrid() {
  // 임시 메뉴 데이터
  const menuItems = Array(12)
    .fill(null)
    .map((_, index) => ({
      id: index,
      name: "아메리카노",
      price: "1,500원",
    }));

  const handleUpPress = () => {
    // 위쪽 페이지네이션 로직
    console.log("Up button pressed");
  };

  const handleDownPress = () => {
    // 아래쪽 페이지네이션 로직
    console.log("Down button pressed");
  };
  return (
    <View className="flex flex-row w-full h-[65%] box-border px-[5%] py-[3%] items-center">
      <View className="flex-1 h-full">
        <View className="flex-row flex-wrap h-full justify-between content-between">
          {menuItems.map((item) => (
            <View key={item.id} className="w-1/4 pr-3 pl-0 box-border">
              <View className="w-full flex flex-col rounded-lg gap-2">
                <View className="overflow-hidden rounded-lg aspect-square">
                  <Image
                    source={require("../../assets/images/coffeeTest.png")}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
                <View className="px-1">
                  <Text className="font-medium text-base">{item.name}</Text>
                  <Text className="text-gray-600 text-sm mt-1">
                    {item.price}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>
      {/* 페이지네이션 버튼 */}
      <PaginationButtons
        onUpPress={handleUpPress}
        onDownPress={handleDownPress}
      />
    </View>
  );
}
