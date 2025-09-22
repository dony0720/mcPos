/**
 * Sewoo SLK-TS100 프린터 서비스 구현
 * - SOLID 원칙에 따른 프린터 서비스 인터페이스 구현
 * - DIP: 추상화에 의존하여 테스트 가능하고 확장 가능한 구조
 */

import {
  CashInspectionReceiptData,
  PrinterConfig,
  PrinterService,
  PrintResult,
  ReceiptData,
} from '../types';
import SewooThermalPrinter from './SewooThermalPrinter';

/**
 * Sewoo SLK-TS100 프린터 서비스 구현체
 * - SRP: 프린터 출력만을 담당
 * - OCP: 새로운 출력 형식 추가 시 기존 코드 수정 없이 확장 가능
 */
export class SewooThermalPrinterService implements PrinterService {
  private isConnectionActive = false;

  /**
   * 프린터 연결 상태 확인
   */
  async isConnected(): Promise<boolean> {
    try {
      const connected = await SewooThermalPrinter.isConnected();
      this.isConnectionActive = connected;
      return connected;
    } catch (error) {
      console.error('프린터 연결 상태 확인 실패:', error);
      this.isConnectionActive = false;
      return false;
    }
  }

  /**
   * 프린터 연결
   */
  async connect(config?: PrinterConfig): Promise<PrintResult> {
    try {
      const defaultConfig = {
        deviceName: 'SLK-TS100',
        baudRate: 9600,
        dataBits: 8,
        stopBits: 1,
        parity: 'none',
        ...config,
      };

      const result = await SewooThermalPrinter.connect(defaultConfig);
      this.isConnectionActive = result.success;

      return {
        success: result.success,
        message: result.success
          ? '프린터 연결 성공'
          : result.message || '프린터 연결 실패',
        errorCode: result.errorCode,
      };
    } catch (error) {
      console.error('프린터 연결 실패:', error);
      this.isConnectionActive = false;
      return {
        success: false,
        message: '프린터 연결 중 오류가 발생했습니다.',
        errorCode: 'CONNECTION_ERROR',
      };
    }
  }

  /**
   * 프린터 연결 해제
   */
  async disconnect(): Promise<PrintResult> {
    try {
      const result = await SewooThermalPrinter.disconnect();
      this.isConnectionActive = false;

      return {
        success: result.success,
        message: result.success
          ? '프린터 연결 해제 성공'
          : result.message || '프린터 연결 해제 실패',
        errorCode: result.errorCode,
      };
    } catch (error) {
      console.error('프린터 연결 해제 실패:', error);
      this.isConnectionActive = false;
      return {
        success: false,
        message: '프린터 연결 해제 중 오류가 발생했습니다.',
        errorCode: 'DISCONNECTION_ERROR',
      };
    }
  }

  /**
   * 영수증 출력
   */
  async printReceipt(receiptData: ReceiptData): Promise<PrintResult> {
    try {
      // 연결 상태 확인
      if (!this.isConnectionActive) {
        const connectResult = await this.connect();
        if (!connectResult.success) {
          return connectResult;
        }
      }

      // 영수증 텍스트 생성
      const receiptText = this.formatReceiptText(receiptData);

      // 프린터로 출력
      const result = await SewooThermalPrinter.printReceipt(receiptText);

      return {
        success: result.success,
        message: result.success
          ? '영수증 출력 완료'
          : result.message || '영수증 출력 실패',
        errorCode: result.errorCode,
      };
    } catch (error) {
      console.error('영수증 출력 실패:', error);
      return {
        success: false,
        message: '영수증 출력 중 오류가 발생했습니다.',
        errorCode: 'PRINT_ERROR',
      };
    }
  }

  /**
   * 시재 점검 영수증 출력
   */
  async printCashInspection(
    inspectionData: CashInspectionReceiptData
  ): Promise<PrintResult> {
    try {
      // 연결 상태 확인
      if (!this.isConnectionActive) {
        const connectResult = await this.connect();
        if (!connectResult.success) {
          return connectResult;
        }
      }

      // 시재 점검 영수증 텍스트 생성
      const inspectionText = this.formatCashInspectionText(inspectionData);

      // 프린터로 출력
      const result = await SewooThermalPrinter.printReceipt(inspectionText);

      return {
        success: result.success,
        message: result.success
          ? '시재 점검 영수증 출력 완료'
          : result.message || '시재 점검 영수증 출력 실패',
        errorCode: result.errorCode,
      };
    } catch (error) {
      console.error('시재 점검 영수증 출력 실패:', error);
      return {
        success: false,
        message: '시재 점검 영수증 출력 중 오류가 발생했습니다.',
        errorCode: 'PRINT_ERROR',
      };
    }
  }

  /**
   * 테스트 출력
   */
  async printTest(): Promise<PrintResult> {
    try {
      const result = await SewooThermalPrinter.printTest();

      return {
        success: result.success,
        message: result.success
          ? '테스트 출력 완료'
          : result.message || '테스트 출력 실패',
        errorCode: result.errorCode,
      };
    } catch (error) {
      console.error('테스트 출력 실패:', error);
      return {
        success: false,
        message: '테스트 출력 중 오류가 발생했습니다.',
        errorCode: 'PRINT_ERROR',
      };
    }
  }

  /**
   * 영수증 텍스트 포맷팅
   * - SRP: 영수증 포맷팅만 담당
   */
  private formatReceiptText(data: ReceiptData): string {
    const lines: string[] = [];

    // 헤더
    lines.push('================================');
    lines.push(`         ${data.header.storeName}         `);
    if (data.header.storeAddress) {
      lines.push(`     ${data.header.storeAddress}     `);
    }
    if (data.header.storePhone) {
      lines.push(`       ${data.header.storePhone}       `);
    }
    lines.push('================================');
    lines.push(`영수증 번호: ${data.header.receiptNumber}`);
    lines.push(`일시: ${data.header.dateTime}`);
    lines.push('--------------------------------');

    // 상품 목록
    lines.push('상품명           수량  단가    금액');
    lines.push('--------------------------------');

    data.items.forEach(item => {
      const nameLength = 12;
      const truncatedName =
        item.name.length > nameLength
          ? item.name.substring(0, nameLength - 1) + '…'
          : item.name.padEnd(nameLength);

      const quantity = item.quantity.toString().padStart(3);
      const unitPrice = item.unitPrice.toLocaleString().padStart(6);
      const totalPrice = item.totalPrice.toLocaleString().padStart(7);

      lines.push(`${truncatedName} ${quantity} ${unitPrice} ${totalPrice}`);

      // 옵션 표시
      if (item.options && item.options.length > 0) {
        item.options.forEach(option => {
          lines.push(`  └ ${option}`);
        });
      }
    });

    lines.push('--------------------------------');

    // 합계
    lines.push(
      `소계:                ${data.summary.subtotal.toLocaleString()}원`
    );

    if (data.summary.discount && data.summary.discount > 0) {
      lines.push(
        `할인:               -${data.summary.discount.toLocaleString()}원`
      );
    }

    if (data.summary.tax && data.summary.tax > 0) {
      lines.push(`세금:                ${data.summary.tax.toLocaleString()}원`);
    }

    lines.push('================================');
    lines.push(`총액:                ${data.summary.total.toLocaleString()}원`);
    lines.push(`결제방법:            ${data.summary.paymentMethod}`);

    if (data.summary.receivedAmount) {
      lines.push(
        `받은금액:            ${data.summary.receivedAmount.toLocaleString()}원`
      );
    }

    if (data.summary.changeAmount) {
      lines.push(
        `거스름돈:            ${data.summary.changeAmount.toLocaleString()}원`
      );
    }

    lines.push('================================');

    // 푸터
    if (data.footer?.message) {
      lines.push('');
      lines.push(data.footer.message);
      lines.push('');
    }

    lines.push('     감사합니다. 또 오세요!     ');
    lines.push('');
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * 시재 점검 영수증 텍스트 포맷팅
   * - SRP: 시재 점검 영수증 포맷팅만 담당
   */
  private formatCashInspectionText(data: CashInspectionReceiptData): string {
    const lines: string[] = [];

    // 헤더
    lines.push('================================');
    lines.push(`         ${data.header.storeName}         `);
    lines.push('================================');
    lines.push(`         ${data.header.title}         `);
    lines.push(`일시: ${data.header.dateTime}`);
    lines.push('--------------------------------');

    // 시재 내역
    lines.push('권종               수량      금액');
    lines.push('--------------------------------');

    data.cashData.forEach(item => {
      const denomination = item.denomination.padEnd(15);
      const quantity = item.quantity.toString().padStart(4);
      const amount = item.amount.toLocaleString().padStart(9);

      lines.push(`${denomination} ${quantity} ${amount}원`);
    });

    lines.push('--------------------------------');
    lines.push(
      `총 시재 금액:        ${data.summary.totalAmount.toLocaleString()}원`
    );
    lines.push('================================');
    lines.push(`점검자: ${data.summary.inspector}`);
    lines.push('');
    lines.push('     시재 점검이 완료되었습니다     ');
    lines.push('');
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }
}

/**
 * 개발/테스트용 Mock 프린터 서비스
 * - LSP: PrinterService 인터페이스를 완전히 대체 가능
 */
export class MockPrinterService implements PrinterService {
  private mockConnected = false;

  async isConnected(): Promise<boolean> {
    return this.mockConnected;
  }

  async connect(config?: PrinterConfig): Promise<PrintResult> {
    console.log('Mock 프린터 연결:', config);
    this.mockConnected = true;
    return {
      success: true,
      message: 'Mock 프린터 연결 성공',
    };
  }

  async disconnect(): Promise<PrintResult> {
    console.log('Mock 프린터 연결 해제');
    this.mockConnected = false;
    return {
      success: true,
      message: 'Mock 프린터 연결 해제 성공',
    };
  }

  async printReceipt(receiptData: ReceiptData): Promise<PrintResult> {
    console.log('Mock 영수증 출력:', receiptData);
    // 개발 중에는 콘솔에 영수증 내용을 출력
    console.log('=== 영수증 출력 ===');
    console.log(`매장: ${receiptData.header.storeName}`);
    console.log(`영수증 번호: ${receiptData.header.receiptNumber}`);
    console.log(`일시: ${receiptData.header.dateTime}`);
    console.log('--- 상품 목록 ---');
    receiptData.items.forEach(item => {
      console.log(
        `${item.name} x${item.quantity} = ${item.totalPrice.toLocaleString()}원`
      );
    });
    console.log(`총액: ${receiptData.summary.total.toLocaleString()}원`);
    console.log('================');

    return {
      success: true,
      message: 'Mock 영수증 출력 완료',
    };
  }

  async printCashInspection(
    inspectionData: CashInspectionReceiptData
  ): Promise<PrintResult> {
    console.log('Mock 시재 점검 영수증 출력:', inspectionData);
    // 개발 중에는 콘솔에 시재 점검 내용을 출력
    console.log('=== 시재 점검 영수증 ===');
    console.log(`매장: ${inspectionData.header.storeName}`);
    console.log(`일시: ${inspectionData.header.dateTime}`);
    console.log('--- 시재 내역 ---');
    inspectionData.cashData.forEach(item => {
      console.log(
        `${item.denomination}: ${item.quantity}개 = ${item.amount.toLocaleString()}원`
      );
    });
    console.log(
      `총 시재 금액: ${inspectionData.summary.totalAmount.toLocaleString()}원`
    );
    console.log(`점검자: ${inspectionData.summary.inspector}`);
    console.log('====================');

    return {
      success: true,
      message: 'Mock 시재 점검 영수증 출력 완료',
    };
  }

  async printTest(): Promise<PrintResult> {
    console.log('Mock 테스트 출력');
    return {
      success: true,
      message: 'Mock 테스트 출력 완료',
    };
  }
}

/**
 * 프린터 서비스 팩토리
 * - DIP: 구체적 구현체가 아닌 추상화에 의존
 * - 환경에 따라 적절한 서비스 인스턴스 제공
 */
export const createPrinterService = (): PrinterService => {
  // 개발 환경에서는 Mock 서비스 사용
  if (__DEV__) {
    return new MockPrinterService();
  }

  // 프로덕션 환경에서는 실제 프린터 서비스 사용
  return new SewooThermalPrinterService();
};
