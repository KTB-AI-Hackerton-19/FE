'use client';

import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import { useGetPeople } from '@/hooks/useGetPeople';

const AVATAR_TONES = [
  'bg-[#f5e3dd] text-[#b86152]',
  'bg-[#e4f0e9] text-[#587867]',
  'bg-[#e8edf6] text-[#617695]',
  'bg-[#f6edda] text-[#9b7940]',
];

function PeopleList() {
  const { peopleData, isGetPeoplePending } = useGetPeople();

  if (peopleData.length === 0 && !isGetPeoplePending) {
    return (
      <div className="rounded-2xl border border-dashed border-[#d8d2ca] bg-white p-8 text-center text-[11px] text-muted">
        아직 등록된 사람이 없어요. 마음을 기록하면 자동으로 추가돼요.
      </div>
    );
  }

  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {peopleData.map((person, index) => (
        <Link
          key={person.id}
          href={`/people/${person.id}`}
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
              {person.relation} · 마음 {person.giftCount}개
            </p>
            {person.latestGift ? (
              <span className="mt-1.5 block text-[10px] text-[#6f7e76]">
                최근 {person.latestGift}
              </span>
            ) : null}
          </div>
          <ChevronRight className="text-[#b1aba3]" />
        </Link>
      ))}
    </div>
  );
}

export default PeopleList;
