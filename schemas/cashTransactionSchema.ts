// schemas/cashTransactionSchema.ts
import { z } from 'zod';

// 현금 거래 스키마
export const cashTransactionSchema = z.object({
  amount: z
    .string()
    .min(1, '금액을 입력해주세요')
    .refine(val => {
      const cleanValue = val.replace(/,/g, '');
      const num = parseFloat(cleanValue);
      return !isNaN(num);
    }, '올바른 금액을 입력해주세요')
    .refine(val => {
      const cleanValue = val.replace(/,/g, '');
      const num = parseFloat(cleanValue);
      return num > 0;
    }, '0원보다 큰 금액을 입력해주세요')
    .refine(val => {
      const cleanValue = val.replace(/,/g, '');
      const num = parseFloat(cleanValue);
      return num % 1 === 0;
    }, '원 단위로 입력해주세요')
    .refine(val => {
      const cleanValue = val.replace(/,/g, '');
      const num = parseFloat(cleanValue);
      return num <= 1000000000;
    }, '10억원 이하로 입력해주세요')
    .refine(val => {
      const cleanValue = val.replace(/,/g, '');
      const num = parseFloat(cleanValue);
      return num % 100 === 0;
    }, '100원 단위로 입력해주세요'),

  memo: z.string().max(100, '메모는 100자 이내로 입력해주세요').optional(),
});

// 출금 전용 스키마 (현금 부족 체크 포함)
export const createWithdrawalSchema = (availableCash: number) => {
  return cashTransactionSchema.extend({
    amount: cashTransactionSchema.shape.amount.refine(val => {
      const cleanValue = val.replace(/,/g, '');
      const num = parseFloat(cleanValue);
      return num <= availableCash;
    }, `보유 현금이 부족합니다. (보유: ${availableCash.toLocaleString()}원)`),
  });
};

// 타입 추출
export type CashTransactionFormData = z.infer<typeof cashTransactionSchema>;
