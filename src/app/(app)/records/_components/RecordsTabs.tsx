'use client';

import { useState } from 'react';

import EventRecordList from './EventRecordList';
import GiftRecordList from './GiftRecordList';

const TABS = [
  { key: 'GIFT', label: '선물' },
  { key: 'EVENT', label: '경조사' },
] as const;

type TabKeyT = (typeof TABS)[number]['key'];

function RecordsTabs() {
  const [tab, setTab] = useState<TabKeyT>('GIFT');

  return (
    <>
      <div className="mb-5 inline-flex gap-1 rounded-[14px] bg-[#efeae4] p-1">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            aria-pressed={tab === key}
            className={`cursor-pointer rounded-[11px] px-5 py-2 text-[12px] font-bold transition ${
              tab === key ? 'bg-white text-ink shadow-[0_2px_6px_#4b3a320f]' : 'text-[#8b857e]'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 탭을 바꾸면 필터·검색어를 새로 시작하도록 조건부 마운트한다. */}
      {tab === 'GIFT' ? <GiftRecordList /> : <EventRecordList />}
    </>
  );
}

export default RecordsTabs;
