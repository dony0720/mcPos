import { REGEX_PATTERNS } from '../constants';

/**
 * 가격 관련 포맷팅 유틸리티 함수들
 */

/**
 * 숫자를 천 단위 콤마가 포함된 문자열로 포맷팅
 * @param value - 포맷팅할 숫자
 * @returns 콤마가 포함된 문자열 (예: 5000 → "5,000")
 */
export const formatPrice = (value: number | null | undefined): string => {
  if (value === null || value === undefined) return '';
  return value.toLocaleString();
};

/**
 * 입력된 텍스트에서 숫자만 추출하여 정수로 변환
 * @param text - 입력 텍스트 (콤마나 기타 문자 포함 가능)
 * @returns 추출된 숫자 (숫자가 없으면 0)
 */
export const parsePrice = (text: string): number => {
  const cleanText = text.replace(REGEX_PATTERNS.NUMBERS_ONLY, '');
  return parseInt(cleanText) || 0;
};

/**
 * 입력 필드용 가격 포맷팅 핸들러
 * @param text - 입력된 텍스트
 * @param onChange - 값 변경 콜백 함수
 */
export const handlePriceInput = (
  text: string,
  onChange: (value: number) => void
) => {
  const numValue = parsePrice(text);
  onChange(numValue);
};
