import React from "react";
import { View, Pressable, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import McPosLogo from "../../assets/icon/mcPosLogo.svg";
import { useButtonAnimation } from "../../hooks/useButtonAnimation";

interface PaymentHeaderProps {
  onBackPress: () => void;
}

export default function PaymentHeader({ onBackPress }: PaymentHeaderProps) {
  const backAnimation = useButtonAnimation();

  return (
    // 상단 헤더 섹션 - 뒤로가기 버튼과 로고
    <View className="w-full h-[80px] px-[5%] box-border mt-[25px] flex flex-row justify-between items-center">
      {/* 뒤로가기 버튼과 로고 */}
      <View className="flex-row items-center gap-4">
        {/* 뒤로가기 버튼 */}
        <Pressable
          onPressIn={backAnimation.onPressIn}
          onPressOut={backAnimation.onPressOut}
          onPress={onBackPress}
        >
          <Animated.View
            className="w-[50px] h-[50px] bg-gray-100 rounded-lg flex items-center justify-center"
            style={{
              transform: [{ scale: backAnimation.scaleAnim }],
            }}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </Animated.View>
        </Pressable>

        {/* 로고 */}
        <McPosLogo width={150} height={150} />
      </View>
    </View>
  );
}
