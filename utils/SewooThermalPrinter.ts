/**
 * Sewoo SLK-TS100 프린터 네이티브 모듈 브릿지
 * - React Native에서 네이티브 iOS/Android 코드와 통신하는 인터페이스
 */

import { NativeModules } from 'react-native';

const { SewooThermalPrinter } = NativeModules;

interface NativePrinterModule {
  isConnected(): Promise<boolean>;
  connect(config?: {
    deviceName?: string;
    baudRate?: number;
    dataBits?: number;
    stopBits?: number;
    parity?: string;
  }): Promise<{ success: boolean; message?: string; errorCode?: string }>;
  disconnect(): Promise<{
    success: boolean;
    message?: string;
    errorCode?: string;
  }>;
  printText(
    text: string
  ): Promise<{ success: boolean; message?: string; errorCode?: string }>;
  printReceipt(
    receiptData: string
  ): Promise<{ success: boolean; message?: string; errorCode?: string }>;
  printTest(): Promise<{
    success: boolean;
    message?: string;
    errorCode?: string;
  }>;
}

// 네이티브 모듈이 없는 경우를 위한 더미 구현
const createDummyModule = (): NativePrinterModule => ({
  isConnected: () => Promise.resolve(false),
  connect: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
  disconnect: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
  printText: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
  printReceipt: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
  printTest: () =>
    Promise.resolve({ success: false, message: 'Native module not available' }),
});

// 개발 중에는 더미 모듈을 사용하고, 실제 네이티브 모듈이 구현되면 교체
const printer: NativePrinterModule = SewooThermalPrinter || createDummyModule();

export default printer;
