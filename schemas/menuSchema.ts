import { z } from 'zod';

import type { MenuCategory } from '../types/menu';

// 메뉴 추가/편집 폼 스키마
export const menuFormSchema = z.object({
  name: z
    .string()
    .min(1, '메뉴명을 입력해주세요')
    .max(50, '메뉴명은 50자 이하로 입력해주세요'),
  price: z.number().min(0, '가격은 0원 이상이어야 합니다'),
  category: z.enum(['COFFEE', 'NON_COFFEE', 'TEA', 'ADE', 'DESSERT']),
  image: z.string().optional(),
});

export type MenuFormData = z.infer<typeof menuFormSchema>;

// 카테고리 옵션
export const CATEGORY_OPTIONS: { value: MenuCategory; label: string }[] = [
  { value: 'COFFEE', label: '커피' },
  { value: 'NON_COFFEE', label: '논커피' },
  { value: 'TEA', label: '차' },
  { value: 'ADE', label: '에이드' },
  { value: 'DESSERT', label: '디저트' },
];
