'use client';

import { Bell, Heart, Plus } from 'lucide-react';

import Button from '@/components/common/button';
import SearchBar from '@/components/common/search-bar';
import { useAppUi } from '@/hooks/useAppUi';

function Topbar() {
  const { openRecordModal, showToast } = useAppUi();

  return (
    <header className="sticky top-0 z-25 flex h-[66px] items-center gap-2.5 border-b border-line/70 bg-cream/95 px-5 backdrop-blur-md sm:h-[76px] sm:gap-3 sm:px-6 lg:px-[5.2vw]">
      <div className="font-logo flex shrink-0 items-center gap-2 text-[21px] font-extrabold tracking-[-0.01em] lg:hidden">
        <span className="grid size-9 place-items-center rounded-[13px_13px_13px_5px] bg-coral text-white shadow-[0_8px_20px_#ed7b6935]">
          <Heart size={17} fill="currentColor" />
        </span>
        Giftie
      </div>

      <SearchBar />

      <div className="flex shrink-0 items-center gap-3">
        {/* 알림은 아직 API를 붙이지 않았다 — UI만 유지한다. */}
        <button
          type="button"
          onClick={() => showToast('알림 기능은 준비 중이에요')}
          aria-label="알림"
          className="relative grid size-10 cursor-pointer place-items-center rounded-xl border border-line bg-white text-[#66625c]"
        >
          <Bell size={20} />
        </button>
        {/* Button 의 cva base 인 inline-flex 가 hidden 을 이기므로 래퍼로 감춘다. */}
        <div className="hidden lg:block">
          <Button size="sm" onClick={openRecordModal}>
            <Plus size={18} /> 마음 기록
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Topbar;
