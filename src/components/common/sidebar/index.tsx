'use client';

import { ChevronRight, Heart, Sparkles } from 'lucide-react';
import { usePathname } from 'next/navigation';

import NavItem from '@/components/common/nav-item';
import { NAV_ITEMS } from '@/consts/nav';
import { useGetRecords } from '@/hooks/useGetRecords';

function Sidebar() {
  const pathname = usePathname();
  const { recordsData } = useGetRecords();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-[244px] flex-col border-r border-line bg-white px-[18px] pt-[30px] pb-[22px] lg:flex">
      <div className="flex items-center gap-[11px] px-2.5 pb-8 font-serif text-[22px] font-bold">
        <div className="grid size-9 place-items-center rounded-[13px_13px_13px_5px] bg-coral text-white shadow-[0_8px_20px_#ed7b6935]">
          <Heart size={20} fill="currentColor" />
        </div>
        <span>Giftie</span>
      </div>

      <nav className="flex flex-col gap-1.5">
        {NAV_ITEMS.map(item => (
          <NavItem
            key={item.href}
            item={item}
            active={item.href === '/' ? pathname === '/' : pathname.startsWith(item.href as string)}
            count={item.href === '/records' ? recordsData.length : undefined}
          />
        ))}
      </nav>

      <div className="mt-auto flex items-start gap-2.5 rounded-2xl bg-[#f3f7f2] p-[17px] text-[#567164]">
        <Sparkles size={18} className="shrink-0" />
        <p className="text-[11px] leading-[1.7]">
          <b className="text-xs text-[#3f5f50]">받은 마음, 잊지 않도록</b>
          <br />
          기록부터 답례까지 AI가 함께 챙겨드려요.
        </p>
      </div>

      <div className="mt-[17px] flex items-center gap-2.5 border-t border-line px-[5px] pt-3">
        <div className="grid size-[34px] place-items-center rounded-full bg-[#e8d2c2] font-bold text-[#795642]">
          박
        </div>
        <div className="flex flex-1 flex-col text-xs">
          <b>박스티브</b>
          <span className="mt-0.5 text-[10px] text-[#99948c]">마음 12개 기록 중</span>
        </div>
        <ChevronRight size={17} className="text-subtle" />
      </div>
    </aside>
  );
}

export default Sidebar;
