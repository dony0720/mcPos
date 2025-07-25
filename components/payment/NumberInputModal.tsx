import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';

import Keypad from './Keypad';

interface NumberInputModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (number: string) => void;
  type?: 'phone' | 'pickup'; // phone: 핸드폰 번호 4자리 고정, pickup: 픽업 번호 자유 입력
}

export default function NumberInputModal({
  visible,
  onClose,
  onConfirm,
  type = 'pickup',
}: NumberInputModalProps) {
  // 타입별 설정
  const config =
    type === 'phone'
      ? {
          maxLength: 4,
          fixedLength: true,
          title: '핸드폰 뒷자리 4자리를 입력해주세요',
        }
      : {
          maxLength: 3,
          fixedLength: false,
          title: '수령방을 변호를 입력해 주세요',
        };

  const { maxLength, fixedLength, title } = config;
  const [inputNumber, setInputNumber] = useState<string>('');

  const handleNumberPress = (number: string) => {
    if (inputNumber.length < maxLength) {
      setInputNumber(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setInputNumber(prev => prev.slice(0, -1));
  };

  const handleConfirm = () => {
    const isValid = fixedLength
      ? inputNumber.length === maxLength
      : inputNumber.length > 0;
    if (isValid) {
      onConfirm(inputNumber);
      setInputNumber('');
      onClose();
    }
  };

  const handleCancel = () => {
    setInputNumber('');
    onClose();
  };

  const handleClose = () => {
    setInputNumber('');
    onClose();
  };

  // 입력 유효성 검사
  const isInputValid = fixedLength
    ? inputNumber.length === maxLength
    : inputNumber.length > 0;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='none'
      onRequestClose={handleClose}
    >
      <Pressable
        className='flex-1 bg-black/50 justify-center items-center'
        onPress={handleClose}
      >
        <Pressable
          className='bg-white rounded-3xl w-full max-w-xl px-12 py-8'
          onPress={e => e.stopPropagation()}
        >
          {/* 닫기 버튼 */}
          <View className='flex-row justify-end mb-4'>
            <Pressable
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name='close' size={24} color='#374151' />
            </Pressable>
          </View>

          {/* 모달 제목 섹션 */}
          <Text className='text-xl font-medium text-center mb-10 text-gray-800'>
            {title}
          </Text>

          {/* 입력된 번호 표시 섹션 */}
          <View className='mb-8'>
            <Text className='text-center text-6xl font-normal text-gray-800 mb-2'>
              {inputNumber || ''}
            </Text>
          </View>

          {/* 번호 입력 키패드 섹션 */}
          <Keypad
            onNumberPress={handleNumberPress}
            onBackspace={handleBackspace}
            maxLength={maxLength}
            currentInput={inputNumber}
          />

          {/* 하단 확인/취소 버튼 섹션 */}
          <View className='flex-row gap-4'>
            {/* 취소 버튼 */}
            <Pressable onPress={handleCancel} className='flex-1'>
              <View className='bg-gray-400 rounded-xl py-4 flex items-center justify-center'>
                <Text className='text-white text-lg font-medium'>취소</Text>
              </View>
            </Pressable>

            {/* 확인 버튼 - 입력 조건에 따라 활성화/비활성화 */}
            <Pressable
              onPress={handleConfirm}
              className='flex-1'
              disabled={!isInputValid}
            >
              <View
                className={clsx(
                  'rounded-xl py-4 flex items-center justify-center',
                  {
                    'bg-green-500': isInputValid,
                    'bg-gray-300': !isInputValid,
                  }
                )}
              >
                <Text
                  className={clsx('text-lg font-medium', {
                    'text-white': isInputValid,
                    'text-gray-500': !isInputValid,
                  })}
                >
                  주문완료
                </Text>
              </View>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
