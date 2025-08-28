// schemas/ledgerSchema.ts
import { z } from 'zod';

import { PHONE_REGEX } from '../constants/regex';

// 결제수단 옵션 enum
export const PAYMENT_METHOD_OPTIONS = ['현금', '계좌이체'] as const;

type PaymentMethodOption = (typeof PAYMENT_METHOD_OPTIONS)[number];

/**
 * 장부 등록 폼 스키마
 */
export const ledgerRegistrationSchema = z.object({
  name: z
    .string()
    .trim() // 앞뒤 공백 제거
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(20, '이름은 20자를 초과할 수 없습니다')
    .regex(
      /^[가-힣a-zA-Z\s]+$/,
      '이름에는 한글, 영문, 공백만 사용할 수 있습니다'
    ),

  phoneNumber: z
    .string()
    .trim() // 앞뒤 공백 제거
    .min(1, '전화번호를 입력해주세요')
    .regex(PHONE_REGEX, '올바른 전화번호 형식이 아닙니다 (010-1234-5678)')
    .refine(
      phone => phone.startsWith('010'),
      '010으로 시작하는 전화번호만 입력 가능합니다'
    ),

  initialAmount: z
    .string()
    .trim() // 앞뒤 공백 제거
    .min(1, '초기 충전 금액을 입력해주세요')
    .refine(val => {
      const cleanVal = val.replace(/[,\s]/g, ''); // 콤마와 공백 제거
      const num = parseInt(cleanVal);
      return !isNaN(num) && num >= 1000;
    }, '최소 1,000원 이상 입력해주세요')
    .refine(val => {
      const cleanVal = val.replace(/[,\s]/g, ''); // 콤마와 공백 제거
      const num = parseInt(cleanVal);
      return !isNaN(num) && num <= 10000000;
    }, '최대 10,000,000원까지 입력 가능합니다')
    .refine(val => {
      const cleanVal = val.replace(/[,\s]/g, ''); // 콤마와 공백 제거
      const num = parseInt(cleanVal);
      return num % 1000 === 0;
    }, '1,000원 단위로만 입력 가능합니다'),

  receptionist: z
    .string()
    .trim() // 앞뒤 공백 제거
    .min(1, '접수자를 선택해주세요'),

  paymentMethod: z
    .string()
    .min(1, '결제수단을 선택해주세요')
    .refine(
      val => PAYMENT_METHOD_OPTIONS.includes(val as PaymentMethodOption),
      '유효한 결제수단을 선택해주세요'
    ),
});

/**
 * 충전 폼 스키마
 */
export const chargeSchema = z.object({
  chargeAmount: z
    .string()
    .trim()
    .min(1, '충전 금액을 입력해주세요')
    .refine(val => {
      const cleanVal = val.replace(/[,\s]/g, '');
      const num = parseInt(cleanVal);
      return !isNaN(num) && num >= 1000;
    }, '최소 1,000원 이상 입력해주세요')
    .refine(val => {
      const cleanVal = val.replace(/[,\s]/g, '');
      const num = parseInt(cleanVal);
      return !isNaN(num) && num <= 10000000;
    }, '최대 10,000,000원까지 입력 가능합니다')
    .refine(val => {
      const cleanVal = val.replace(/[,\s]/g, '');
      const num = parseInt(cleanVal);
      return num % 1000 === 0;
    }, '1,000원 단위로만 입력 가능합니다'),

  receptionist: z.string().trim().min(1, '접수자를 선택해주세요'),

  paymentMethod: z
    .string()
    .min(1, '결제수단을 선택해주세요')
    .refine(
      val => PAYMENT_METHOD_OPTIONS.includes(val as PaymentMethodOption),
      '유효한 결제수단을 선택해주세요'
    ),
});

export type LedgerRegistrationFormData = z.infer<
  typeof ledgerRegistrationSchema
>;
export type ChargeFormData = z.infer<typeof chargeSchema>;
