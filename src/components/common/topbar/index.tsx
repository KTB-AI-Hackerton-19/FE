'use client';

import { Bell, Heart, Plus, Search } from 'lucide-react';

import Button from '@/components/common/button';
import { useAppUi } from '@/hooks/useAppUi';

function Topbar() {
  const { openRecordModal, showToast } = useAppUi();

  return (
    <header className="sticky top-0 z-5 flex h-[66px] items-center justify-between gap-3 border-b border-line/70 bg-cream/95 px-[18px] backdrop-blur-md sm:h-[76px] lg:justify-end lg:px-[5.2vw]">
      <div className="flex items-center gap-[7px] font-serif text-base text-coral-deep lg:hidden">
        <Heart size={17} fill="currentColor" /> Giftie
      </div>

      <div className="mr-auto hidden w-[310px] items-center gap-2.5 rounded-xl border border-line bg-white px-[13px] py-2.5 text-subtle lg:flex">
        <Search size={18} />
        <input
          className="w-full min-w-0 border-0 text-[13px] text-ink outline-0"
          placeholder="사람이나 선물을 검색해보세요"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => showToast('아직 읽지 않은 알림이 1개 있어요')}
          className="relative grid size-10 cursor-pointer place-items-center rounded-xl border border-line bg-white text-[#66625c]"
        >
          <Bell size={20} />
          <i className="absolute top-[7px] right-2 size-[7px] rounded-full border-2 border-white bg-coral" />
        </button>
        <Button size="sm" onClick={openRecordModal} className="hidden lg:inline-flex">
          <Plus size={18} /> 마음 기록
        </Button>
      </div>
    </header>
  );
}

export default Topbar;
