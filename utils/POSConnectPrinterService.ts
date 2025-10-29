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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
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
    } catch {
      return {
        success: false,
        message: '시재 점검 영수증 출력 중 오류가 발생했습니다.',
        errorCode: 'PRINT_ERROR',
      };
    }
  }

  /**
   * 문자열의 실제 표시 폭 계산 (한글=2, 영문/숫자=1)
   */
  private getDisplayWidth(str: string): number {
    let width = 0;
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      // 한글, 한자 등 2바이트 문자
      if (code > 0x7f && code < 0xffff) {
        width += 2;
      } else {
        width += 1;
      }
    }
    return width;
  }

  /**
   * 지정된 표시 폭에 맞춰 문자열 패딩 (왼쪽 정렬)
   */
  private padToWidth(str: string, targetWidth: number): string {
    const currentWidth = this.getDisplayWidth(str);
    if (currentWidth >= targetWidth) {
      // 너무 긴 경우 자르기
      let result = '';
      let width = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const charWidth = str.charCodeAt(i) > 0x7f ? 2 : 1;
        if (width + charWidth > targetWidth - 1) {
          result += '~';
          break;
        }
        result += char;
        width += charWidth;
      }
      return (
        result +
        ' '.repeat(Math.max(0, targetWidth - this.getDisplayWidth(result)))
      );
    }
    return str + ' '.repeat(targetWidth - currentWidth);
  }

  /**
   * 지정된 표시 폭에 맞춰 문자열 패딩 (오른쪽 정렬)
   */
  private padToWidthRight(str: string, targetWidth: number): string {
    const currentWidth = this.getDisplayWidth(str);
    if (currentWidth > targetWidth) {
      return str.substring(str.length - targetWidth);
    }
    return ' '.repeat(targetWidth - currentWidth) + str;
  }

  /**
   * 영수증 텍스트 포맷팅
   */
  private formatReceiptText(data: ReceiptData): string {
    const lines: string[] = [];
    const WIDTH = 40; // 영수증 너비

    // 헤더 (중앙 정렬)
    lines.push('========================================');
    lines.push(this.centerText(data.header.storeName, WIDTH));
    if (data.header.storeAddress) {
      lines.push(this.centerText(data.header.storeAddress, WIDTH));
    }
    if (data.header.storePhone) {
      lines.push(this.centerText(data.header.storePhone, WIDTH));
    }
    lines.push('========================================');

    // 수령번호, 주문방식, 일시 (왼쪽 정렬)
    lines.push(`수령번호: ${data.header.receiptNumber}`);
    if (data.footer?.message) {
      lines.push(`주문방식: ${data.footer.message}`);
    }
    lines.push(`일시: ${data.header.dateTime}`);
    lines.push('----------------------------------------');
    lines.push('');

    // 각 컬럼의 표시 폭 (한글=2칸, 영문=1칸 기준)
    // 총 폭: 16 + 4 + 8 + 9 + 3(공백) = 40
    const nameWidth = 16; // 상품명
    const quantityWidth = 4; // 수량
    const unitPriceWidth = 8; // 단가
    const totalPriceWidth = 9; // 금액

    // 상품 목록 헤더 (데이터와 동일한 폭으로 정렬)
    const headerName = this.padToWidth('상품명', nameWidth);
    const headerQuantity = this.padToWidthRight('수량', quantityWidth);
    const headerUnitPrice = this.padToWidthRight('단가', unitPriceWidth);
    const headerTotalPrice = this.padToWidthRight('금액', totalPriceWidth);
    lines.push(
      `${headerName} ${headerQuantity} ${headerUnitPrice} ${headerTotalPrice}`
    );
    lines.push('----------------------------------------');

    data.items.forEach(item => {
      // 상품명 (왼쪽 정렬)
      const name = this.padToWidth(item.name, nameWidth);

      // 수량 (오른쪽 정렬)
      const quantity = this.padToWidthRight(
        item.quantity.toString(),
        quantityWidth
      );

      // 단가 (오른쪽 정렬)
      const unitPrice = this.padToWidthRight(
        item.unitPrice.toLocaleString(),
        unitPriceWidth
      );

      // 금액 (오른쪽 정렬)
      const totalPrice = this.padToWidthRight(
        item.totalPrice.toLocaleString(),
        totalPriceWidth
      );

      lines.push(`${name} ${quantity} ${unitPrice} ${totalPrice}`);

      // 옵션 표시
      if (item.options && item.options.length > 0) {
        item.options.forEach(option => {
          lines.push(`  └ ${option}`);
        });
      }

      // 상품 간 공백
      lines.push('');
    });

    lines.push('----------------------------------------');

    // 총 잔 수를 영수증에 추가
    const totalItems = data.items.reduce((sum, item) => sum + item.quantity, 0);
    lines.push(`총 ${totalItems} 잔`);
    lines.push('========================================');

    // 합계 (오른쪽 정렬)
    if (data.summary.discount && data.summary.discount > 0) {
      const discountText = `할인`;
      const discountAmount = `-${data.summary.discount.toLocaleString()}원`;
      lines.push(this.rightAlignAmount(discountText, discountAmount, WIDTH));
    }

    lines.push('========================================');
    const totalText = `합계`;
    const totalAmount = `${data.summary.total.toLocaleString()}원`;
    lines.push(this.rightAlignAmount(totalText, totalAmount, WIDTH));

    const paymentText = `결제방법`;
    lines.push(`${paymentText}: ${data.summary.paymentMethod}`);

    if (data.summary.couponAmount && data.summary.couponAmount > 0) {
      const couponText = `쿠폰금액`;
      const couponAmount = `${data.summary.couponAmount.toLocaleString()}원`;
      lines.push(this.rightAlignAmount(couponText, couponAmount, WIDTH));
    }

    if (data.summary.receivedAmount) {
      const receivedText = `받은금액`;
      const receivedAmount = `${data.summary.receivedAmount.toLocaleString()}원`;
      lines.push(this.rightAlignAmount(receivedText, receivedAmount, WIDTH));
    }

    if (data.summary.changeAmount) {
      const changeText = `거스름돈`;
      const changeAmount = `${data.summary.changeAmount.toLocaleString()}원`;
      lines.push(this.rightAlignAmount(changeText, changeAmount, WIDTH));
    }

    lines.push('========================================');
    lines.push('');
    lines.push(this.centerText('감사합니다. 또 오세요!', WIDTH));
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }

  /**
   * 텍스트 중앙 정렬
   */
  private centerText(text: string, width: number): string {
    const textLength = this.getTextWidth(text);
    const padding = Math.max(0, Math.floor((width - textLength) / 2));
    return ' '.repeat(padding) + text;
  }

  /**
   * 금액 오른쪽 정렬 (레이블: 금액 형식)
   */
  private rightAlignAmount(
    label: string,
    amount: string,
    width: number
  ): string {
    const combined = `${label}: ${amount}`;
    const combinedLength = this.getTextWidth(combined);
    const padding = Math.max(0, width - combinedLength);
    return ' '.repeat(padding) + combined;
  }

  /**
   * 텍스트 너비 계산 (한글 2바이트, 영문/숫자 1바이트)
   */
  private getTextWidth(text: string): number {
    let width = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      // 한글, 한자 등 2바이트 문자
      if (
        char.match(/[\u3131-\u314e\u314f-\u3163\uac00-\ud7a3\u4e00-\u9fa5]/)
      ) {
        width += 2;
      } else {
        width += 1;
      }
    }
    return width;
  }

  /**
   * 시재 점검 영수증 텍스트 포맷팅
   */
  private formatCashInspectionText(data: CashInspectionReceiptData): string {
    const lines: string[] = [];
    const WIDTH = 40; // 영수증 너비

    // 헤더 (중앙 정렬)
    lines.push('========================================');
    lines.push(this.centerText(data.header.storeName, WIDTH));
    lines.push('========================================');
    lines.push(this.centerText(data.header.title, WIDTH));
    lines.push(this.centerText(`일시: ${data.header.dateTime}`, WIDTH));
    lines.push('----------------------------------------');

    // 시재 내역
    lines.push('권종                   수량        금액');
    lines.push('----------------------------------------');

    data.cashData.forEach(item => {
      const denomination = item.denomination.padEnd(18);
      const quantity = item.quantity.toString().padStart(5);
      const amount = item.amount.toLocaleString().padStart(10);

      lines.push(`${denomination} ${quantity} ${amount}원`);
    });

    lines.push('----------------------------------------');
    lines.push(
      `총 시재 금액:           ${data.summary.totalAmount.toLocaleString()}원`
    );
    lines.push('========================================');
    lines.push(`점검자: ${data.summary.inspector}`);
    lines.push('');
    lines.push(this.centerText('시재 점검이 완료되었습니다', WIDTH));
    lines.push('');
    lines.push('');
    lines.push('');
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
    const WIDTH = 40; // 영수증 너비

    // 헤더 (중앙 정렬)
    lines.push('========================================');
    lines.push(this.centerText(data.header.storeName, WIDTH));
    lines.push('========================================');
    lines.push(this.centerText(data.header.title, WIDTH));
    lines.push(this.centerText(`정산일시: ${data.header.dateTime}`, WIDTH));
    lines.push('========================================');
    lines.push('');

    // 매출 현황
    lines.push('[매출 현황]');
    lines.push('----------------------------------------');
    lines.push(
      `총 매출:              ${data.sales.totalSales.toLocaleString()}원`
    );
    lines.push(
      `현금 매출:            ${data.sales.cashSales.toLocaleString()}원`
    );
    lines.push(
      `카드 매출:            ${data.sales.cardSales.toLocaleString()}원`
    );
    lines.push('');

    // 시재 현황
    lines.push('[시재 현황]');
    lines.push('----------------------------------------');
    lines.push(
      `초기 시재금:          ${data.cash.initialCash.toLocaleString()}원`
    );
    lines.push(
      `입금 합계:            ${data.cash.deposits.toLocaleString()}원`
    );
    lines.push(
      `출금 합계:            ${data.cash.withdrawals.toLocaleString()}원`
    );
    lines.push(
      `예상 시재금:          ${data.cash.expectedCash.toLocaleString()}원`
    );
    lines.push(
      `실제 시재금:          ${data.cash.actualCash.toLocaleString()}원`
    );
    lines.push(
      `차액:                 ${data.cash.difference.toLocaleString()}원`
    );
    lines.push('');

    // 초기 권종별 내역
    if (data.initialCashBreakdown && data.initialCashBreakdown.length > 0) {
      lines.push('[초기 권종별 내역]');
      lines.push('----------------------------------------');
      lines.push('권종                   수량        금액');
      lines.push('----------------------------------------');

      data.initialCashBreakdown.forEach(item => {
        const denomination = item.denomination.padEnd(18);
        const quantity = item.quantity.toString().padStart(5);
        const amount = item.amount.toLocaleString().padStart(10);

        lines.push(`${denomination} ${quantity} ${amount}원`);
      });

      lines.push('');
    }

    // 마감 권종별 내역
    lines.push('[마감 권종별 내역]');
    lines.push('----------------------------------------');
    lines.push('권종                   수량        금액');
    lines.push('----------------------------------------');

    data.cashBreakdown.forEach(item => {
      const denomination = item.denomination.padEnd(18);
      const quantity = item.quantity.toString().padStart(5);
      const amount = item.amount.toLocaleString().padStart(10);

      lines.push(`${denomination} ${quantity} ${amount}원`);
    });

    lines.push('========================================');
    lines.push(`정산자: ${data.summary.inspector}`);
    lines.push('');
    lines.push(this.centerText('일일 정산이 완료되었습니다', WIDTH));
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('');
    lines.push('');

    return lines.join('\n');
  }
}
