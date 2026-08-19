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

/** 카테고리 선택을 좁히는 탭. 카테고리 자체가 kind 를 들고 있어 폼 값으로는 보내지 않는다. */
export const KIND_TABS = [
  {
    key: 'GIFT',
    label: '선물',
    categoryLabel: '선물 카테고리',
    giftLabel: '선물',
    giftPlaceholder: '스타벅스 케이크',
    pricePlaceholder: '35,000원',
    showOccasion: true,
  },
  {
    key: 'EVENT',
    label: '경조사',
    categoryLabel: '행사 카테고리',
    // 경조사에서 이 칸에 들어가는 값은 조의금·축의금이라 '선물'로 부르면 어색하다.
    giftLabel: '받은 것',
    giftPlaceholder: '조의금',
    pricePlaceholder: '100,000원',
    // 행사 이름이 곧 사유라 '받은 이유'는 겹친다.
    showOccasion: false,
  },
] as const;

export type KindTabT = (typeof KIND_TABS)[number]['key'];

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
