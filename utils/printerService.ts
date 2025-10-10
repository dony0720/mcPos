/**
 * 프린터 서비스 구현
 * - SOLID 원칙에 따른 프린터 서비스 인터페이스 구현
 * - DIP: 추상화에 의존하여 테스트 가능하고 확장 가능한 구조
 */

import { PrinterService } from '../types';
import { POSConnectPrinterService } from './POSConnectPrinterService';

/**
 * 프린터 서비스 팩토리
 * - DIP: 구체적 구현체가 아닌 추상화에 의존
 * - 환경에 따라 적절한 서비스 인스턴스 제공
 */
export const createPrinterService = (): PrinterService => {
  return new POSConnectPrinterService();
};
