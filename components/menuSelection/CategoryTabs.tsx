import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function CategoryTabs() {
  const categories = ["에스프레소", "라떼", "커피", "디저트", "기타"];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <View className="w-full box-border px-[5%]">
      <View className="h-[45px] flex flex-row relative">
        {categories.map((category) => (
          <Pressable
            role="tablist"
            key={category}
            onPress={() => setSelectedCategory(category)}
            className="flex-1 py-3 flex justify-center items-center"
          >
            <Text
              className={`text-[16px] font-bold ${
                selectedCategory === category
                  ? "text-primaryGreen"
                  : "text-gray-500"
              }`}
            >
              {category}
            </Text>
          </Pressable>
        ))}
        {/* 회색 구분선 */}
        <View className="absolute bottom-0 w-full border-t border-gray-300" />
        {/* 선택된 카테고리 아래 초록색 밑줄 */}
        <View
          className="absolute bottom-0"
          style={{
            width: `${100 / categories.length}%`,
            borderTopWidth: 2,
            borderColor: "#2CC56F",
            transform: [
              {
                translateX: `${categories.indexOf(selectedCategory) * 100}%`,
              },
            ],
          }}
        />
      </View>
    </View>
  );
}
