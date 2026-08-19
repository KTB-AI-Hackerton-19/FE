'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { useGetRecords } from '@/hooks/useGetRecords';
import { groupByPerson } from '@/utils/groupByPerson';

const AVATAR_TONES = [
  'bg-[#f5e3dd] text-[#b86152]',
  'bg-[#e4f0e9] text-[#587867]',
  'bg-[#e8edf6] text-[#617695]',
  'bg-[#f6edda] text-[#9b7940]',
];

function PeopleList() {
  const { recordsData } = useGetRecords();
  const people = groupByPerson(recordsData);

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {people.map((person, index) => (
        <Link
          key={person.name}
          href={`/people/${encodeURIComponent(person.name)}`}
          className="flex items-center gap-[13px] rounded-2xl border border-line bg-white p-4 text-left transition hover:bg-[#fdfaf7]"
        >
          <div
            className={`grid size-[47px] place-items-center rounded-2xl font-serif text-[19px] ${
              AVATAR_TONES[index % AVATAR_TONES.length]
            }`}
          >
            {person.name[0]}
          </div>
          <div className="flex-1">
            <h3 className="mb-[3px] text-sm">{person.name}</h3>
            <p className="text-[10px] text-[#908a82]">
              {person.relation} · 마음 {person.records.length}개
            </p>
            <span className="mt-1.5 block text-[10px] text-[#6f7e76]">
              최근 {person.latest.gift}
            </span>
          </div>
          <ChevronRight className="text-[#b1aba3]" />
        </Link>
      ))}
    </div>
  );
}

export default PeopleList;
