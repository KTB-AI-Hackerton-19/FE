import { z } from 'zod';

import type { KindT } from '@/types/category';
import type { GiftRecordT } from '@/types/record';

export const recordFormSchema = z.object({
  personName: z.string().min(1, '보낸 사람을 입력해주세요'),
  /** 목록에서 고른 경우에만 채워진다. 비어 있으면 서버가 이름으로 찾거나 새로 만든다 */
  personId: z.number().optional(),
  relation: z.string(),
  date: z.string().min(1, '받은 날짜를 선택해주세요'),
  occasion: z.string(),
  gift: z.string().min(1, '선물을 입력해주세요'),
  price: z.string(),
  category: z.string().min(1, '카테고리를 선택해주세요'),
  /** 경조사 탭에서만 쓴다 — 행사를 새로 만들 때의 분류 */
  eventKind: z.union([z.literal('CELEBRATION'), z.literal('CONDOLENCE')]),
  reminderDate: z.string(),
});

export type RecordFormT = z.infer<typeof recordFormSchema>;

/** 카테고리 선택을 좁히는 탭. 카테고리 자체가 kind 를 들고 있어 폼 값으로는 보내지 않는다. */
export const KIND_TABS = [
  {
    key: 'GIFT',
    label: '선물',
    categoryLabel: '선물 카테고리',
    giftLabel: '받은 선물',
    giftPlaceholder: '스타벅스 케이크',
    pricePlaceholder: '35,000',
    showOccasion: true,
    isEvent: false,
  },
  {
    key: 'EVENT',
    label: '경조사',
    categoryLabel: '행사 이름',
    // 경조사에서 이 칸에 들어가는 값은 조의금·축의금이라 '선물'로 부르면 어색하다.
    giftLabel: '받은 마음',
    // 경사·조사를 고르면 축의금·조의금이 채워지므로 안내 문구가 필요 없다.
    giftPlaceholder: '',
    pricePlaceholder: '100,000',
    // 행사 이름이 곧 사유라 '받은 이유'는 겹친다.
    showOccasion: false,
    // 경조사는 목록에서 고르지 않고 경사·조사 + 이름을 폼에서 직접 적는다.
    isEvent: true,
  },
] as const satisfies readonly {
  key: string;
  label: string;
  categoryLabel: string;
  giftLabel: string;
  giftPlaceholder: string;
  pricePlaceholder: string;
  showOccasion: boolean;
  isEvent: boolean;
}[];

/** 카테고리 추가 모달은 선물 탭에서만 쓴다. */
export const GIFT_CATEGORY_ADD = {
  kind: 'GIFT',
  title: '새 선물 카테고리',
  nameLabel: '카테고리 이름',
  placeholder: '디저트',
} as const satisfies { kind: KindT; title: string; nameLabel: string; placeholder: string };

/** 경조사는 대부분 축의금·조의금이라 분류를 고르면 미리 채워 준다. */
export const EVENT_GIFT_DEFAULTS = {
  CELEBRATION: '축의금',
  CONDOLENCE: '조의금',
} as const;

export type KindTabT = (typeof KIND_TABS)[number]['key'];

export type ModalStepT = 'upload' | 'loading' | 'confirm';

export const emptyRecordForm = (today: string): RecordFormT => ({
  personName: '',
  personId: undefined,
  relation: '',
  date: today,
  occasion: '',
  gift: '',
  price: '',
  category: '',
  eventKind: 'CELEBRATION',
  reminderDate: '',
});

/** AI가 만든 DRAFT 기록을 확인 폼의 초기값으로 바꾼다. */
export const draftToForm = (draft: GiftRecordT, fallbackDate: string): RecordFormT => ({
  personName: draft.person || draft.extractedSenderName || '',
  personId: draft.personId ?? undefined,
  relation: draft.relation || draft.extractedRelationship || '',
  date: draft.date || fallbackDate,
  occasion: draft.occasion ?? '',
  gift: draft.gift ?? '',
  price: draft.price ?? '',
  category: draft.category ?? '',
  eventKind: draft.kind === 'CONDOLENCE' ? 'CONDOLENCE' : 'CELEBRATION',
  reminderDate: draft.reminderDate ?? '',
});
