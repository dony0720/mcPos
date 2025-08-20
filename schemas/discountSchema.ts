import { z } from 'zod';

import type { DiscountFormData } from '../types';

/**
 * 할인 폼 데이터 스키마
 */
export const discountFormSchema = z.object({
  name: z
    .string()
    .min(1, '할인명을 입력해주세요')
    .max(30, '할인명은 30자 이하로 입력해주세요'),
  type: z.enum(['PERCENTAGE', 'FIXED_AMOUNT'], {
    errorMap: () => ({ message: '할인 유형을 선택해주세요' }),
  }),
  value: z
    .number()
    .min(1, '할인값은 1 이상이어야 합니다')
    .refine((val, ctx) => {
      const type = ctx.path[0] === 'value' ? 'PERCENTAGE' : ctx.path[0];
      if (type === 'PERCENTAGE' && val > 100) {
        return false;
      }
      return true;
    }, '퍼센트 할인은 100% 이하여야 합니다'),
  isActive: z.boolean(),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().min(0).optional(),
  description: z
    .string()
    .max(100, '설명은 100자 이하로 입력해주세요')
    .optional()
    .or(z.literal('')),
});

export type DiscountFormSchemaType = z.infer<typeof discountFormSchema>;

// 타입 검증을 위한 assertion
const _typeCheck: DiscountFormSchemaType = {} as DiscountFormData;
