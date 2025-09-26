/**
 * 환경변수 유틸리티 함수
 */

import {
  API_BASE_URL,
  API_TIMEOUT,
  APP_ENV,
  APP_NAME,
  APP_VERSION,
  DEBUG_MODE,
  EAS_PROJECT_ID,
  SHOW_DEV_TOOLS,
} from '@env';

/**
 * EAS 프로젝트 설정
 */
export const easConfig = {
  projectId: EAS_PROJECT_ID,
} as const;

/**
 * 앱 설정
 */
export const appConfig = {
  name: APP_NAME || 'mcPos',
  version: APP_VERSION || '1.0.0',
  env: APP_ENV || 'development',
  isDevelopment: APP_ENV === 'development',
  isProduction: APP_ENV === 'production',
} as const;

/**
 * API 설정
 */
export const apiConfig = {
  baseUrl: API_BASE_URL || 'http://localhost:3000',
  timeout: parseInt(API_TIMEOUT || '10000', 10),
} as const;

/**
 * 개발자 설정
 */
export const devConfig = {
  debugMode: DEBUG_MODE === 'true',
  showDevTools: SHOW_DEV_TOOLS === 'true',
} as const;

/**
 * 모든 설정을 하나의 객체로 반환
 */
export const config = {
  eas: easConfig,
  app: appConfig,
  api: apiConfig,
  dev: devConfig,
} as const;
