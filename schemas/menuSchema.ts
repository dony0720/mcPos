import { z } from 'zod';

// 메뉴 옵션 스키마
export const menuOptionSchema = z.object({
  name: z
    .string()
    .min(1, '옵션명을 입력해주세요')
    .max(30, '옵션명은 30자 이하로 입력해주세요'),
  price: z.number().min(0, '옵션 가격은 0원 이상이어야 합니다'),
});

// 메뉴 추가/편집 폼 스키마
export const menuFormSchema = z.object({
  name: z
    .string()
    .min(1, '메뉴명을 입력해주세요')
    .max(50, '메뉴명은 50자 이하로 입력해주세요'),
  price: z.number().min(0, '가격은 0원 이상이어야 합니다'),
  categories: z.array(z.string()).min(1, '최소 하나의 카테고리를 선택해주세요'),
  temperatureRestriction: z.enum(['HOT_ONLY', 'ICE_ONLY']).optional(),
  image: z.string().optional(),
  availableOptions: z.array(menuOptionSchema).optional().default([]),
});
