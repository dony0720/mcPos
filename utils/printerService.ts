/**
 * 프린터 서비스 팩토리 함수
 * - SOLID 원칙 준수: DIP (의존성 역전 원칙)
 * - 프린터 구현체를 추상화하여 제공
 */

import { PrinterConfig, PrinterService } from '../types';
import { SewooThermalPrinter } from './SewooThermalPrinter';

/**
 * 프린터 서비스 인스턴스 생성 (Factory Pattern)
 * - 현재는 Sewoo SLK-TS100만 지원
 * - 추후 다른 프린터 모델 추가 가능 (OCP: 개방/폐쇄 원칙)
 */
export const createPrinterService = (config?: Partial<PrinterConfig>): PrinterService => {
  // 현재는 Sewoo SLK-TS100만 지원
  return new SewooThermalPrinter(config);
};

/**
 * 기본 프린터 설정
 */
export const DEFAULT_PRINTER_CONFIG: PrinterConfig = {
  // Sewoo SLK-TS100 기본 설정
  vendorId: 0x1A00, // 실제 Vendor ID로 수정 필요
  productId: 0x0001, // 실제 Product ID로 수정 필요
  paperWidth: 80,
  fontSize: 'medium',
  alignment: 'left',
  dpi: 203,
  printSpeed: 220,
};

/**
 * 프린터 설정 유틸리티 함수들
 */
export const PrinterUtils = {
  /**
   * 프린터 연결 테스트
   */
  async testConnection(printerService: PrinterService): Promise<boolean> {
    try {
      const connectResult = await printerService.connect();
      if (!connectResult.success) {
        return false;
      }

      const testResult = await printerService.printTest();
      await printerService.disconnect();

      return testResult.success;
    } catch (error) {
      console.error('프린터 연결 테스트 실패:', error);
      return false;
    }
  },

  /**
   * 프린터 상태 확인
   */
  async checkPrinterHealth(printerService: PrinterService): Promise<{
    isHealthy: boolean;
    issues: string[];
  }> {
    const issues: string[] = [];

    try {
      // 연결 상태 확인
      const isConnected = await printerService.isConnected();
      if (!isConnected) {
        issues.push('프린터가 연결되지 않았습니다.');
      }

      // 프린터 상태 확인 (구현된 경우)
      if ('getPrinterStatus' in printerService) {
        const status = await (printerService as any).getPrinterStatus();
        
        if (status.paperStatus === 'empty') {
          issues.push('용지가 없습니다.');
        } else if (status.paperStatus === 'low') {
          issues.push('용지가 부족합니다.');
        }

        if (status.printerStatus === 'error') {
          issues.push('프린터에 오류가 발생했습니다.');
        }

        if (status.temperature === 'high') {
          issues.push('프린터 온도가 높습니다.');
        }
      }

      return {
        isHealthy: issues.length === 0,
        issues,
      };

    } catch (error) {
      return {
        isHealthy: false,
        issues: [`프린터 상태 확인 실패: ${error}`],
      };
    }
  },

  /**
   * ESC/POS 명령어 유틸리티
   */
  ESCPOSCommands: {
    // 텍스트 포맷
    RESET: '\x1B\x40', // ESC @
    BOLD_ON: '\x1B\x45\x01', // ESC E 1
    BOLD_OFF: '\x1B\x45\x00', // ESC E 0
    UNDERLINE_ON: '\x1B\x2D\x01', // ESC - 1
    UNDERLINE_OFF: '\x1B\x2D\x00', // ESC - 0

    // 정렬
    ALIGN_LEFT: '\x1B\x61\x00', // ESC a 0
    ALIGN_CENTER: '\x1B\x61\x01', // ESC a 1
    ALIGN_RIGHT: '\x1B\x61\x02', // ESC a 2

    // 크기
    SIZE_NORMAL: '\x1B\x21\x00', // ESC ! 0
    SIZE_LARGE: '\x1B\x21\x10', // ESC ! 16
    SIZE_WIDE: '\x1B\x21\x20', // ESC ! 32

    // 용지 제어
    PAPER_CUT: '\x1D\x56\x00', // GS V 0
    LINE_FEED: '\x0A', // LF
    FORM_FEED: '\x0C', // FF
  },
};

export default {
  createPrinterService,
  DEFAULT_PRINTER_CONFIG,
  PrinterUtils,
};