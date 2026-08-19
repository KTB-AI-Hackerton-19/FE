import type { AccentT } from './category';

export type CalendarEventTypeT = 'RECEIVED' | 'TO_GIVE';

export type CalendarEventT = {
  id: number;
  type: CalendarEventTypeT;
  date: string;
  giftRecordId: number;
  personId: number;
  person: string;
  gift: string;
  occasion: string | null;
  category: string;
  emoji: string;
  color: AccentT;
  amount: number;
  price: string;
  thanked: boolean;
};

export type CalendarDayT = {
  date: string;
  receivedCount: number;
  toGiveCount: number;
  events: CalendarEventT[];
};

export type CalendarT = {
  year: number;
  month: number;
  /** 이벤트가 있는 날짜만 담긴다 */
  days: CalendarDayT[];
};
