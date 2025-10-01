/**
 * 프린터 관련 커스텀 훅
 * - SRP (단일 책임 원칙): 프린터 상태 관리만 담당
 * - 프린터 연결, 출력, 상태 관리 기능 제공
 */

import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import {
  CashInspectionReceiptData,
  OrderReceiptData,
  PrinterService,
  PrinterStatus,
  PrintResult,
} from '../types';
import { createPrinterService } from '../utils';

/**
 * 프린터 훅 상태
 */
interface PrinterHookState {
  isConnected: boolean;
  isConnecting: boolean;
  isPrinting: boolean;
  printerStatus: PrinterStatus | null;
  lastError: string | null;
}

/**
 * 프린터 훅 반환 타입
 */
interface UsePrinterReturn extends PrinterHookState {
  // 연결 관련
  connectPrinter: () => Promise<boolean>;
  disconnectPrinter: () => Promise<boolean>;
  
  // 출력 관련
  printOrderReceipt: (data: OrderReceiptData) => Promise<boolean>;
  printCashInspection: (data: CashInspectionReceiptData) => Promise<boolean>;
  printTest: () => Promise<boolean>;
  
  // 상태 관리
  refreshStatus: () => Promise<void>;
  clearError: () => void;
}

/**
 * 프린터 커스텀 훅
 * - 프린터 연결 상태 관리
 * - 출력 기능 제공
 * - 에러 처리
 */
export const usePrinter = (): UsePrinterReturn => {
  // 상태 관리
  const [state, setState] = useState<PrinterHookState>({
    isConnected: false,
    isConnecting: false,
    isPrinting: false,
    printerStatus: null,
    lastError: null,
  });

  // 프린터 서비스 인스턴스 (싱글톤 패턴)
  const [printerService] = useState<PrinterService>(() => createPrinterService());

  // ===== 연결 관련 함수들 =====

  /**
   * 프린터 연결 함수 (SRP: 연결만 담당)
   */
  const connectPrinter = useCallback(async (): Promise<boolean> => {
    setState(prev => ({ 
      ...prev, 
      isConnecting: true, 
      lastError: null 
    }));

    try {
      const result = await printerService.connect();
      
      if (result.success) {
        setState(prev => ({ 
          ...prev, 
          isConnected: true,
          isConnecting: false 
        }));
        
        // 연결 후 상태 확인
        await refreshStatus();
        
        return true;
      } else {
        setState(prev => ({ 
          ...prev, 
          isConnecting: false,
          lastError: result.message || '연결 실패' 
        }));
        
        return false;
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isConnecting: false,
        lastError: `연결 중 오류 발생: ${error}` 
      }));
      
      return false;
    }
  }, [printerService]);

  /**
   * 프린터 연결 해제
   */
  const disconnectPrinter = useCallback(async (): Promise<boolean> => {
    try {
      const result = await printerService.disconnect();
      
      setState(prev => ({ 
        ...prev, 
        isConnected: false,
        printerStatus: null,
        lastError: result.success ? null : result.message || '연결 해제 실패'
      }));
      
      return result.success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        lastError: `연결 해제 중 오류: ${error}` 
      }));
      
      return false;
    }
  }, [printerService]);

  // ===== 출력 관련 함수들 =====

  /**
   * 주문 영수증 출력 (SRP: 주문 영수증 출력만 담당)
   */
  const printOrderReceipt = useCallback(async (data: OrderReceiptData): Promise<boolean> => {
    // 연결 상태 확인
    if (!state.isConnected) {
      setState(prev => ({ 
        ...prev, 
        lastError: '프린터가 연결되지 않았습니다.' 
      }));
      return false;
    }

    setState(prev => ({ 
      ...prev, 
      isPrinting: true, 
      lastError: null 
    }));

    try {
      const result = await printerService.printOrderReceipt(data);
      
      setState(prev => ({ 
        ...prev, 
        isPrinting: false,
        lastError: result.success ? null : result.message || '출력 실패'
      }));
      
      return result.success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isPrinting: false,
        lastError: `출력 중 오류 발생: ${error}` 
      }));
      
      return false;
    }
  }, [state.isConnected, printerService]);

  /**
   * 현금 점검 영수증 출력
   */
  const printCashInspection = useCallback(async (data: CashInspectionReceiptData): Promise<boolean> => {
    // 연결 상태 확인
    if (!state.isConnected) {
      setState(prev => ({ 
        ...prev, 
        lastError: '프린터가 연결되지 않았습니다.' 
      }));
      return false;
    }

    setState(prev => ({ 
      ...prev, 
      isPrinting: true, 
      lastError: null 
    }));

    try {
      const result = await printerService.printCashInspection(data);
      
      setState(prev => ({ 
        ...prev, 
        isPrinting: false,
        lastError: result.success ? null : result.message || '출력 실패'
      }));
      
      return result.success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isPrinting: false,
        lastError: `출력 중 오류 발생: ${error}` 
      }));
      
      return false;
    }
  }, [state.isConnected, printerService]);

  /**
   * 테스트 출력
   */
  const printTest = useCallback(async (): Promise<boolean> => {
    // 연결 상태 확인
    if (!state.isConnected) {
      // 연결되지 않았으면 자동으로 연결 시도
      const connected = await connectPrinter();
      if (!connected) {
        return false;
      }
    }

    setState(prev => ({ 
      ...prev, 
      isPrinting: true, 
      lastError: null 
    }));

    try {
      const result = await printerService.printTest();
      
      setState(prev => ({ 
        ...prev, 
        isPrinting: false,
        lastError: result.success ? null : result.message || '테스트 출력 실패'
      }));
      
      return result.success;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        isPrinting: false,
        lastError: `테스트 출력 중 오류: ${error}` 
      }));
      
      return false;
    }
  }, [state.isConnected, connectPrinter, printerService]);

  // ===== 상태 관리 함수들 =====

  /**
   * 프린터 상태 새로고침
   */
  const refreshStatus = useCallback(async (): Promise<void> => {
    try {
      // 연결 상태 확인
      const isConnected = await printerService.isConnected();
      
      // 프린터 상태 확인 (지원하는 경우)
      let printerStatus: PrinterStatus | null = null;
      if ('getPrinterStatus' in printerService) {
        printerStatus = await (printerService as any).getPrinterStatus();
      }

      setState(prev => ({ 
        ...prev, 
        isConnected,
        printerStatus,
        lastError: null
      }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        lastError: `상태 확인 중 오류: ${error}` 
      }));
    }
  }, [printerService]);

  /**
   * 에러 메시지 초기화
   */
  const clearError = useCallback((): void => {
    setState(prev => ({ 
      ...prev, 
      lastError: null 
    }));
  }, []);

  // ===== 초기화 효과 =====

  useEffect(() => {
    // 컴포넌트 마운트 시 초기 상태 확인
    refreshStatus();

    // 컴포넌트 언마운트 시 정리
    return () => {
      disconnectPrinter();
    };
  }, [refreshStatus, disconnectPrinter]);

  return {
    // 상태
    ...state,
    
    // 연결 관련
    connectPrinter,
    disconnectPrinter,
    
    // 출력 관련
    printOrderReceipt,
    printCashInspection,
    printTest,
    
    // 상태 관리
    refreshStatus,
    clearError,
  };
};

/**
 * 프린터 연결 상태를 확인하는 간단한 훅
 */
export const usePrinterStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  
  const checkStatus = useCallback(async () => {
    setIsChecking(true);
    try {
      const printerService = createPrinterService();
      const connected = await printerService.isConnected();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  return { isConnected, isChecking, checkStatus };
};