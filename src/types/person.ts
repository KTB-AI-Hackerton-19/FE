import type { GiftRecordT } from './record';

/** 서버는 enum 이름(MALE/FEMALE)도 받지만, 응답이 한글 라벨이라 그대로 쓴다. */
export const GENDER_OPTIONS = ['남성', '여성'] as const;

export type GenderT = (typeof GENDER_OPTIONS)[number];

export type PersonT = {
  id: number;
  name: string;
  relation: string | null;
  gender: GenderT | null;
  birthday: string | null;
  memo: string | null;
  giftCount: number;
  latestGift: string | null;
  latestReceivedDate: string | null;
  upcomingReminderDate: string | null;
};

export type PersonDetailT = {
  person: PersonT;
  records: GiftRecordT[];
};
