/**
 * POSConnect SDK 프린터 서비스 구현
 * - SOLID 원칙에 따른 프린터 서비스 인터페이스 구현
 * - USB 프린터 연결 지원
 */

import {
  CashInspectionReceiptData,
  DailySettlementReceiptData,
  PrinterConfig,
  PrinterService,
  PrintResult,
  ReceiptData,
} from '../types';
import POSConnectPrinter, { USBDevice } from './POSConnectPrinter';

export class POSConnectPrinterService implements PrinterService {
  private isConnectionActive = false;
  private connectedDevice: string | null = null;
  private isInitialized = false;

  /**
   * SDK 초기화
   */
  private async ensureInitialized(): Promise<boolean> {
    if (this.isInitialized) {
      return true;
    }

    try {
      const result = await POSConnectPrinter.initialize();
      this.isInitialized = result.success;
      return result.success;
    } catch (error) {
      return false;
    }
  }

  /**
   * USB 장치 목록 가져오기
   */
  async getUsbDevices(): Promise<USBDevice[]> {
    try {
      await this.ensureInitialized();
      return await POSConnectPrinter.getUsbDevices();
    } catch (error) {
      return [];
    }
  }

  /**
   * 프린터 연결 상태 확인
   */
  async isConnected(): Promise<boolean> {
    try {
      const connected = await POSConnectPrinter.isConnected();
      this.isConnectionActive = connected;
      return connected;
    } catch (error) {
      this.isConnectionActive = false;
      return false;
    }
  }

  /**
   * USB 프린터 연결
   */
  async connect(config?: PrinterConfig): Promise<PrintResult> {
    try {
      // SDK 초기화
      const initialized = await this.ensureInitialized();
      if (!initialized) {
        return {
          success: false,
          message: 'SDK 초기화 실패',
          errorCode: 'INIT_FAILED',
        };
      }

      // USB 장치 목록 가져오기
      const devices = await this.getUsbDevices();
      if (devices.length === 0) {
        return {
          success: false,
          message: 'USB 프린터를 찾을 수 없습니다.',
          errorCode: 'NO_DEVICE',
        };
      }

      // 첫 번째 장치에 연결 (또는 config에서 지정된 장치)
      const targetDevice = config?.deviceName
        ? devices.find(d => d.deviceName === config.deviceName)
        : devices[0];

      if (!targetDevice) {
        return {
          success: false,
          message: '지정된 프린터를 찾을 수 없습니다.',
          errorCode: 'DEVICE_NOT_FOUND',
        };
      }

      // 프린터 연결
      const result = await POSConnectPrinter.connectUSB(
        targetDevice.devicePath
      );
      this.isConnectionActive = result.success;
      if (result.success) {
        this.connectedDevice = targetDevice.devicePath;
      }

      return {
        success: result.success,
        message: result.success
          ? `프린터 연결 성공: ${targetDevice.deviceName}`
          : result.message || '프린터 연결 실패',
        errorCode: result.errorCode,
      };
    } catch (error) {
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
      const result = await POSConnectPrinter.disconnect();
      this.isConnectionActive = false;
      this.connectedDevice = null;

      return {
        success: result.success,
        message: result.success
          ? '프린터 연결 해제 성공'
          : result.message || '프린터 연결 해제 실패',
        errorCode: result.errorCode,
      };
    } catch (error) {
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
      const printResult = await POSConnectPrinter.printText(receiptText);
      if (!printResult.success) {
        return {
          success: false,
          message: printResult.message || '영수증 출력 실패',
          errorCode: printResult.errorCode,
        };
      }

      // 용지 커팅
      await POSConnectPrinter.cutPaper();

      return {
        success: true,
        message: '영수증 출력 완료',
      };
    } catch (error) {
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
      const printResult = await POSConnectPrinter.printText(inspectionText);
      if (!printResult.success) {
        return {
          success: false,
          message: printResult.message || '시재 점검 영수증 출력 실패',
          errorCode: printResult.errorCode,
        };
      }

      // 용지 커팅
      await POSConnectPrinter.cutPaper();

      return {
        success: true,
        message: '시재 점검 영수증 출력 완료',
      };
    } catch (error) {
      return {
        success: false,
        message: '시재 점검 영수증 출력 중 오류가 발생했습니다.',
        errorCode: 'PRINT_ERROR',
      };
    }
  }

  /**
   * 영수증 텍스트 포맷팅
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
    lines.push(`수령번호: ${data.header.receiptNumber}`);
    if (data.footer?.message) {
      lines.push(`주문방식: ${data.footer.message}`);
    }
    lines.push(`일시: ${data.header.dateTime}`);
    lines.push('--------------------------------');
    lines.push('');

    // 상품 목록
    lines.push('상품명         수량  단가    금액');
    lines.push('--------------------------------');

    data.items.forEach(item => {
      const nameLength = 12;
      const truncatedName =
        item.name.length > nameLength
          ? item.name.substring(0, nameLength - 1) + '~'
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

      // 상품 간 공백
      lines.push('');
    });

    lines.push('--------------------------------');
    lines.push('');

    // 합계
    if (data.summary.discount && data.summary.discount > 0) {
      lines.push(
        `할인:               -${data.summary.discount.toLocaleString()}원`
      );
    }

    if (data.summary.tax && data.summary.tax > 0) {
      lines.push(`세금:                ${data.summary.tax.toLocaleString()}원`);
    }

    lines.push('================================');
    lines.push(`합계:                ${data.summary.total.toLocaleString()}원`);
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
    lines.push('');
    lines.push('');
    lines.push('     감사합니다. 또 오세요!     ');
    lines.push('');
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * 시재 점검 영수증 텍스트 포맷팅
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

  /**
   * 일일 정산 영수증 출력
   * - 매출 현황, 시재 현황을 포함한 정산 보고서 출력
   */
  async printDailySettlement(
    data: DailySettlementReceiptData
  ): Promise<PrintResult> {
    try {
      // 연결 상태 확인
      if (!this.isConnectionActive) {
        const connectResult = await this.connect();
        if (!connectResult.success) {
          return connectResult;
        }
      }

      // 영수증 텍스트 생성
      const receiptText = this.formatDailySettlement(data);

      // 프린터로 출력
      const printResult = await POSConnectPrinter.printText(receiptText);
      if (!printResult.success) {
        return {
          success: false,
          message: printResult.message || '일일 정산 영수증 출력 실패',
          errorCode: printResult.errorCode,
        };
      }

      // 용지 커팅
      await POSConnectPrinter.cutPaper();

      return {
        success: true,
        message: '일일 정산 영수증 출력 완료',
      };
    } catch (error: any) {
      return {
        success: false,
        message: `출력 실패: ${error.message}`,
        errorCode: 'PRINT_FAILED',
      };
    }
  }

  /**
   * 일일 정산 영수증 포맷팅
   */
  private formatDailySettlement(data: DailySettlementReceiptData): string {
    const lines: string[] = [];

    // 헤더
    lines.push('================================');
    lines.push(`         ${data.header.storeName}         `);
    lines.push('================================');
    lines.push(`         ${data.header.title}         `);
    lines.push(`정산일시: ${data.header.dateTime}`);
    lines.push('================================');
    lines.push('');

    // 매출 현황
    lines.push('[매출 현황]');
    lines.push('--------------------------------');
    lines.push(`총 매출:          ${data.sales.totalSales.toLocaleString()}원`);
    lines.push(`현금 매출:        ${data.sales.cashSales.toLocaleString()}원`);
    lines.push(`카드 매출:        ${data.sales.cardSales.toLocaleString()}원`);
    lines.push('');

    // 시재 현황
    lines.push('[시재 현황]');
    lines.push('--------------------------------');
    lines.push(`초기 시재금:      ${data.cash.initialCash.toLocaleString()}원`);
    lines.push(`입금 합계:        ${data.cash.deposits.toLocaleString()}원`);
    lines.push(`출금 합계:        ${data.cash.withdrawals.toLocaleString()}원`);
    lines.push(
      `예상 시재금:      ${data.cash.expectedCash.toLocaleString()}원`
    );
    lines.push(`실제 시재금:      ${data.cash.actualCash.toLocaleString()}원`);
    lines.push(`차액:             ${data.cash.difference.toLocaleString()}원`);
    lines.push('');

    // 권종별 현황
    lines.push('[권종별 현황]');
    lines.push('--------------------------------');
    lines.push('권종               수량      금액');
    lines.push('--------------------------------');

    data.cashBreakdown.forEach(item => {
      const denomination = item.denomination.padEnd(15);
      const quantity = item.quantity.toString().padStart(4);
      const amount = item.amount.toLocaleString().padStart(9);

      lines.push(`${denomination} ${quantity} ${amount}원`);
    });

    lines.push('================================');
    lines.push(`정산자: ${data.summary.inspector}`);
    lines.push('');
    lines.push('     일일 정산이 완료되었습니다     ');
    lines.push('');
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }
}
