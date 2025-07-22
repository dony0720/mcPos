import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import React, { useState } from 'react';
import { Pressable, View } from 'react-native';

/**
 * 페이지네이션 버튼 컴포넌트의 props 타입 정의
 */
interface PaginationButtonsProps {
  onUpPress?: () => void; // 위쪽 버튼 클릭 핸들러
  onDownPress?: () => void; // 아래쪽 버튼 클릭 핸들러
}

/**
 * 페이지네이션 버튼 컴포넌트
 * - 메뉴 그리드의 페이지를 위아래로 이동하는 버튼 제공
 */
export default function PaginationButtons({
  onUpPress,
  onDownPress,
}: PaginationButtonsProps) {
  // 버튼 눌림 상태 관리
  const [isUpPressed, setIsUpPressed] = useState(false);
  const [isDownPressed, setIsDownPressed] = useState(false);

  // 이벤트 핸들러
  /**
   * 위쪽 버튼 누름 시작 핸들러
   */
  const onUpButtonPressIn = () => {
    setIsUpPressed(true);
  };

  /**
   * 위쪽 버튼 누름 종료 핸들러
   */
  const onUpButtonPressOut = () => {
    setIsUpPressed(false);
    onUpPress?.();
  };

  /**
   * 아래쪽 버튼 누름 시작 핸들러
   */
  const onDownButtonPressIn = () => {
    setIsDownPressed(true);
  };

  /**
   * 아래쪽 버튼 누름 종료 핸들러
   */
  const onDownButtonPressOut = () => {
    setIsDownPressed(false);
    onDownPress?.();
  };

  return (
    <View role='group' className='w-[50px] h-full pl-0 box-border'>
      {/* 위쪽 페이지네이션 버튼 */}
      <Pressable
        role='button'
        onPressIn={onUpButtonPressIn}
        onPressOut={onUpButtonPressOut}
        className={clsx(
          'w-full h-1/2 rounded-t-lg border border-gray-300 flex justify-center items-center',
          {
            'bg-gray-200': isUpPressed,
            'bg-white': !isUpPressed,
          }
        )}
      >
        <Ionicons name='chevron-up' size={24} color='#6B7280' />
      </Pressable>

      {/* 아래쪽 페이지네이션 버튼 */}
      <Pressable
        role='button'
        onPressIn={onDownButtonPressIn}
        onPressOut={onDownButtonPressOut}
        className={clsx(
          'w-full h-1/2 border rounded-b-lg border-gray-300 border-t-0 flex justify-center items-center',
          {
            'bg-gray-200': isDownPressed,
            'bg-white': !isDownPressed,
          }
        )}
      >
        <Ionicons name='chevron-down' size={24} color='#6B7280' />
      </Pressable>
    </View>
  );
}
