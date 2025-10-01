/**
 * 프린터 관련 타입 정의
 * - Sewoo SLK-TS100 모델용 타입 정의
 * - ESC/POS 명령어 기반 프린터 지원
 */

// ===== 기본 프린터 인터페이스 =====

/**
 * 프린터 서비스 기본 인터페이스 (DIP: 의존성 역전 원칙)
 */
export interface PrinterService {
  // 연결 관련
  connect(): Promise<PrintResult>;
  disconnect(): Promise<PrintResult>;
  isConnected(): Promise<boolean>;
  
  // 출력 관련
  printOrderReceipt(data: OrderReceiptData): Promise<PrintResult>;
  printCashInspection(data: CashInspectionReceiptData): Promise<PrintResult>;
  
  // 테스트 관련
  printTest(): Promise<PrintResult>;
}

/**
 * 프린터 출력 결과
 */
export interface PrintResult {
  success: boolean;
  message?: string;
  error?: string;
}

// ===== 영수증 데이터 타입들 =====

/**
 * 영수증 헤더 정보
 */
export interface ReceiptHeader {
  storeName: string;
  title: string;
  dateTime: string;
  transactionId?: string;
}

/**
 * 영수증 요약 정보
 */
export interface ReceiptSummary {
  totalAmount: number;
  inspector?: string;
  paymentMethod?: string;
}

/**
 * 주문 영수증 데이터
 */
export interface OrderReceiptData {
  header: ReceiptHeader;
  orderItems: Array<{
    name: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    options?: string[];
    discount?: {
      name: string;
      amount: number;
    };
  }>;
  summary: ReceiptSummary & {
    subtotal: number;
    discountAmount: number;
    finalAmount: number;
  };
  footer?: {
    pickupNumber?: string;
    orderMethod?: string;
    notes?: string;
  };
}

/**
 * 현금 점검 영수증 데이터
 */
export interface CashInspectionReceiptData {
  header: ReceiptHeader;
  cashData: Array<{
    denomination: string; // "50,000원", "10,000원" 등
    quantity: number;
    amount: number;
  }>;
  summary: ReceiptSummary;
}

// ===== 프린터 설정 관련 =====

/**
 * 프린터 연결 설정
 */
export interface PrinterConfig {
  // USB 설정
  vendorId?: number;
  productId?: number;
  
  // 출력 설정
  paperWidth: number; // 기본값: 80 (mm)
  fontSize: 'small' | 'medium' | 'large';
  alignment: 'left' | 'center' | 'right';
  
  // Sewoo SLK-TS100 기본 설정
  dpi: number; // 기본값: 203
  printSpeed: number; // 기본값: 220 (mm/s)
}

/**
 * ESC/POS 명령어 타입
 */
export interface ESCPOSCommand {
  // 텍스트 포맷
  bold: boolean;
  underline: boolean;
  fontSize: 1 | 2 | 3;
  alignment: 'left' | 'center' | 'right';
  
  // 명령어
  command: string;
  data?: string;
}

// ===== 프린터 상태 관련 =====

/**
 * 프린터 상태
 */
export interface PrinterStatus {
  connected: boolean;
  paperStatus: 'ok' | 'low' | 'empty';
  printerStatus: 'ready' | 'busy' | 'error';
  temperature: 'normal' | 'high';
  error?: string;
}

/**
 * 프린터 에러 타입
 */
export enum PrinterError {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  PAPER_EMPTY = 'PAPER_EMPTY',
  PRINTER_BUSY = 'PRINTER_BUSY',
  INVALID_DATA = 'INVALID_DATA',
  USB_PERMISSION_DENIED = 'USB_PERMISSION_DENIED',
  PRINTER_OFFLINE = 'PRINTER_OFFLINE',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// ===== 유틸리티 타입들 =====

/**
 * 프린터 정보
 */
export interface PrinterInfo {
  name: string;
  model: string; // 'SLK-TS100'
  manufacturer: string; // 'Sewoo'
  connectionType: 'usb' | 'bluetooth' | 'wifi';
  vendorId?: number;
  productId?: number;
}

/**
 * 프린터 연결 옵션
 */
export interface ConnectionOptions {
  timeout?: number; // 연결 타임아웃 (ms)
  retryCount?: number; // 재시도 횟수
  autoReconnect?: boolean; // 자동 재연결
}

export default {};