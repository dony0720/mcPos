import React, { useState } from "react";
import {
  Modal,
  Pressable,
  Text,
  View,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LedgerRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (data: LedgerRegistrationData) => void;
}

interface LedgerRegistrationData {
  name: string;
  phoneNumber: string;
  initialAmount: string;
  receptionist: string;
  paymentMethod: string;
}

export default function LedgerRegistrationModal({
  visible,
  onClose,
  onConfirm,
}: LedgerRegistrationModalProps) {
  const [formData, setFormData] = useState<LedgerRegistrationData>({
    name: "",
    phoneNumber: "",
    initialAmount: "",
    receptionist: "",
    paymentMethod: "",
  });

  const [showReceptionistDropdown, setShowReceptionistDropdown] =
    useState(false);
  const [showPaymentMethodDropdown, setShowPaymentMethodDropdown] =
    useState(false);

  // 접수자 옵션
  const receptionistOptions = [
    "홍길동",
    "김직원",
    "이사장",
    "박매니저",
    "최대리",
  ];

  // 결제수단 옵션
  const paymentMethodOptions = ["현금", "계좌이체"];

  const handleConfirm = () => {
    // 모든 필드가 입력되었는지 확인
    if (
      !formData.name.trim() ||
      !formData.phoneNumber.trim() ||
      !formData.initialAmount.trim() ||
      !formData.receptionist ||
      !formData.paymentMethod
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    onConfirm(formData);
    handleClose();
  };

  const handleClose = () => {
    // 폼 데이터 초기화
    setFormData({
      name: "",
      phoneNumber: "",
      initialAmount: "",
      receptionist: "",
      paymentMethod: "",
    });
    setShowReceptionistDropdown(false);
    setShowPaymentMethodDropdown(false);
    onClose();
  };

  const formatAmount = (text: string) => {
    // 숫자만 남기기
    const cleaned = text.replace(/\D/g, "");

    // 천 단위 콤마 추가
    return cleaned.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <Modal transparent={true} visible={visible} onRequestClose={handleClose}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-4/5 max-w-md max-h-[80%]">
          <Text className="text-xl font-bold text-center mb-4">장부 등록</Text>
          <Text className="text-gray-600 text-center mb-6">
            새로운 고객 장부를 등록합니다.
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* 이름 입력 */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">이름</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3"
                placeholder="이름을 입력하세요"
                value={formData.name}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, name: text }))
                }
              />
            </View>

            {/* 전화번호 입력 */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">전화번호</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3"
                placeholder="전화번호를 입력하세요"
                value={formData.phoneNumber}
                onChangeText={(text) => {
                  setFormData((prev) => ({ ...prev, phoneNumber: text }));
                }}
                keyboardType="phone-pad"
              />
            </View>

            {/* 초기 충전 금액 입력 */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">
                초기 충전 금액
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3"
                placeholder="충전할 금액을 입력하세요"
                value={formData.initialAmount}
                onChangeText={(text) => {
                  const formatted = formatAmount(text);
                  setFormData((prev) => ({
                    ...prev,
                    initialAmount: formatted,
                  }));
                }}
                keyboardType="numeric"
              />
            </View>

            {/* 접수자 선택 */}
            <View className="mb-4">
              <Text className="text-gray-700 font-semibold mb-2">접수자</Text>
              <Pressable
                className="border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
                onPress={() =>
                  setShowReceptionistDropdown(!showReceptionistDropdown)
                }
              >
                <Text
                  className={
                    formData.receptionist ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {formData.receptionist || "접수자를 선택하세요"}
                </Text>
                <Ionicons
                  name={
                    showReceptionistDropdown ? "chevron-up" : "chevron-down"
                  }
                  size={20}
                  color="#666"
                />
              </Pressable>

              {showReceptionistDropdown && (
                <View className="border border-gray-300 rounded-lg mt-1 bg-white">
                  {receptionistOptions.map((option, index) => (
                    <Pressable
                      key={index}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                      onPress={() => {
                        setFormData((prev) => ({
                          ...prev,
                          receptionist: option,
                        }));
                        setShowReceptionistDropdown(false);
                      }}
                    >
                      <Text className="text-gray-800">{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>

            {/* 결제수단 선택 */}
            <View className="mb-6">
              <Text className="text-gray-700 font-semibold mb-2">결제수단</Text>
              <Pressable
                className="border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center"
                onPress={() =>
                  setShowPaymentMethodDropdown(!showPaymentMethodDropdown)
                }
              >
                <Text
                  className={
                    formData.paymentMethod ? "text-gray-800" : "text-gray-400"
                  }
                >
                  {formData.paymentMethod || "결제수단을 선택하세요"}
                </Text>
                <Ionicons
                  name={
                    showPaymentMethodDropdown ? "chevron-up" : "chevron-down"
                  }
                  size={20}
                  color="#666"
                />
              </Pressable>

              {showPaymentMethodDropdown && (
                <View className="border border-gray-300 rounded-lg mt-1 bg-white">
                  {paymentMethodOptions.map((option, index) => (
                    <Pressable
                      key={index}
                      className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                      onPress={() => {
                        setFormData((prev) => ({
                          ...prev,
                          paymentMethod: option,
                        }));
                        setShowPaymentMethodDropdown(false);
                      }}
                    >
                      <Text className="text-gray-800">{option}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          {/* 버튼들 */}
          <View className="flex-row gap-3">
            <Pressable
              role="button"
              className="flex-1 p-3 border border-gray-300 rounded-lg"
              onPress={handleClose}
            >
              <Text className="text-gray-600 text-center font-semibold">
                취소
              </Text>
            </Pressable>

            <Pressable
              role="button"
              className="flex-1 p-3 bg-primaryGreen rounded-lg"
              onPress={handleConfirm}
            >
              <Text className="text-white text-center font-semibold">등록</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
