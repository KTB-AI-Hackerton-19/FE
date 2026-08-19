import type { PersonT } from './person';
import type { GiftRecordT } from './record';

export type SearchT = {
  query: string;
  people: PersonT[];
  records: GiftRecordT[];
};
