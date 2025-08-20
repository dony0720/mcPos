import { z } from 'zod';

/**
 * 직원 폼 데이터 스키마 (퍼블리싱용 - 간소화)
 */
export const staffFormSchema = z.object({
  name: z
    .string()
    .min(1, '직원명을 입력해주세요')
    .max(20, '직원명은 20자 이하로 입력해주세요'),
});

export type StaffFormSchemaType = z.infer<typeof staffFormSchema>;
