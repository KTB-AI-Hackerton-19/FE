'use client';

import { Bell, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

import { useGetRecords } from '@/hooks/useGetRecords';
import { formatDate, formatShortDate } from '@/utils/formatDate';
import { getCategoryEmoji } from '@/utils/getCategoryEmoji';
import { groupByPerson } from '@/utils/groupByPerson';

type PersonTimelineProps = {
  name: string;
};

function PersonTimeline({ name }: PersonTimelineProps) {
  const { recordsData } = useGetRecords();
  const person = groupByPerson(recordsData).find(candidate => candidate.name === name);

  if (!person) {
    return (
      <div className="rounded-[14px] border border-dashed border-[#d8d2ca] bg-white p-[26px] text-center text-[11px] text-muted">
        아직 기록이 없는 사람이에요.
      </div>
    );
  }

  return (
    <>
      <Link
        href="/people"
        className="mb-[18px] flex items-center text-[11px] text-[#777169] hover:text-ink"
      >
        <ChevronLeft size={18} /> 사람 목록
      </Link>

      <div className="rounded-[20px] border border-line bg-white p-[26px] text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-[22px] bg-[#f3e1db] font-serif text-[26px] text-[#b65f51]">
          {person.name[0]}
        </div>
        <h1 className="mt-2.5 mb-[3px] font-serif text-2xl">{person.name}</h1>
        <p className="text-[11px] text-[#918b83]">
          {person.relation} · 함께한 마음 {person.records.length}개
        </p>
      </div>

      <div className="my-3 mb-7 grid grid-cols-2 rounded-2xl bg-forest px-1.5 py-3.5 text-white sm:p-[17px]">
        <div className="flex flex-col items-center gap-[5px]">
          <span className="text-[9px] text-[#bed0c8]">최근 받은 날</span>
          <b className="text-xs">{formatDate(person.latest.date)}</b>
        </div>
        <div className="flex flex-col items-center gap-[5px] border-l border-white/15">
          <span className="text-[9px] text-[#bed0c8]">다가오는 알림</span>
          <b className="text-xs">{formatDate(person.latest.reminderDate)}</b>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="font-serif text-[19px]">주고받은 마음</h2>
        <span className="text-[10px] text-muted">{person.records.length}개</span>
      </div>

      <div className="mt-3">
        {person.records.map((record, index) => (
          <article key={record.id} className="relative grid grid-cols-[40px_1fr] gap-3">
            <div className="z-1 grid size-[38px] place-items-center rounded-full border border-line bg-white">
              {getCategoryEmoji(record.category)}
            </div>
            {index < person.records.length - 1 && (
              <div className="absolute top-[38px] -bottom-3 left-[19px] w-px bg-[#ded8cf]" />
            )}
            <div className="mb-3 rounded-[14px] border border-line bg-white p-3.5">
              <time className="text-[9px] text-subtle" dateTime={record.date}>
                {formatDate(record.date)}
              </time>
              <h3 className="my-[3px] text-[13px]">{record.gift}</h3>
              <p className="text-[10px] text-[#8c867f]">
                {record.occasion} · {record.category}
              </p>
              <div className="mt-2.5 flex justify-between border-t border-line pt-[9px] text-[10px]">
                <b>{record.price}</b>
                <span className="flex items-center gap-1 text-[#c27566]">
                  <Bell size={13} /> {formatShortDate(record.reminderDate)} 알림
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default PersonTimeline;
