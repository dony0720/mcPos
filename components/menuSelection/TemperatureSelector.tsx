import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface TemperatureSelectorProps {
  selectedTemperature: string;
  setSelectedTemperature: (temperature: string) => void;
}

export default function TemperatureSelector({
  selectedTemperature,
  setSelectedTemperature,
}: TemperatureSelectorProps) {
  const temperatures = ["Hot", "Iced"];

  return (
    <View className="mb-6">
      <Text className="text-base font-semibold mb-3">온도</Text>
      <View className="flex-row flex-wrap gap-5">
        {temperatures.map((temp) => (
          <TouchableOpacity
            key={temp}
            onPress={() => setSelectedTemperature(temp)}
            className={`px-4 py-2 rounded-lg border flex-[0_0_45%] ${
              selectedTemperature === temp
                ? "bg-[#475569] border-[#475569]"
                : "bg-white border-gray-300"
            }`}
          >
            <View className="flex items-center gap-2">
              <Text className="text-2xl">{temp === "Hot" ? "🔥" : "🧊"}</Text>
              <Text
                className={`${
                  selectedTemperature === temp ? "text-white" : "text-gray-700"
                }`}
              >
                {temp === "Hot" ? "Hot" : "Iced"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
