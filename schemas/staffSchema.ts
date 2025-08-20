import { z } from 'zod';

import type { StaffFormData } from '../types';

/**
 * 직원 폼 데이터 스키마 (퍼블리싱용 - 간소화)
 */
export const staffFormSchema = z.object({
  name: z
    .string()
    .min(1, '직원명을 입력해주세요')
    .max(20, '직원명은 20자 이하로 입력해주세요'),
  role: z.enum(['ADMIN', 'STAFF', 'PART_TIME'], {
    errorMap: () => ({ message: '역할을 선택해주세요' }),
  }),
  phone: z
    .string()
    .min(1, '연락처를 입력해주세요')
    .regex(/^010-\d{4}-\d{4}$/, '연락처는 010-0000-0000 형식으로 입력해주세요'),
});

export type StaffFormSchemaType = z.infer<typeof staffFormSchema>;

// 타입 검증을 위한 assertion
const _typeCheck: StaffFormSchemaType = {} as StaffFormData;
