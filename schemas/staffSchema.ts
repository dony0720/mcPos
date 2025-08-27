import { z } from 'zod';

import { PHONE_REGEX } from '../constants/regex';

/**
 * 직원 폼 데이터 스키마
 */
export const staffFormSchema = z.object({
  name: z
    .string()
    .min(1, '직원명을 입력해주세요')
    .max(20, '직원명은 20자 이하로 입력해주세요'),
  phone: z
    .string()
    .min(1, '전화번호를 입력해주세요')
    .regex(PHONE_REGEX, '올바른 전화번호 형식이 아닙니다 (예: 010-1234-5678)'),
});

/**
 * 직원 생성 스키마 (폼 데이터 + 자동 생성 필드)
 */
export const staffCreateSchema = staffFormSchema.extend({
  id: z.string(),
  isActive: z.boolean().default(true),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * 직원 업데이트 스키마 (부분 업데이트 허용)
 */
export const staffUpdateSchema = staffFormSchema.partial().extend({
  id: z.string(),
  updatedAt: z.string(),
});

export type StaffFormSchemaType = z.infer<typeof staffFormSchema>;
export type StaffCreateSchemaType = z.infer<typeof staffCreateSchema>;
export type StaffUpdateSchemaType = z.infer<typeof staffUpdateSchema>;
