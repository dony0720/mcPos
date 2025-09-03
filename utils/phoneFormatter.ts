/**
 * 전화번호 포맷팅 유틸리티 함수
 * - 숫자만 추출하여 자동으로 하이픈(-) 포맷팅 적용
 * - 휴대폰 번호만 지원: 010-0000-0000, 011-000-0000, 016-000-0000, 017-000-0000, 018-000-0000, 019-000-0000
 */

/**
 * 휴대폰 번호 자동 포맷팅 함수
 * @param phoneNumber 입력된 전화번호 문자열
 * @returns 포맷팅된 휴대폰 번호 문자열
 */
export const formatPhoneNumber = (phoneNumber: string): string => {
  // 숫자만 추출
  const numbersOnly = phoneNumber.replace(/\D/g, '');

  // 빈 문자열이면 그대로 반환
  if (!numbersOnly) return '';

  // 휴대폰 번호가 아닌 경우 빈 문자열 반환 (010, 011, 016, 017, 018, 019만 허용)
  if (numbersOnly.length >= 3) {
    const prefix = numbersOnly.slice(0, 3);
    if (!['010', '011', '016', '017', '018', '019'].includes(prefix)) {
      return '';
    }
  }

  // 길이에 따른 포맷팅
  if (numbersOnly.length <= 3) {
    return numbersOnly;
  } else if (numbersOnly.length <= 7) {
    // 010-1234 형태
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3)}`;
  } else if (numbersOnly.length <= 11) {
    // 010-1234-5678 형태
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7)}`;
  } else {
    // 11자리 초과시 11자리까지만 포맷팅
    return `${numbersOnly.slice(0, 3)}-${numbersOnly.slice(3, 7)}-${numbersOnly.slice(7, 11)}`;
  }
};

/**
 * 휴대폰 번호 유효성 검증 함수
 * @param phoneNumber 검증할 전화번호
 * @returns 유효한 휴대폰 번호인지 여부
 */
export const validatePhoneNumber = (phoneNumber: string): boolean => {
  // 숫자만 추출
  const numbersOnly = phoneNumber.replace(/\D/g, '');

  // 휴대폰 번호만 허용 (010, 011, 016, 017, 018, 019)
  const mobilePattern = /^(010|011|016|017|018|019)\d{7,8}$/;

  return mobilePattern.test(numbersOnly);
};

/**
 * 전화번호에서 숫자만 추출하는 함수
 * @param phoneNumber 전화번호 문자열
 * @returns 숫자만 포함된 문자열
 */
export const extractPhoneNumbers = (phoneNumber: string): string => {
  return phoneNumber.replace(/\D/g, '');
};

/**
 * 전화번호에서 뒷자리 4개를 추출하는 함수
 * @param phoneNumber 전화번호 문자열 (010-1234-5678 또는 01012345678 형태)
 * @returns 뒷자리 4자리 문자열
 */
export const getPhoneLastFourDigits = (phoneNumber: string): string => {
  if (!phoneNumber) return '0000';

  const numbersOnly = phoneNumber.replace(/\D/g, '');

  if (numbersOnly.length < 4) {
    return numbersOnly.padStart(4, '0');
  }

  return numbersOnly.slice(-4);
};
