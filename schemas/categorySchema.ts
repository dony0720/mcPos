import { z } from 'zod';

import type { CategoryFormData } from '../types';

/**
 * 카테고리 폼 데이터 스키마
 */
export const categoryFormSchema = z.object({
  name: z
    .string()
    .min(1, '카테고리명을 입력해주세요')
    .max(20, '카테고리명은 20자 이하로 입력해주세요'),
  displayOrder: z
    .number()
    .min(1, '표시 순서는 1 이상이어야 합니다')
    .max(99, '표시 순서는 99 이하여야 합니다'),
});

export type CategoryFormSchemaType = z.infer<typeof categoryFormSchema>;

// 타입 검증을 위한 assertion
const _typeCheck: CategoryFormSchemaType = {} as CategoryFormData;
