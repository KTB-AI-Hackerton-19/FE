import { z } from 'zod';

export const loginFormSchema = z.object({
  username: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(4, '비밀번호는 4자 이상이에요'),
  name: z.string().optional(),
});

export const signupFormSchema = loginFormSchema.extend({
  name: z.string().min(1, '이름을 입력해주세요').max(20, '이름은 20자 이내로 입력해주세요'),
});

export type LoginFormT = z.infer<typeof loginFormSchema>;

export type AuthModeT = 'login' | 'signup';
