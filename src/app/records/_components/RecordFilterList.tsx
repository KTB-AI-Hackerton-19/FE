'use client';

import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

import { recordEmojiStyles } from '@/components/common/record-card/recordCard.style';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetRecords } from '@/hooks/useGetRecords';
import { formatDate } from '@/utils/formatDate';
import { getCategoryEmoji } from '@/utils/getCategoryEmoji';

const ALL = '전체';

function RecordFilterList() {
  const { recordsData } = useGetRecords();
  const { openRecordModal } = useAppUi();
  const [filter, setFilter] = useState<string>(ALL);

  const categories = [ALL, ...new Set(recordsData.map(record => record.category))];
  const shown = filter === ALL ? recordsData : recordsData.filter(r => r.category === filter);

  return (
    <>
      <div className="flex gap-2 overflow-auto pb-[5px]">
        {categories.map(category => (
          <button
            key={category}
            type="button"
            onClick={() => setFilter(category)}
            className={`cursor-pointer rounded-[20px] border px-3.5 py-2 text-[10px] whitespace-nowrap transition ${
              filter === category
                ? 'border-forest bg-forest text-white'
                : 'border-line bg-white text-[#7c7770]'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="my-[25px] mb-[11px] flex justify-between text-[11px]">
        <b>{shown.length}개의 마음</b>
        <span className="text-[#99938c]">최신순</span>
      </div>

      <div className="overflow-hidden rounded-[17px] border border-line bg-white">
        {shown.map(record => (
          <Link
            key={record.id}
            href={`/people/${encodeURIComponent(record.person)}`}
            className="flex w-full items-center gap-2.5 border-b border-line px-[11px] py-[13px] text-left last:border-b-0 hover:bg-[#fdfaf7] sm:gap-3.5 sm:p-4"
          >
            <div className={recordEmojiStyles({ accent: record.accent, size: 'sm' })}>
              {getCategoryEmoji(record.category)}
            </div>

            <div className="min-w-0 flex-1">
              <span className="text-[9px] text-subtle">{formatDate(record.date)}</span>
              <h3 className="my-[3px] text-sm">
                {record.person}
                <small className="mt-0.5 block font-normal text-[#9a948c] sm:mt-0 sm:ml-2 sm:inline">
                  {record.relation}
                </small>
              </h3>
              <p className="text-[11px] text-[#716b64]">{record.gift}</p>
            </div>

            <div className="grid grid-cols-[auto_20px] items-center gap-x-2.5 gap-y-[3px] text-right">
              <b className="max-w-[88px] truncate text-[11px]">{record.price}</b>
              <ChevronRight
                size={18}
                className="col-start-2 row-span-2 row-start-1 text-[#b1aba3]"
              />
              <span className="col-start-1 text-[9px] text-subtle">{record.category}</span>
            </div>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={openRecordModal}
        className="mt-[13px] flex w-full cursor-pointer items-center justify-center gap-[7px] rounded-[14px] border border-dashed border-[#d7c7bc] bg-[#fff7f2] p-3.5 text-[11px] font-bold text-[#cf6e5d] lg:hidden"
      >
        <Plus size={17} /> 마음 기록하기
      </button>
    </>
  );
}

export default RecordFilterList;
