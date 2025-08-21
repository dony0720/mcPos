import React from 'react';
import Toast from 'react-native-toast-message';

import ErrorToast from './ErrorToast';
import SuccessToast from './SuccessToast';

/**
 * 커스텀 Toast Provider 컴포넌트
 * - 앱 전체에서 사용할 Toast 설정을 중앙화
 * - Success와 Error Toast 컴포넌트를 사용
 */
export default function ToastProvider() {
  return (
    <Toast
      config={{
        success: props => <SuccessToast {...props} />,
        error: props => <ErrorToast {...props} />,
      }}
      position='top'
      topOffset={60}
    />
  );
}
