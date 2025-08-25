// schemas/ledgerSchema.ts
import { z } from 'zod';

// 접수자 옵션 enum
const RECEPTIONIST_OPTIONS = [
  '홍길동',
  '김직원',
  '이사장',
  '박매니저',
  '최대리',
] as const;

type ReceptionistOption = (typeof RECEPTIONIST_OPTIONS)[number];

// 결제수단 옵션 enum
const PAYMENT_METHOD_OPTIONS = ['현금', '계좌이체'] as const;

type PaymentMethodOption = (typeof PAYMENT_METHOD_OPTIONS)[number];

export const ledgerRegistrationSchema = z.object({
  name: z
    .string()
    .min(1, '이름을 입력해주세요')
    .min(2, '이름은 최소 2자 이상이어야 합니다')
    .max(20, '이름은 20자를 초과할 수 없습니다')
    .regex(
      /^[가-힣a-zA-Z\s]+$/,
      '이름에는 한글, 영문, 공백만 사용할 수 있습니다'
    ),

  phoneNumber: z
    .string()
    .min(1, '전화번호를 입력해주세요')
    .regex(
      /^010-\d{4}-\d{4}$/,
      '올바른 전화번호 형식이 아닙니다 (010-0000-0000)'
    ),

  initialAmount: z
    .string()
    .min(1, '초기 충전 금액을 입력해주세요')
    .refine(val => {
      const num = parseInt(val.replace(/,/g, ''));
      return !isNaN(num) && num >= 1000;
    }, '최소 1,000원 이상 입력해주세요')
    .refine(val => {
      const num = parseInt(val.replace(/,/g, ''));
      return !isNaN(num) && num <= 1000000;
    }, '최대 1,000,000원까지 입력 가능합니다'),

  receptionist: z
    .string()
    .min(1, '접수자를 선택해주세요')
    .refine(
      val => RECEPTIONIST_OPTIONS.includes(val as ReceptionistOption),
      '유효한 접수자를 선택해주세요'
    ),

  paymentMethod: z
    .string()
    .min(1, '결제수단을 선택해주세요')
    .refine(
      val => PAYMENT_METHOD_OPTIONS.includes(val as PaymentMethodOption),
      '유효한 결제수단을 선택해주세요'
    ),
});

// 상수 export
export { PAYMENT_METHOD_OPTIONS, RECEPTIONIST_OPTIONS };

export type LedgerRegistrationFormData = z.infer<
  typeof ledgerRegistrationSchema
>;
