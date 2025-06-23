import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface OptionsSelectorProps {
  selectedOptions: string[];
  setSelectedOptions: (options: string[]) => void;
}

export default function OptionsSelector({
  selectedOptions,
  setSelectedOptions,
}: OptionsSelectorProps) {
  const options = ["샷추가", "시럽추가", "휘핑크림"];

  return (
    <View className="mb-6">
      <Text className="text-base font-semibold mb-3">기타 옵션</Text>
      <View className="flex-row flex-wrap gap-5">
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <TouchableOpacity
              key={option}
              onPress={() => {
                if (isSelected) {
                  setSelectedOptions(
                    selectedOptions.filter((item) => item !== option)
                  );
                } else {
                  setSelectedOptions([...selectedOptions, option]);
                }
              }}
              className={`px-4 py-2 rounded-lg border flex-[0_0_45%] ${
                isSelected
                  ? "bg-[#475569] border-[#475569]"
                  : "bg-white border-gray-300"
              }`}
            >
              <View className="flex items-center gap-2">
                <Text
                  className={`${isSelected ? "text-white" : "text-gray-700"}`}
                >
                  {option}
                </Text>
                <Text
                  className={`${isSelected ? "text-white" : "text-gray-700"}`}
                >
                  +500원
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
