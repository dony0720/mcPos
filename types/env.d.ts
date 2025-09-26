/**
 * 환경변수 타입 정의
 */

declare module '@env' {
  // EAS 프로젝트 설정
  export const EAS_PROJECT_ID: string;

  // 앱 설정
  export const APP_NAME: string;
  export const APP_VERSION: string;
  export const APP_ENV: 'development' | 'staging' | 'production';

  // API 설정
  export const API_BASE_URL: string;
  export const API_TIMEOUT: string;

  // 개발자 설정
  export const DEBUG_MODE: string;
  export const SHOW_DEV_TOOLS: string;
}
