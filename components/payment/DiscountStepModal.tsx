import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useDiscountStore } from '../../stores/useDiscountStore';
import { Discount, DiscountType, OrderItem } from '../../types';
import { calculateDiscountedUnitPrice } from '../../utils';

interface DiscountStepModalProps {
  visible: boolean;
  orderItems: OrderItem[];
  onApplyDiscount: (itemIds: string[], discount: Discount) => void;
  onRemoveDiscount: (itemIds: string[]) => void;
  onDone: () => void;
  onClose: () => void;
}

// 할인 금액 표시 형식 - 천 단위 콤마와 원 단위 표시
const formatDiscountDisplay = (discount: Discount) => {
  if (discount.type === DiscountType.PERCENTAGE) {
    return `${discount.value}%`;
  }
  return `${discount.value.toLocaleString()}원`;
};

/**
 * 할인 적용 모달 - 결제 화면에서 "할인 적용" 버튼으로 필요할 때만 여는 온디맨드 액션
 * - 할인권은 그리드로 바로 노출해서 선택 즉시 적용 (중첩 모달 없음)
 * - 아이템 선택 상태는 이 모달 안에서만 유효한 로컬 상태
 */
export default function DiscountStepModal({
  visible,
  orderItems,
  onApplyDiscount,
  onRemoveDiscount,
  onDone,
  onClose,
}: DiscountStepModalProps) {
  const { discounts } = useDiscountStore();
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [isAllChecked, setIsAllChecked] = useState(false);

  const hasSelectedItems = checkedItems.size > 0;

  // 단계 진입 시마다 선택 상태 초기화
  useEffect(() => {
    if (visible) {
      setCheckedItems(new Set());
      setIsAllChecked(false);
    }
  }, [visible]);

  const handleToggleItem = (itemId: string) => {
    const next = new Set(checkedItems);
    if (next.has(itemId)) {
      next.delete(itemId);
    } else {
      next.add(itemId);
    }
    setCheckedItems(next);
    setIsAllChecked(next.size === orderItems.length && orderItems.length > 0);
  };

  const handleToggleAll = () => {
    if (isAllChecked) {
      setIsAllChecked(false);
      setCheckedItems(new Set());
    } else {
      setIsAllChecked(true);
      setCheckedItems(new Set(orderItems.map(item => item.id)));
    }
  };

  const handleDiscountPress = (discount: Discount) => {
    if (!hasSelectedItems) {
      return;
    }
    onApplyDiscount(Array.from(checkedItems), discount);
    setCheckedItems(new Set());
    setIsAllChecked(false);
  };

  const handleDiscountDelete = () => {
    if (!hasSelectedItems) {
      return;
    }
    onRemoveDiscount(Array.from(checkedItems));
    setCheckedItems(new Set());
    setIsAllChecked(false);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType='fade'
      supportedOrientations={['landscape', 'landscape-left', 'landscape-right']}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className='flex-1 bg-black/50 justify-center items-center p-4'>
          <TouchableWithoutFeedback>
            <View className='bg-white rounded-3xl w-full max-w-2xl h-[760px]'>
              {/* 헤더 섹션 */}
              <View className='flex-row items-center justify-between p-6 border-b border-gray-100'>
                <View>
                  <Text className='text-xl font-pretendard-bold text-[#191f28]'>
                    할인 적용
                  </Text>
                  <Text className='text-[#8b95a1] text-sm font-pretendard mt-1'>
                    할인이 필요 없다면 바로 다음으로 진행하세요
                  </Text>
                </View>
                <Pressable
                  onPress={onClose}
                  className='w-8 h-8 items-center justify-center'
                >
                  <Ionicons name='close' size={24} color='#8b95a1' />
                </Pressable>
              </View>

              {/* 전체 선택 컨트롤 */}
              <View className='flex-row items-center justify-between px-6 pt-4'>
                <Pressable
                  onPress={handleToggleAll}
                  className='flex-row items-center gap-2'
                  style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
                >
                  <View
                    className={clsx(
                      'w-5 h-5 rounded-full flex items-center justify-center',
                      {
                        'bg-primaryGreen': isAllChecked,
                        'border border-gray-300': !isAllChecked,
                      }
                    )}
                  >
                    {isAllChecked && (
                      <Ionicons name='checkmark' size={12} color='#fff' />
                    )}
                  </View>
                  <Text className='text-[#4e5968] text-sm font-pretendard-semibold'>
                    전체 선택
                  </Text>
                </Pressable>
              </View>

              {/* 아이템 목록 섹션 */}
              <ScrollView
                className='flex-1'
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 8 }}
              >
                {orderItems.map(item => {
                  const isChecked = checkedItems.has(item.id);
                  const unitPrice = calculateDiscountedUnitPrice(item);
                  const itemTotalPrice = unitPrice * item.quantity;
                  const menuName = item.discount
                    ? `${item.menuItem.name} (${item.menuItem.temperature}) x${item.quantity} [${item.discount.name}]`
                    : `${item.menuItem.name} (${item.menuItem.temperature}) x${item.quantity}`;

                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => handleToggleItem(item.id)}
                      className={clsx(
                        'w-full rounded-2xl border px-4 py-4 mb-3 flex-row items-center gap-3',
                        {
                          'border-primaryGreen bg-[#f0faf6]': isChecked,
                          'border-gray-200 bg-white': !isChecked,
                        }
                      )}
                    >
                      <View
                        className={clsx(
                          'w-6 h-6 rounded-full flex items-center justify-center',
                          {
                            'bg-primaryGreen': isChecked,
                            'border border-gray-300': !isChecked,
                          }
                        )}
                      >
                        {isChecked && (
                          <Ionicons name='checkmark' size={14} color='#fff' />
                        )}
                      </View>
                      <View className='flex-1 min-w-0'>
                        <Text
                          numberOfLines={1}
                          className='text-[#191f28] text-base font-pretendard-semibold'
                        >
                          {menuName}
                        </Text>
                        {item.options.length > 0 && (
                          <Text className='text-[#8b95a1] text-xs mt-1 font-pretendard'>
                            {item.options.join(', ')}
                          </Text>
                        )}
                      </View>
                      <Text className='text-[#191f28] text-base font-pretendard-semibold'>
                        {itemTotalPrice.toLocaleString()}원
                      </Text>
                    </Pressable>
                  );
                })}

                {/* 할인권 그리드 - 선택 즉시 적용, 별도 모달 없음 */}
                <View className='mt-2 mb-6'>
                  <Text className='text-base font-pretendard-bold text-[#191f28] mb-1'>
                    할인 선택
                  </Text>
                  <Text className='text-[#8b95a1] text-xs font-pretendard mb-3'>
                    {hasSelectedItems
                      ? '적용할 할인을 선택하세요'
                      : '할인을 적용하려면 위에서 메뉴를 먼저 선택하세요'}
                  </Text>

                  <View className='flex-row flex-wrap gap-3'>
                    {discounts.map(discount => (
                      <Pressable
                        key={discount.id}
                        onPress={() => handleDiscountPress(discount)}
                        disabled={!hasSelectedItems}
                        className={clsx(
                          'w-[31%] h-20 rounded-2xl border px-4 py-3 justify-between',
                          {
                            'border-gray-200 bg-white': hasSelectedItems,
                            'border-gray-100 bg-gray-50': !hasSelectedItems,
                          }
                        )}
                      >
                        <Text
                          numberOfLines={1}
                          className={clsx('text-sm font-pretendard-bold', {
                            'text-[#191f28]': hasSelectedItems,
                            'text-gray-300': !hasSelectedItems,
                          })}
                        >
                          {discount.name}
                        </Text>
                        <Text
                          className={clsx('text-base font-pretendard-bold', {
                            'text-primaryGreen': hasSelectedItems,
                            'text-gray-300': !hasSelectedItems,
                          })}
                        >
                          {formatDiscountDisplay(discount)}
                        </Text>
                      </Pressable>
                    ))}

                    {/* 할인 삭제 카드 */}
                    <Pressable
                      onPress={handleDiscountDelete}
                      disabled={!hasSelectedItems}
                      className={clsx(
                        'w-[31%] h-20 rounded-2xl border px-4 py-3 items-center justify-center gap-1',
                        {
                          'border-red-200 bg-white': hasSelectedItems,
                          'border-gray-100 bg-gray-50': !hasSelectedItems,
                        }
                      )}
                    >
                      <Ionicons
                        name='close-circle-outline'
                        size={18}
                        color={hasSelectedItems ? '#F87171' : '#d1d5db'}
                      />
                      <Text
                        className={clsx('text-sm font-pretendard-bold', {
                          'text-red-400': hasSelectedItems,
                          'text-gray-300': !hasSelectedItems,
                        })}
                      >
                        할인 삭제
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </ScrollView>

              {/* 완료 버튼 */}
              <View className='p-6 border-t border-gray-100'>
                <Pressable
                  onPress={onDone}
                  className='w-full h-14 rounded-2xl bg-primaryGreen flex items-center justify-center'
                >
                  <Text className='text-white text-lg font-pretendard-bold'>
                    완료
                  </Text>
                </Pressable>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
