/**
 * POSConnect 프린터 네이티브 모듈 브릿지
 * - React Native에서 POSConnect SDK와 통신하는 인터페이스
 */

import { NativeModules } from 'react-native';

const { POSConnectPrinter } = NativeModules;

export interface USBDevice {
  devicePath: string;
  deviceName: string;
  vendorId: number;
  productId: number;
}

interface NativePOSConnectModule {
  /**
   * SDK 초기화
   */
  initialize(): Promise<{ success: boolean; message?: string }>;

  /**
   * USB 장치 목록 가져오기
   */
  getUsbDevices(): Promise<USBDevice[]>;

  /**
   * USB 프린터 연결
   */
  connectUSB(
    devicePath: string
  ): Promise<{ success: boolean; message?: string; errorCode?: string }>;

  /**
   * 프린터 연결 해제
   */
  disconnect(): Promise<{
    success: boolean;
    message?: string;
    errorCode?: string;
  }>;

  /**
   * 텍스트 출력
   */
  printText(
    text: string
  ): Promise<{ success: boolean; message?: string; errorCode?: string }>;

  /**
   * 용지 커팅
   */
  cutPaper(): Promise<{
    success: boolean;
    message?: string;
    errorCode?: string;
  }>;

  /**
   * 연결 상태 확인
   */
  isConnected(): Promise<boolean>;
}

// 네이티브 모듈이 없는 경우를 위한 더미 구현
const createDummyModule = (): NativePOSConnectModule => ({
  initialize: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
  getUsbDevices: () => Promise.resolve([]),
  connectUSB: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
  disconnect: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
  printText: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
  cutPaper: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
  isConnected: () => Promise.resolve(false),
});

// 개발 중에는 더미 모듈을 사용하고, 실제 네이티브 모듈이 구현되면 교체
const printer: NativePOSConnectModule =
  POSConnectPrinter || createDummyModule();

export default printer;



