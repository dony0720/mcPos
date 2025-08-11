import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

/**
 * 페이지네이션 버튼 컴포넌트의 props 타입 정의
 */
interface PaginationButtonsProps {
  onPrevPress?: () => void; // 이전 버튼 클릭 핸들러
  onNextPress?: () => void; // 다음 버튼 클릭 핸들러
  canGoPrev?: boolean; // 이전으로 갈 수 있는지 여부
  canGoNext?: boolean; // 다음으로 갈 수 있는지 여부
  currentPage: number; // 현재 페이지 (0부터 시작)
  totalPages: number; // 전체 페이지 수
}

/**
 * 페이지네이션 버튼 컴포넌트
 * - 메뉴 그리드의 페이지를 위아래로 이동하는 버튼 제공
 */
export default function PaginationButtons({
  onPrevPress,
  onNextPress,
  canGoPrev = true,
  canGoNext = true,
  currentPage,
  totalPages,
}: PaginationButtonsProps) {
  // 버튼 눌림 상태 관리
  const [isPrevPressed, setIsPrevPressed] = useState(false);
  const [isNextPressed, setIsNextPressed] = useState(false);

  // 이벤트 핸들러
  /**
   * 이전 버튼 누름 시작 핸들러
   */
  const onPrevButtonPressIn = () => {
    setIsPrevPressed(true);
  };

  /**
   * 이전 버튼 누름 종료 핸들러
   */
  const onPrevButtonPressOut = () => {
    setIsPrevPressed(false);
    onPrevPress?.();
  };

  /**
   * 다음 버튼 누름 시작 핸들러
   */
  const onNextButtonPressIn = () => {
    setIsNextPressed(true);
  };

  /**
   * 다음 버튼 누름 종료 핸들러
   */
  const onNextButtonPressOut = () => {
    setIsNextPressed(false);
    onNextPress?.();
  };

  return (
    <View
      role='group'
      className='flex-row items-center justify-center gap-4 py-4'
    >
      {/* 이전 페이지 버튼 */}
      <Pressable
        role='button'
        onPressIn={canGoPrev ? onPrevButtonPressIn : undefined}
        onPressOut={canGoPrev ? onPrevButtonPressOut : undefined}
        disabled={!canGoPrev}
        className={clsx(
          'w-10 h-10 rounded-lg border border-gray-300 flex justify-center items-center',
          {
            'bg-gray-200': isPrevPressed && canGoPrev,
            'bg-white': !isPrevPressed && canGoPrev,
            'bg-gray-100': !canGoPrev,
          }
        )}
      >
        <Ionicons
          name='chevron-back'
          size={20}
          color={canGoPrev ? '#6B7280' : '#D1D5DB'}
        />
      </Pressable>

      {/* 페이지 번호 표시 */}
      <View className='px-4'>
        <Text className='text-gray-600 text-base'>
          {totalPages > 0 ? `${currentPage + 1} / ${totalPages}` : '0 / 0'}
        </Text>
      </View>

      {/* 다음 페이지 버튼 */}
      <Pressable
        role='button'
        onPressIn={canGoNext ? onNextButtonPressIn : undefined}
        onPressOut={canGoNext ? onNextButtonPressOut : undefined}
        disabled={!canGoNext}
        className={clsx(
          'w-10 h-10 rounded-lg border border-gray-300 flex justify-center items-center',
          {
            'bg-gray-200': isNextPressed && canGoNext,
            'bg-white': !isNextPressed && canGoNext,
            'bg-gray-100': !canGoNext,
          }
        )}
      >
        <Ionicons
          name='chevron-forward'
          size={20}
          color={canGoNext ? '#6B7280' : '#D1D5DB'}
        />
      </Pressable>
    </View>
  );
}
