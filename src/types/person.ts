import type { GiftRecordT } from './record';

export type PersonT = {
  id: number;
  name: string;
  relation: string | null;
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
