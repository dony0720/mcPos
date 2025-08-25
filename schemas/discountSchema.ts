import { z } from 'zod';

import { DiscountFormData } from '../types';
import { DiscountType } from '../types';

/**
 * 할인 폼 데이터 스키마
 */
export const discountFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, '할인명을 입력해주세요')
      .max(30, '할인명은 30자 이하로 입력해주세요'),
    type: z.enum(DiscountType),
    value: z
      .number()
      .positive('할인값은 0보다 커야 합니다')
      .max(1000000, '할인값이 너무 큽니다'),
  })
  .superRefine((data, ctx) => {
    // 퍼센트 할인인 경우 100% 이하 검증
    if (data.type === DiscountType.PERCENTAGE && data.value > 100) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: '퍼센트 할인은 100% 이하여야 합니다',
      });
    }

    // 고정금액 할인인 경우 최소 100원 이상 검증
    if (data.type === DiscountType.FIXED_AMOUNT && data.value < 100) {
      ctx.addIssue({
        code: 'custom',
        path: ['value'],
        message: '고정금액 할인은 최소 100원 이상이어야 합니다',
      });
    }
  });

export type DiscountFormSchemaType = z.infer<typeof discountFormSchema>;

// 타입 검증을 위한 assertion
const _typeCheck: DiscountFormSchemaType = {} as DiscountFormData;
