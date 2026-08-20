import { z } from 'zod';

import type { GiftRecordT, RecordTypeT } from '@/types/record';

const baseRecordFormSchema = z.object({
  /** 대분류 탭. 그대로 요청의 recordType 이 된다 */
  recordType: z.union([z.literal('GIFT'), z.literal('EVENT')]),
  personName: z.string(),
  /** 사진에서 나온 사람 수. 2명 이상이면 사람별 칸 대신 목록으로 보여준다 */
  personCount: z.number(),
  /** 경조사에서 고른 보낸 사람들 — 고른 수만큼 기록이 만들어진다 */
  guests: z.array(
    z.object({ personId: z.number().optional(), name: z.string(), relation: z.string().optional() })
  ),
  /** 목록에서 고른 경우에만 채워진다. 비어 있으면 서버가 이름으로 찾거나 새로 만든다 */
  personId: z.number().optional(),
  relation: z.string(),
  date: z.string().min(1, '받은 날짜를 선택해주세요'),
  occasion: z.string(),
  gift: z.string().min(1, '선물을 입력해주세요'),
  price: z.string(),
  /** 선물 탭에서만 쓴다 */
  category: z.string(),
  /** 경조사 탭에서만 쓴다 — 서버가 정한 유형 코드(WEDDING 등) */
  eventCategory: z.string(),
  /** 경사·조사. 유형 목록을 좁히고 받은 마음 기본값을 정한다 */
  eventGroup: z.union([z.literal('CELEBRATION'), z.literal('CONDOLENCE')]),
  /** 행사가 실제로 열린 날 */
  eventDate: z.string(),
  reminderDate: z.string(),
});

/** 필수 항목이 탭마다 달라 여기서 갈라 본다 — 선물은 카테고리, 경조사는 행사 유형. */
export const recordFormSchema = baseRecordFormSchema.superRefine((values, ctx) => {
  const isEvent = values.recordType === 'EVENT';
  // AI 초안은 이름·금액을 그대로 두므로 폼에서 받지 않는다.
  const isAiDraft = values.personCount > 1;

  if (isEvent && !isAiDraft && values.guests.length === 0) {
    ctx.addIssue({ code: 'custom', path: ['guests'], message: '보낸 사람을 골라주세요' });
  }

  if (!isEvent && !isAiDraft && !values.personName.trim()) {
    ctx.addIssue({ code: 'custom', path: ['personName'], message: '보낸 사람을 입력해주세요' });
  }

  if (values.recordType === 'EVENT') {
    if (!values.eventCategory) {
      ctx.addIssue({
        code: 'custom',
        path: ['eventCategory'],
        message: '행사 유형을 선택해주세요',
      });
    }
    return;
  }

  if (!values.category) {
    ctx.addIssue({ code: 'custom', path: ['category'], message: '카테고리를 선택해주세요' });
  }
});

export type RecordFormT = z.infer<typeof baseRecordFormSchema>;

/** 대분류 탭. 고른 값이 그대로 요청의 recordType 이 된다. */
export const KIND_TABS = [
  {
    key: 'GIFT',
    label: '선물',
    description: '금액과 카테고리, 알림일을 확인해주세요.',
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
    description: '행사와 금액, 알림일을 확인해주세요.',
    categoryLabel: '행사 유형',
    // 경조사에서 이 칸에 들어가는 값은 조의금·축의금이라 '선물'로 부르면 어색하다.
    giftLabel: '받은 마음',
    // 경사·조사를 고르면 축의금·조의금이 채워지므로 안내 문구가 필요 없다.
    giftPlaceholder: '',
    pricePlaceholder: '100,000',
    // 행사 이름이 곧 사유라 '받은 이유'는 겹친다.
    showOccasion: false,
    // 경조사는 선물 카테고리 대신 고정 7종 유형을 고른다.
    isEvent: true,
  },
] as const satisfies readonly {
  key: RecordTypeT;
  label: string;
  description: string;
  categoryLabel: string;
  giftLabel: string;
  giftPlaceholder: string;
  pricePlaceholder: string;
  showOccasion: boolean;
  isEvent: boolean;
}[];

/** 카테고리 추가 모달은 선물 탭에서만 쓴다 — 경조사 유형은 서버 고정이라 만들 수 없다. */
export const GIFT_CATEGORY_ADD = {
  title: '카테고리 추가',
  nameLabel: '카테고리 이름',
  placeholder: '디저트',
} as const;

/** 경조사는 대부분 축의금·조의금이라 분류를 고르면 미리 채워 준다. */
export const EVENT_GIFT_DEFAULTS = {
  CELEBRATION: '축의금',
  CONDOLENCE: '조의금',
} as const;

export type ModalStepT = 'upload' | 'loading' | 'confirm';

export const emptyRecordForm = (today: string): RecordFormT => ({
  recordType: 'GIFT',
  personName: '',
  personCount: 1,
  guests: [],
  personId: undefined,
  relation: '',
  date: today,
  occasion: '',
  gift: '',
  price: '',
  category: '',
  eventCategory: '',
  eventGroup: 'CELEBRATION',
  eventDate: '',
  reminderDate: '',
});

/** AI가 만든 DRAFT 기록을 확인 폼의 초기값으로 바꾼다. */
export const draftToForm = (
  draft: GiftRecordT,
  fallbackDate: string,
  personCount = 1
): RecordFormT => ({
  // 경조사 여부는 event 하나로 확실히 갈린다.
  recordType: draft.event ? 'EVENT' : 'GIFT',
  personName: draft.person || draft.extractedSenderName || '',
  personCount,
  guests: [],
  personId: draft.personId ?? undefined,
  relation: draft.relation || draft.extractedRelationship || '',
  date: draft.date || fallbackDate,
  occasion: draft.occasion ?? '',
  gift: draft.gift ?? '',
  price: draft.price ?? '',
  category: draft.category ?? '',
  eventCategory: draft.eventCategory ?? '',
  eventGroup: draft.eventGroup === 'CONDOLENCE' ? 'CONDOLENCE' : 'CELEBRATION',
  eventDate: draft.eventDate ?? '',
  reminderDate: draft.reminderDate ?? '',
});
