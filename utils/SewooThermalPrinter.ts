/**
 * Sewoo SLK-TS100 열전사 프린터 서비스 구현
 * - ESC/POS 명령어 기반
 * - USB OTG 연결 방식
 * - SOLID 원칙 준수: DIP (의존성 역전 원칙)
 */

import {
  CashInspectionReceiptData,
  OrderReceiptData,
  PrinterConfig,
  PrinterInfo,
  PrinterService,
  PrinterStatus,
  PrintResult,
  ConnectionOptions,
  PrinterError,
  ESCPOSCommand,
} from '../types';

/**
 * Sewoo SLK-TS100 프린터 구현체
 * - ESC/POS 명령어로 프린터 제어
 * - USB 통신 처리
 */
export class SewooThermalPrinter implements PrinterService {
  private isConnectedState = false;
  private config: PrinterConfig;
  private printerDevice: any = null; // 실제 USB 디바이스 참조

  constructor(config?: Partial<PrinterConfig>) {
    this.config = {
      vendorId: 0x1A00, // Sewoo 기본 Vendor ID (실제 값 확인 필요)
      productId: 0x0001, // SLK-TS100 Product ID (실제 값 확인 필요)
      paperWidth: 80,
      fontSize: 'medium',
      alignment: 'left',
      dpi: 203,
      printSpeed: 220,
      ...config,
    };
  }

  // ===== 연결 관련 메서드 =====

  /**
   * 프린터 연결 (SRP: 단일 책임 원칙)
   */
  async connect(options?: ConnectionOptions): Promise<PrintResult> {
    try {
      // TODO: 실제 USB 프린터 연결 로직 구현
      // React Native USB 라이브러리 사용 예정
      
      // 1. USB 권한 요청
      const hasPermission = await this.requestUSBPermission();
      if (!hasPermission) {
        return {
          success: false,
          error: PrinterError.USB_PERMISSION_DENIED,
          message: 'USB 권한이 거부되었습니다.',
        };
      }

      // 2. 프린터 기기 찾기
      const device = await this.findPrinterDevice();
      if (!device) {
        return {
          success: false,
          error: PrinterError.CONNECTION_FAILED,
          message: 'Sewoo SLK-TS100 프린터를 찾을 수 없습니다.',
        };
      }

      // 3. 프린터 연결
      this.printerDevice = device;
      this.isConnectedState = true;

      // 4. 초기화 명령어 전송
      await this.sendInitializeCommand();

      return {
        success: true,
        message: '프린터 연결이 성공했습니다.',
      };

    } catch (error) {
      return {
        success: false,
        error: PrinterError.CONNECTION_FAILED,
        message: `연결 실패: ${error}`,
      };
    }
  }

  /**
   * 프린터 연결 해제
   */
  async disconnect(): Promise<PrintResult> {
    try {
      if (this.printerDevice) {
        // TODO: 실제 연결 해제 로직 구현
        this.printerDevice = null;
      }
      
      this.isConnectedState = false;

      return {
        success: true,
        message: '프린터 연결이 해제되었습니다.',
      };

    } catch (error) {
      return {
        success: false,
        error: PrinterError.UNKNOWN_ERROR,
        message: `연결 해제 실패: ${error}`,
      };
    }
  }

  /**
   * 연결 상태 확인
   */
  async isConnected(): Promise<boolean> {
    return this.isConnectedState && this.printerDevice !== null;
  }

  // ===== 출력 관련 메서드 =====

  /**
   * 주문 영수증 출력 (SRP: 단일 책임 원칙)
   */
  async printOrderReceipt(data: OrderReceiptData): Promise<PrintResult> {
    try {
      if (!(await this.isConnected())) {
        return {
          success: false,
          error: PrinterError.PRINTER_OFFLINE,
          message: '프린터가 연결되지 않았습니다.',
        };
      }

      // ESC/POS 명령어 생성
      const commands = this.generateOrderReceiptCommands(data);
      
      // 프린터로 전송
      const result = await this.sendCommands(commands);
      
      return result;

    } catch (error) {
      return {
        success: false,
        error: PrinterError.UNKNOWN_ERROR,
        message: `주문 영수증 출력 실패: ${error}`,
      };
    }
  }

  /**
   * 현금 점검 영수증 출력
   */
  async printCashInspection(data: CashInspectionReceiptData): Promise<PrintResult> {
    try {
      if (!(await this.isConnected())) {
        return {
          success: false,
          error: PrinterError.PRINTER_OFFLINE,
          message: '프린터가 연결되지 않았습니다.',
        };
      }

      // ESC/POS 명령어 생성
      const commands = this.generateCashInspectionCommands(data);
      
      // 프린터로 전송
      const result = await this.sendCommands(commands);
      
      return result;

    } catch (error) {
      return {
        success: false,
        error: PrinterError.UNKNOWN_ERROR,
        message: `현금 점검 영수증 출력 실패: ${error}`,
      };
    }
  }

  /**
   * 테스트 출력
   */
  async printTest(): Promise<PrintResult> {
    const testData: OrderReceiptData = {
      header: {
        storeName: 'MC POS 테스트',
        title: '테스트 영수증',
        dateTime: new Date().toLocaleString('ko-KR'),
      },
      orderItems: [
        {
          name: '아메리카노',
          quantity: 1,
          unitPrice: 3000,
          totalPrice: 3000,
          options: ['ICE'],
        },
      ],
      summary: {
        totalAmount: 3000,
        subtotal: 3000,
        discountAmount: 0,
        finalAmount: 3000,
        paymentMethod: '현금',
      },
    };

    return await this.printOrderReceipt(testData);
  }

  // ===== ESC/POS 명령어 생성 메서드 =====

  /**
   * 주문 영수증용 ESC/POS 명령어 생성 (SRP: 단일 책임 원칙)
   */
  private generateOrderReceiptCommands(data: OrderReceiptData): string[] {
    const commands: string[] = [];

    // 초기화
    commands.push('\x1B\x40'); // ESC @

    // 헤더 출력
    commands.push(...this.generateHeaderCommands(data.header));
    
    // 구분선
    commands.push(this.generateSeparatorLine());

    // 주문 항목들
    for (const item of data.orderItems) {
      commands.push(...this.generateOrderItemCommands(item));
    }

    // 구분선
    commands.push(this.generateSeparatorLine());

    // 합계 정보
    commands.push(...this.generateSummaryCommands(data.summary));

    // 푸터 정보
    if (data.footer) {
      commands.push(...this.generateFooterCommands(data.footer));
    }

    // 용지 자르기 및 완료
    commands.push('\x1D\x56\x00'); // GS V 0 (전체 자르기)
    commands.push('\x1B\x64\x03'); // ESC d 3 (3줄 급지)

    return commands;
  }

  /**
   * 현금 점검 영수증용 ESC/POS 명령어 생성
   */
  private generateCashInspectionCommands(data: CashInspectionReceiptData): string[] {
    const commands: string[] = [];

    // 초기화
    commands.push('\x1B\x40'); // ESC @

    // 헤더 출력
    commands.push(...this.generateHeaderCommands(data.header));
    
    // 구분선
    commands.push(this.generateSeparatorLine());

    // 현금 내역
    for (const cash of data.cashData) {
      const line = `${cash.denomination.padEnd(12)} x${cash.quantity.toString().padStart(3)} = ${cash.amount.toLocaleString().padStart(8)}원\n`;
      commands.push(line);
    }

    // 구분선
    commands.push(this.generateSeparatorLine());

    // 합계
    commands.push(`총 합계: ${data.summary.totalAmount.toLocaleString()}원\n`);
    commands.push(`점검자: ${data.summary.inspector || '관리자'}\n`);

    // 용지 자르기 및 완료
    commands.push('\x1D\x56\x00'); // GS V 0 (전체 자르기)
    commands.push('\x1B\x64\x03'); // ESC d 3 (3줄 급지)

    return commands;
  }

  /**
   * 헤더 명령어 생성
   */
  private generateHeaderCommands(header: any): string[] {
    return [
      '\x1B\x61\x01', // 가운데 정렬
      '\x1B\x21\x10', // 크게
      `${header.storeName}\n`,
      '\x1B\x21\x00', // 기본 크기
      `${header.title}\n`,
      `${header.dateTime}\n`,
      header.transactionId ? `거래번호: ${header.transactionId}\n` : '',
      '\x1B\x61\x00', // 왼쪽 정렬
    ].filter(cmd => cmd !== '');
  }

  /**
   * 주문 항목 명령어 생성
   */
  private generateOrderItemCommands(item: any): string[] {
    const commands: string[] = [];
    
    // 메뉴명과 가격
    const mainLine = `${item.name.padEnd(20)} ${item.quantity}개 ${item.totalPrice.toLocaleString().padStart(6)}원\n`;
    commands.push(mainLine);

    // 옵션들
    if (item.options && item.options.length > 0) {
      for (const option of item.options) {
        commands.push(`  - ${option}\n`);
      }
    }

    // 할인 정보
    if (item.discount) {
      commands.push(`  할인: ${item.discount.name} -${item.discount.amount.toLocaleString()}원\n`);
    }

    return commands;
  }

  /**
   * 합계 명령어 생성
   */
  private generateSummaryCommands(summary: any): string[] {
    return [
      '\x1B\x21\x08', // 볼드
      `총 금액: ${summary.finalAmount.toLocaleString()}원\n`,
      '\x1B\x21\x00', // 기본
      `결제방법: ${summary.paymentMethod || '현금'}\n`,
    ];
  }

  /**
   * 푸터 명령어 생성
   */
  private generateFooterCommands(footer: any): string[] {
    const commands: string[] = [];
    
    if (footer.pickupNumber) {
      commands.push(`주문번호: ${footer.pickupNumber}\n`);
    }
    
    if (footer.orderMethod) {
      commands.push(`주문방식: ${footer.orderMethod}\n`);
    }

    return commands;
  }

  /**
   * 구분선 생성
   */
  private generateSeparatorLine(): string {
    return '--------------------------------\n';
  }

  // ===== USB 통신 관련 메서드 =====

  /**
   * USB 권한 요청
   */
  private async requestUSBPermission(): Promise<boolean> {
    try {
      // TODO: React Native USB 라이브러리를 사용하여 권한 요청
      // 예: UsbSerial.requestPermission() 또는 유사 메서드
      return true; // 임시로 true 반환
    } catch (error) {
      console.error('USB 권한 요청 실패:', error);
      return false;
    }
  }

  /**
   * 프린터 기기 찾기
   */
  private async findPrinterDevice(): Promise<any> {
    try {
      // TODO: USB 기기 목록에서 Sewoo 프린터 찾기
      // vendorId와 productId로 필터링
      return {}; // 임시 객체 반환
    } catch (error) {
      console.error('프린터 기기 찾기 실패:', error);
      return null;
    }
  }

  /**
   * 초기화 명령어 전송
   */
  private async sendInitializeCommand(): Promise<void> {
    const initCommand = '\x1B\x40'; // ESC @ (프린터 초기화)
    await this.sendRawData(initCommand);
  }

  /**
   * 명령어들을 프린터로 전송
   */
  private async sendCommands(commands: string[]): Promise<PrintResult> {
    try {
      for (const command of commands) {
        await this.sendRawData(command);
        // 명령어 간 짧은 지연
        await this.delay(10);
      }

      return {
        success: true,
        message: '출력이 완료되었습니다.',
      };

    } catch (error) {
      return {
        success: false,
        error: PrinterError.UNKNOWN_ERROR,
        message: `출력 실패: ${error}`,
      };
    }
  }

  /**
   * 원시 데이터를 프린터로 전송
   */
  private async sendRawData(data: string): Promise<void> {
    if (!this.printerDevice) {
      throw new Error('프린터가 연결되지 않았습니다.');
    }

    try {
      // TODO: 실제 USB 데이터 전송 구현
      // 예: await this.printerDevice.write(data);
      console.log('Sending to printer:', data);
    } catch (error) {
      throw new Error(`데이터 전송 실패: ${error}`);
    }
  }

  /**
   * 지연 함수
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ===== 상태 확인 메서드 =====

  /**
   * 프린터 상태 확인
   */
  async getPrinterStatus(): Promise<PrinterStatus> {
    return {
      connected: this.isConnectedState,
      paperStatus: 'ok', // TODO: 실제 용지 상태 확인
      printerStatus: 'ready', // TODO: 실제 프린터 상태 확인  
      temperature: 'normal', // TODO: 실제 온도 상태 확인
    };
  }

  /**
   * 프린터 정보 가져오기
   */
  getPrinterInfo(): PrinterInfo {
    return {
      name: 'Sewoo SLK-TS100',
      model: 'SLK-TS100',
      manufacturer: 'Sewoo',
      connectionType: 'usb',
      vendorId: this.config.vendorId,
      productId: this.config.productId,
    };
  }
}