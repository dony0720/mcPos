import Toast from 'react-native-toast-message';

/**
 * 메뉴 관리 관련 Toast 메시지들
 */
export const MenuToast = {
  // 메뉴 추가 성공
  addSuccess: (menuName: string) => {
    Toast.show({
      type: 'success',
      text1: '메뉴 추가 완료',
      text2: `${menuName}이(가) 성공적으로 추가되었습니다.`,
    });
  },

  // 메뉴 편집 성공
  editSuccess: (menuName: string) => {
    Toast.show({
      type: 'success',
      text1: '메뉴 수정 완료',
      text2: `${menuName}이(가) 성공적으로 수정되었습니다.`,
    });
  },

  // 메뉴 삭제 성공
  deleteSuccess: (menuName: string) => {
    Toast.show({
      type: 'success',
      text1: '메뉴 삭제 완료',
      text2: `${menuName}이(가) 성공적으로 삭제되었습니다.`,
    });
  },
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
