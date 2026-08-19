import { z } from 'zod';

import { CATEGORIES } from '@/consts/record';
import type { CategoryT } from '@/types/record';

export const recordFormSchema = z.object({
  person: z.string().min(1, '보낸 사람을 입력해주세요'),
  relation: z.string().min(1, '관계를 입력해주세요'),
  date: z.string().min(1, '받은 날짜를 선택해주세요'),
  occasion: z.string().min(1, '받은 이유를 입력해주세요'),
  gift: z.string().min(1, '선물을 입력해주세요'),
  price: z.string().min(1, '금액을 입력해주세요'),
  category: z.enum(CATEGORIES as [CategoryT, ...CategoryT[]]),
  reminderDate: z.string().min(1, '답례 알림일을 선택해주세요'),
});

export type RecordFormT = z.infer<typeof recordFormSchema>;

/** AI가 추출했다고 가정하는 기본값 — 사용자가 확인 단계에서 수정한다. */
export const AI_EXTRACTED_DEFAULT: RecordFormT = {
  person: '김민수',
  relation: '친한 친구',
  date: '2026-08-18',
  occasion: '내 생일',
  gift: '스타벅스 케이크',
  price: '35,000원',
  category: '디저트',
  reminderDate: '2026-09-14',
};

export type ModalStepT = 'upload' | 'loading' | 'confirm';
