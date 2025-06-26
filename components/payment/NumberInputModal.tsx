import React, { useState } from "react";
import { View, Text, Modal, Pressable } from "react-native";

interface NumberInputModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (number: string) => void;
  type?: "phone" | "pickup"; // phone: 핸드폰 번호 4자리 고정, pickup: 픽업 번호 자유 입력
}

export default function NumberInputModal({
  visible,
  onClose,
  onConfirm,
  type = "pickup",
}: NumberInputModalProps) {
  // 타입별 설정
  const config =
    type === "phone"
      ? {
          maxLength: 4,
          fixedLength: true,
          title: "핸드폰 뒷자리 4자리를 입력해주세요",
        }
      : { maxLength: 3, fixedLength: false, title: "픽업 번호를 선택해주세요" };

  const { maxLength, fixedLength, title } = config;
  const [inputNumber, setInputNumber] = useState<string>("");

  const handleNumberPress = (number: string) => {
    if (inputNumber.length < maxLength) {
      setInputNumber((prev) => prev + number);
    }
  };

  const handleBackspace = () => {
    setInputNumber((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    setInputNumber("");
  };

  const handleConfirm = () => {
    const isValid = fixedLength
      ? inputNumber.length === maxLength
      : inputNumber.length > 0;
    if (isValid) {
      onConfirm(inputNumber);
      setInputNumber("");
      onClose();
    }
  };

  const handleCancel = () => {
    setInputNumber("");
    onClose();
  };

  const renderNumberButton = (number: string) => {
    return (
      <Pressable
        key={number}
        onPress={() => handleNumberPress(number)}
        className="w-[28%] aspect-square"
      >
        <View className="w-full h-full rounded-lg border-2 bg-white border-gray-300 flex items-center justify-center">
          <Text className="text-3xl font-bold text-gray-800">{number}</Text>
        </View>
      </Pressable>
    );
  };

  const renderActionButton = (
    text: string,
    onPress: () => void,
    isDelete = false
  ) => {
    return (
      <Pressable onPress={onPress} className="w-[28%] aspect-square">
        <View
          className={`w-full h-full rounded-lg border-2 flex items-center justify-center ${
            isDelete
              ? "bg-red-500 border-red-500"
              : "bg-gray-500 border-gray-500"
          }`}
        >
          <Text className="text-white text-3xl font-bold">{text}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white rounded-xl px-8 py-6 w-[95%] max-w-lg">
          {/* 모달 제목 섹션 */}
          <Text className="text-xl font-bold text-center mb-6 text-gray-800">
            {title}
          </Text>

          {/* 입력된 번호 표시 섹션 */}
          <View className="bg-gray-100 rounded-lg px-6 py-6 mb-6">
            <Text className="text-center text-4xl font-bold text-gray-800 mb-2">
              {inputNumber ||
                (fixedLength
                  ? `${maxLength}자리 번호를 입력해주세요`
                  : "번호를 입력해주세요")}
            </Text>
            {/* 핸드폰 번호 타입일 때만 진행률 표시 */}
            {fixedLength && (
              <Text className="text-center text-lg text-gray-500">
                {inputNumber.length}/{maxLength}
              </Text>
            )}
          </View>

          {/* 번호 입력 키패드 섹션 */}
          <View className="flex-row flex-wrap justify-between gap-2 mb-5">
            {/* 숫자 1-9 버튼 렌더링 */}
            {Array.from({ length: 9 }, (_, index) =>
              (index + 1).toString()
            ).map(renderNumberButton)}

            {/* 하단 액션 버튼들: 클리어, 0, 삭제 */}
            {renderActionButton("클리어", handleClear)}
            {renderNumberButton("0")}
            {renderActionButton("삭제", handleBackspace, true)}
          </View>

          {/* 하단 확인/취소 버튼 섹션 */}
          <View className="flex-row gap-3">
            {/* 취소 버튼 */}
            <Pressable onPress={handleCancel} className="flex-1">
              <View className="bg-gray-500 rounded-lg py-3 flex items-center justify-center">
                <Text className="text-white text-lg font-bold">취소</Text>
              </View>
            </Pressable>

            {/* 확인 버튼 - 입력 조건에 따라 활성화/비활성화 */}
            <Pressable
              onPress={handleConfirm}
              className="flex-1"
              disabled={
                fixedLength ? inputNumber.length !== maxLength : !inputNumber
              }
            >
              <View
                className={`rounded-lg py-3 flex items-center justify-center ${
                  (
                    fixedLength
                      ? inputNumber.length === maxLength
                      : inputNumber.length > 0
                  )
                    ? "bg-primaryGreen"
                    : "bg-gray-300"
                }`}
              >
                <Text
                  className={`text-lg font-bold ${
                    (
                      fixedLength
                        ? inputNumber.length === maxLength
                        : inputNumber.length > 0
                    )
                      ? "text-white"
                      : "text-gray-500"
                  }`}
                >
                  확인
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
