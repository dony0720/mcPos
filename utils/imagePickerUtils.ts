import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

import { ImageToast } from './toastUtils';

export interface ImagePickerResult {
  success: boolean;
  uri?: string;
  error?: string;
  source?: 'camera' | 'gallery';
}

/**
 * 이미지 선택 옵션을 보여주고 카메라 또는 갤러리를 선택할 수 있는 Alert를 표시합니다.
 */
export const showImagePickerAlert = (
  onCameraSelect: () => void,
  onGallerySelect: () => void
): void => {
  Alert.alert('이미지 선택', '이미지를 어떻게 선택하시겠습니까?', [
    {
      text: '취소',
      style: 'cancel',
    },
    {
      text: '카메라',
      onPress: onCameraSelect,
    },
    {
      text: '갤러리',
      onPress: onGallerySelect,
    },
  ]);
};

/**
 * 카메라에서 이미지를 선택합니다.
 */
export const pickImageFromCamera = async (): Promise<ImagePickerResult> => {
  try {
    // 카메라 권한 요청
    const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();

    if (cameraPermission.granted === false) {
      ImageToast.cameraPermissionDenied();
      return { success: false, error: 'Camera permission denied' };
    }

    // 카메라 실행
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // 정사각형 비율
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return { success: true, uri: result.assets[0].uri, source: 'camera' };
    }

    return { success: false, error: 'User canceled camera selection' };
  } catch {
    ImageToast.cameraError();
    return { success: false, error: 'Camera launch failed' };
  }
};

/**
 * 갤러리에서 이미지를 선택합니다.
 */
export const pickImageFromGallery = async (): Promise<ImagePickerResult> => {
  try {
    // 갤러리 권한 요청
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      ImageToast.galleryPermissionDenied();
      return { success: false, error: 'Gallery permission denied' };
    }

    // 갤러리 실행
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1], // 정사각형 비율
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      return { success: true, uri: result.assets[0].uri, source: 'gallery' };
    }

    return { success: false, error: 'User canceled gallery selection' };
  } catch {
    ImageToast.galleryError();
    return { success: false, error: 'Gallery access failed' };
  }
};

/**
 * 이미지 선택을 위한 통합 함수입니다.
 * Alert를 표시하고 사용자 선택에 따라 카메라 또는 갤러리를 실행합니다.
 */
export const handleImageSelection = async (): Promise<ImagePickerResult> => {
  return new Promise(resolve => {
    showImagePickerAlert(
      async () => {
        const result = await pickImageFromCamera();
        resolve(result);
      },
      async () => {
        const result = await pickImageFromGallery();
        resolve(result);
      }
    );
  });
};
