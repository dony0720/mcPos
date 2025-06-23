import React from "react";
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Discount {
  id: string;
  name: string;
  value: number; // 고정 가격
  description?: string;
}

interface DiscountModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectDiscount: (discount: Discount) => void;
}

const discountOptions: Discount[] = [
  {
    id: "senior",
    name: "경로우대",
    value: 3000,
    description: "65세 이상 3,000원 고정가",
  },
  {
    id: "student",
    name: "학생할인",
    value: 4000,
    description: "학생증 제시 시 4,000원 고정가",
  },
  {
    id: "employee",
    name: "직원할인",
    value: 2000,
    description: "직원 2,000원 고정가",
  },
  {
    id: "special1",
    name: "특가 5,000원",
    value: 5000,
    description: "5,000원 고정 할인가",
  },
  {
    id: "special2",
    name: "특가 6,000원",
    value: 6000,
    description: "6,000원 고정 할인가",
  },
  {
    id: "special3",
    name: "특가 8,000원",
    value: 8000,
    description: "8,000원 고정 할인가",
  },
];

export default function DiscountModal({
  visible,
  onClose,
  onSelectDiscount,
}: DiscountModalProps) {
  const handleDiscountSelect = (discount: Discount) => {
    onSelectDiscount(discount);
    onClose();
  };

  const formatDiscountDisplay = (discount: Discount) => {
    return `${discount.value.toLocaleString()}원`;
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/50 justify-center items-center p-4">
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-2xl w-full max-w-md h-[600px]">
              {/* Header */}
              <View className="flex-row items-center justify-between p-6 border-b border-gray-200">
                <Text className="text-2xl font-bold text-gray-900">
                  할인 선택
                </Text>
                <Pressable
                  onPress={onClose}
                  className="w-8 h-8 items-center justify-center"
                >
                  <Ionicons name="close" size={24} color="#6B7280" />
                </Pressable>
              </View>

              {/* Discount Options */}
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
              >
                <View className="p-4">
                  {discountOptions.map((discount) => (
                    <Pressable
                      key={discount.id}
                      onPress={() => handleDiscountSelect(discount)}
                      className="bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200"
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      })}
                    >
                      <View className="flex-row items-center justify-between">
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-1">
                            <Ionicons
                              name="pricetag"
                              size={20}
                              color="#2CC56F"
                            />
                            <Text className="text-lg font-semibold text-gray-900">
                              {discount.name}
                            </Text>
                          </View>
                          {discount.description && (
                            <Text className="text-sm text-gray-600 ml-8">
                              {discount.description}
                            </Text>
                          )}
                        </View>
                        <View className="bg-primaryGreen/10 px-3 py-1 rounded-full">
                          <Text className="text-primaryGreen font-bold">
                            {formatDiscountDisplay(discount)}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

              {/* Footer */}
              <View className="p-4 border-t border-gray-200">
                <Pressable
                  onPress={onClose}
                  className="bg-gray-100 rounded-xl p-4 items-center"
                >
                  <Text className="text-gray-700 font-medium">취소</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export type { Discount };
