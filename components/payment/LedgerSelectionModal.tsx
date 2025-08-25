import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { LedgerData } from '../../types/ledger';

interface LedgerSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (ledger: LedgerData) => void;
  ledgers: LedgerData[];
  phoneLastDigits: string;
  totalAmount: number;
}

/**
 * 장부 선택 모달
 * - 핸드폰 뒷자리가 같은 여러 장부 중에서 선택
 * - SRP: 장부 선택 UI만 담당
 */
export default function LedgerSelectionModal({
  visible,
  onClose,
  onSelect,
  ledgers,
  phoneLastDigits,
  totalAmount,
}: LedgerSelectionModalProps) {
  const handleSelect = (ledger: LedgerData) => {
    onSelect(ledger);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      onRequestClose={onClose}
    >
      <Pressable
        className='flex-1 bg-black/50 justify-center items-center'
        onPress={onClose}
      >
        <Pressable
          className='bg-white rounded-3xl w-full max-w-lg mx-4'
          onPress={e => e.stopPropagation()}
        >
          {/* 헤더 섹션 */}
          <View className='flex-row items-center justify-between p-6 border-b border-gray-200'>
            <Text className='text-xl font-bold text-gray-800'>장부 선택</Text>
            <Pressable
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name='close' size={24} color='#374151' />
            </Pressable>
          </View>

          {/* 안내 메시지 섹션 */}
          <View className='p-6 border-b border-gray-200'>
            <Text className='text-center text-gray-600 mb-2'>
              핸드폰 뒷자리 <Text className='font-bold'>{phoneLastDigits}</Text>
              와
            </Text>
            <Text className='text-center text-gray-600'>
              일치하는 장부가{' '}
              <Text className='font-bold'>{ledgers.length}개</Text> 있습니다
            </Text>
          </View>

          {/* 장부 목록 섹션 */}
          <ScrollView className='max-h-96'>
            {(() => {
              const insufficientLedgers = ledgers.filter(ledger => {
                const currentAmount = parseInt(
                  ledger.chargeAmount.replace(/[^\d]/g, ''),
                  10
                );
                return currentAmount < totalAmount;
              });

              const hasAvailableLedgers =
                insufficientLedgers.length < ledgers.length;

              if (!hasAvailableLedgers) {
                return (
                  <View className='p-6 text-center'>
                    <Text className='text-red-500 font-semibold mb-2'>
                      모든 장부의 잔액이 부족합니다
                    </Text>
                    <Text className='text-gray-600 text-sm'>
                      결제 금액: {totalAmount.toLocaleString()}원
                    </Text>
                  </View>
                );
              }

              return ledgers.map((ledger, index) => {
                const currentAmount = parseInt(
                  ledger.chargeAmount.replace(/[^\d]/g, ''),
                  10
                );
                const isInsufficient = currentAmount < totalAmount;

                return (
                  <Pressable
                    key={ledger.memberNumber}
                    onPress={() => !isInsufficient && handleSelect(ledger)}
                    className={`p-4 border-b border-gray-100 ${
                      index === ledgers.length - 1 ? 'border-b-0' : ''
                    } ${isInsufficient ? 'opacity-50' : ''}`}
                    disabled={isInsufficient}
                  >
                    <View className='flex-row items-center justify-between'>
                      <View className='flex-1'>
                        <View className='flex-row items-center gap-2 mb-1'>
                          <Text className='text-lg font-semibold text-gray-800'>
                            {ledger.name}
                          </Text>
                          <Text className='text-sm text-gray-500'>
                            {ledger.memberNumber}
                          </Text>
                        </View>
                        <Text className='text-gray-600 mb-1'>
                          {ledger.phoneNumber}
                        </Text>
                        <Text
                          className={`text-lg font-bold ${isInsufficient ? 'text-red-500' : 'text-green-600'}`}
                        >
                          {ledger.chargeAmount}
                          {isInsufficient && (
                            <Text className='text-sm text-red-500 ml-2'>
                              (부족)
                            </Text>
                          )}
                        </Text>
                      </View>
                      {!isInsufficient && (
                        <Ionicons
                          name='chevron-forward'
                          size={20}
                          color='#9CA3AF'
                        />
                      )}
                    </View>
                  </Pressable>
                );
              });
            })()}
          </ScrollView>

          {/* 하단 버튼 섹션 */}
          <View className='p-6 border-t border-gray-200'>
            <Pressable
              onPress={onClose}
              className={`w-full h-12 rounded-lg flex items-center justify-center ${
                ledgers.every(ledger => {
                  const currentAmount = parseInt(
                    ledger.chargeAmount.replace(/[^\d]/g, ''),
                    10
                  );
                  return currentAmount < totalAmount;
                })
                  ? 'bg-red-500'
                  : 'bg-gray-200'
              }`}
            >
              <Text
                className={`font-semibold ${
                  ledgers.every(ledger => {
                    const currentAmount = parseInt(
                      ledger.chargeAmount.replace(/[^\d]/g, ''),
                      10
                    );
                    return currentAmount < totalAmount;
                  })
                    ? 'text-white'
                    : 'text-gray-700'
                }`}
              >
                {ledgers.every(ledger => {
                  const currentAmount = parseInt(
                    ledger.chargeAmount.replace(/[^\d]/g, ''),
                    10
                  );
                  return currentAmount < totalAmount;
                })
                  ? '돌아가기'
                  : '취소'}
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
