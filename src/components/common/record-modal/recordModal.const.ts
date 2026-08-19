import { z } from 'zod';

import type { GiftRecordT } from '@/types/record';

export const recordFormSchema = z.object({
  personName: z.string().min(1, '보낸 사람을 입력해주세요'),
  relation: z.string(),
  date: z.string().min(1, '받은 날짜를 선택해주세요'),
  occasion: z.string(),
  gift: z.string().min(1, '선물을 입력해주세요'),
  price: z.string(),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  reminderDate: z.string(),
});

export type RecordFormT = z.infer<typeof recordFormSchema>;

export type ModalStepT = 'upload' | 'loading' | 'confirm';

export const emptyRecordForm = (today: string): RecordFormT => ({
  personName: '',
  relation: '',
  date: today,
  occasion: '',
  gift: '',
  price: '',
  category: '',
  reminderDate: '',
});

/** AI가 만든 DRAFT 기록을 확인 폼의 초기값으로 바꾼다. */
export const draftToForm = (draft: GiftRecordT, fallbackDate: string): RecordFormT => ({
  personName: draft.person || draft.extractedSenderName || '',
  relation: draft.relation || draft.extractedRelationship || '',
  date: draft.date || fallbackDate,
  occasion: draft.occasion ?? '',
  gift: draft.gift ?? '',
  price: draft.price ?? '',
  category: draft.category ?? '',
  reminderDate: draft.reminderDate ?? '',
});
