/**
 * 프린터 관련 타입 정의
 * - Sewoo SLK-TS100 프린터 연동을 위한 타입들
 */

export interface PrinterConfig {
  deviceName?: string;
  baudRate?: number;
  dataBits?: number;
  stopBits?: number;
  parity?: 'none' | 'odd' | 'even';
}

export interface ReceiptData {
  header: {
    storeName: string;
    storeAddress?: string;
    storePhone?: string;
    receiptNumber: string;
    dateTime: string;
  };
  items: ReceiptItem[];
  summary: {
    subtotal: number;
    discount?: number;
    tax?: number;
    total: number;
    paymentMethod: string;
    receivedAmount?: number;
    changeAmount?: number;
  };
  footer?: {
    message?: string;
    barcode?: string;
  };
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  options?: string[];
}

export interface CashInspectionReceiptData {
  header: {
    storeName: string;
    title: string;
    dateTime: string;
  };
  cashData: Array<{
    denomination: string;
    quantity: number;
    amount: number;
  }>;
  summary: {
    totalAmount: number;
    inspector: string;
  };
}

export interface DailySettlementReceiptData {
  header: {
    storeName: string;
    title: string;
    dateTime: string;
  };
  sales: {
    totalSales: number;
    cashSales: number;
    cardSales: number;
  };
  cash: {
    initialCash: number;
    deposits: number;
    withdrawals: number;
    expectedCash: number;
    actualCash: number;
    difference: number;
  };
  initialCashBreakdown?: Array<{
    denomination: string;
    quantity: number;
    amount: number;
  }>;
  cashBreakdown: Array<{
    denomination: string;
    quantity: number;
    amount: number;
  }>;
  summary: {
    inspector: string;
  };
}

export interface PrintResult {
  success: boolean;
  message?: string;
  errorCode?: string;
}

export interface PrinterService {
  /**
   * 프린터 연결 상태 확인
   */
  isConnected(): Promise<boolean>;

  /**
   * 프린터 연결
   */
  connect(config?: PrinterConfig): Promise<PrintResult>;

  /**
   * 프린터 연결 해제
   */
  disconnect(): Promise<PrintResult>;

  /**
   * 영수증 출력
   */
  printReceipt(receiptData: ReceiptData): Promise<PrintResult>;

  /**
   * 시재 점검 영수증 출력
   */
  printCashInspection(
    inspectionData: CashInspectionReceiptData
  ): Promise<PrintResult>;

  /**
   * 일일 정산 영수증 출력
   */
  printDailySettlement(
    settlementData: DailySettlementReceiptData
  ): Promise<PrintResult>;
}
