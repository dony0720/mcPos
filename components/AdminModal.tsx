import React, { useState } from "react";
import { Modal, Pressable, Text, View, TextInput } from "react-native";

interface AdminModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
}

export default function AdminModal({
  visible,
  onClose,
  onConfirm,
}: AdminModalProps) {
  const [password, setPassword] = useState("");

  const handleConfirm = () => {
    onConfirm(password);
    setPassword(""); // 비밀번호 초기화
  };

  const handleClose = () => {
    setPassword(""); // 비밀번호 초기화
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-4/5 max-w-md">
          <Text className="text-xl font-bold text-center mb-4">
            관리자 인증
          </Text>
          <Text className="text-gray-600 text-center mb-6">
            관리자 권한이 필요한 작업을 수행할 수 있습니다.
          </Text>

          {/* 비밀번호 입력창 */}
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
            placeholder="비밀번호를 입력하세요"
            secureTextEntry={true}
            value={password}
            onChangeText={setPassword}
            autoFocus={true}
          />

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
              disabled={!password.trim()}
            >
              <Text className="text-white text-center font-semibold">확인</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
