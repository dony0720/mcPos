import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useDiscountStore } from '../../stores/useDiscountStore';
import { Discount, DiscountModalProps, DiscountType } from '../../types';

export default function DiscountModal({
  visible,
  onClose,
  onSelectDiscount,
}: DiscountModalProps) {
  const { discounts } = useDiscountStore();

  // 할인 항목 선택 처리 - 선택 후 모달 닫기
  const handleDiscountSelect = (discount: Discount) => {
    onSelectDiscount(discount);
    onClose();
  };

  // 할인 금액 표시 형식 처리 - 천 단위 콤마와 원 단위 표시
  const formatDiscountDisplay = (discount: Discount) => {
    if (discount.type === DiscountType.PERCENTAGE) {
      return `${discount.value}%`;
    }
    return `${discount.value.toLocaleString()}원`;
  };

  return (
    <Modal visible={visible} transparent={true} onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View className='flex-1 bg-black/50 justify-center items-center p-4'>
          <TouchableWithoutFeedback>
            <View className='bg-white rounded-2xl w-full max-w-md h-[600px]'>
              {/* 모달 헤더 섹션 - 제목과 닫기 버튼 */}
              <View className='flex-row items-center justify-between p-6 border-b border-gray-200'>
                <Text className='text-2xl font-bold text-gray-900'>
                  할인 선택
                </Text>
                <Pressable
                  onPress={onClose}
                  className='w-8 h-8 items-center justify-center'
                >
                  <Ionicons name='close' size={24} color='#6B7280' />
                </Pressable>
              </View>

              {/* 할인 옵션 목록 섹션 - 스크롤 가능한 할인 항목들 */}
              <ScrollView
                className='flex-1'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
              >
                <View className='p-4'>
                  {discounts.map(discount => (
                    <Pressable
                      key={discount.id}
                      onPress={() => handleDiscountSelect(discount)}
                      className='bg-gray-50 rounded-xl p-4 mb-3 border border-gray-200'
                      style={({ pressed }) => ({
                        opacity: pressed ? 0.7 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }],
                      })}
                    >
                      <View className='flex-row items-center justify-between'>
                        <View className='flex-1'>
                          <View className='flex-row items-center gap-2 mb-1'>
                            <Ionicons
                              name='pricetag'
                              size={20}
                              color='#2CC56F'
                            />
                            <Text className='text-lg font-semibold text-gray-900'>
                              {discount.name}
                            </Text>
                          </View>
                        </View>
                        <View className='bg-primaryGreen/10 px-3 py-1 rounded-full'>
                          <Text className='text-primaryGreen font-bold'>
                            {formatDiscountDisplay(discount)}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>

              {/* 모달 푸터 섹션 - 취소 버튼 */}
              <View className='p-4 border-t border-gray-200'>
                <Pressable
                  onPress={onClose}
                  className='bg-gray-100 rounded-xl p-4 items-center'
                >
                  <Text className='text-gray-700 font-medium'>취소</Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
