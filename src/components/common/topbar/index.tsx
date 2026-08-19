'use client';

import { Bell, Heart, Plus } from 'lucide-react';

import Button from '@/components/common/button';
import SearchBar from '@/components/common/search-bar';
import { useAppUi } from '@/hooks/useAppUi';

function Topbar() {
  const { openRecordModal, showToast } = useAppUi();

  return (
    <header className="sticky top-0 z-5 flex h-[66px] items-center justify-between gap-3 border-b border-line/70 bg-cream/95 px-[18px] backdrop-blur-md sm:h-[76px] lg:justify-end lg:px-[5.2vw]">
      <div className="font-logo flex items-center gap-[7px] text-[18px] font-extrabold tracking-[-0.01em] text-coral-deep lg:hidden">
        <Heart size={17} fill="currentColor" /> Giftie
      </div>

      <SearchBar />

      <div className="flex items-center gap-3">
        {/* 알림은 아직 API를 붙이지 않았다 — UI만 유지한다. */}
        <button
          type="button"
          onClick={() => showToast('알림 기능은 준비 중이에요')}
          aria-label="알림"
          className="relative grid size-10 cursor-pointer place-items-center rounded-xl border border-line bg-white text-[#66625c]"
        >
          <Bell size={20} />
        </button>
        <Button size="sm" onClick={openRecordModal} className="hidden lg:inline-flex">
          <Plus size={18} /> 마음 기록
        </Button>
      </div>
    </header>
  );
}

export default Topbar;
