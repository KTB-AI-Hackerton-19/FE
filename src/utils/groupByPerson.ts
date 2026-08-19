import type { PersonT, RecordT } from '@/types/record';

const byDateDesc = (a: RecordT, b: RecordT) => b.date.localeCompare(a.date);

/** 기록 목록을 사람별로 묶어 관계 타임라인 형태로 만든다. */
export const groupByPerson = (records: RecordT[]): PersonT[] => {
  const names = [...new Set(records.map(record => record.person))];

  return names.map(name => {
    const personRecords = records.filter(record => record.person === name).sort(byDateDesc);
    return {
      name,
      relation: personRecords[0].relation,
      records: personRecords,
      latest: personRecords[0],
    };
  });
};
