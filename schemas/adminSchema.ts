import { z } from 'zod';

/**
 * 관리자 로그인 스키마
 */
export const adminLoginSchema = z.object({
  password: z
    .string()
    .min(1, '비밀번호를 입력해주세요')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다')
    .max(20, '비밀번호는 최대 20자까지 입력 가능합니다')
    .regex(
      /^[a-zA-Z0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]*$/,
      '비밀번호는 영문, 숫자, 특수문자만 사용 가능합니다'
    ),
});

export type AdminLoginFormData = z.infer<typeof adminLoginSchema>;
