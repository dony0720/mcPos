import Toast from 'react-native-toast-message';

import { ToastActionType, ToastCategoryType } from '../types';

/**
 * 통합 관리 Toast 시스템
 * - 메뉴, 카테고리 등 다양한 관리 기능에 대한 통합 토스트 처리
 */
export const ManagementToast = {
  showSuccess: (
    action: ToastActionType,
    category: ToastCategoryType,
    name: string
  ) => {
    const categoryText =
      category === ToastCategoryType.MENU ? '메뉴' : '카테고리';

    let actionText = '';
    let message = '';

    switch (action) {
      case ToastActionType.ADD:
        actionText = '추가';
        message =
          category === ToastCategoryType.MENU
            ? `${name}이(가) 성공적으로 추가되었습니다.`
            : `${name} 카테고리가 성공적으로 추가되었습니다.`;
        break;
      case ToastActionType.EDIT:
        actionText = '수정';
        message =
          category === ToastCategoryType.MENU
            ? `${name}이(가) 성공적으로 수정되었습니다.`
            : `${name} 카테고리가 성공적으로 수정되었습니다.`;
        break;
      case ToastActionType.DELETE:
        actionText = '삭제';
        message =
          category === ToastCategoryType.MENU
            ? `${name}이(가) 성공적으로 삭제되었습니다.`
            : `${name} 카테고리가 성공적으로 삭제되었습니다.`;
        break;
    }

    Toast.show({
      type: 'success',
      text1: `${categoryText} ${actionText} 완료`,
      text2: message,
    });
  },
};

/**
 * 하위 호환성을 위한 기존 Toast 함수들
 * @deprecated ManagementToast.showSuccess를 사용하세요
 */
export const MenuToast = {
  addSuccess: (menuName: string) =>
    ManagementToast.showSuccess(
      ToastActionType.ADD,
      ToastCategoryType.MENU,
      menuName
    ),
  editSuccess: (menuName: string) =>
    ManagementToast.showSuccess(
      ToastActionType.EDIT,
      ToastCategoryType.MENU,
      menuName
    ),
  deleteSuccess: (menuName: string) =>
    ManagementToast.showSuccess(
      ToastActionType.DELETE,
      ToastCategoryType.MENU,
      menuName
    ),
};

export const CategoryToast = {
  addSuccess: (categoryName: string) =>
    ManagementToast.showSuccess(
      ToastActionType.ADD,
      ToastCategoryType.CATEGORY,
      categoryName
    ),
  editSuccess: (categoryName: string) =>
    ManagementToast.showSuccess(
      ToastActionType.EDIT,
      ToastCategoryType.CATEGORY,
      categoryName
    ),
  deleteSuccess: (categoryName: string) =>
    ManagementToast.showSuccess(
      ToastActionType.DELETE,
      ToastCategoryType.CATEGORY,
      categoryName
    ),
};

/**
 * 이미지 선택 관련 Toast 메시지들
 */
export const ImageToast = {
  // 이미지 선택 성공 (카메라)
  cameraSuccess: () => {
    Toast.show({
      type: 'success',
      text1: '이미지 선택 완료',
      text2: '카메라에서 이미지가 성공적으로 선택되었습니다.',
    });
  },

  // 이미지 선택 성공 (갤러리)
  gallerySuccess: () => {
    Toast.show({
      type: 'success',
      text1: '이미지 선택 완료',
      text2: '갤러리에서 이미지가 성공적으로 선택되었습니다.',
    });
  },

  // 갤러리 권한 거부
  galleryPermissionDenied: () => {
    Toast.show({
      type: 'error',
      text1: '권한 필요',
      text2: '이미지를 선택하려면 사진 라이브러리 접근 권한이 필요합니다.',
    });
  },

  // 카메라 권한 거부
  cameraPermissionDenied: () => {
    Toast.show({
      type: 'error',
      text1: '권한 필요',
      text2: '카메라 접근 권한이 필요합니다.',
    });
  },

  // 이미지 선택 일반 오류
  selectionError: () => {
    Toast.show({
      type: 'error',
      text1: '오류',
      text2: '이미지 선택 중 오류가 발생했습니다.',
    });
  },

  // 카메라 실행 오류
  cameraError: () => {
    Toast.show({
      type: 'error',
      text1: '오류',
      text2: '카메라 실행 중 오류가 발생했습니다.',
    });
  },

  // 갤러리 접근 오류
  galleryError: () => {
    Toast.show({
      type: 'error',
      text1: '오류',
      text2: '갤러리 접근 중 오류가 발생했습니다.',
    });
  },
};

/**
 * 일반적인 Toast 메시지들
 */
export const CommonToast = {
  // 일반 성공 메시지
  success: (title: string, message?: string) => {
    Toast.show({
      type: 'success',
      text1: title,
      text2: message,
    });
  },

  // 일반 에러 메시지
  error: (title: string, message?: string) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
    });
  },
};
