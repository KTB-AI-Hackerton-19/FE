'use client';

import { Plus } from 'lucide-react';
import { usePathname } from 'next/navigation';

import NavItem from '@/components/common/nav-item';
import { NAV_ITEMS } from '@/consts/nav';
import { useAppUi } from '@/hooks/useAppUi';

function BottomNav() {
  const pathname = usePathname();
  const { openRecordModal } = useAppUi();

  const [home, records, people, calendar] = NAV_ITEMS;
  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

  return (
    <nav className="fixed bottom-0 left-1/2 z-20 grid h-[76px] w-full max-w-[560px] -translate-x-1/2 grid-cols-[1fr_1fr_62px_1fr_1fr] items-center border-t border-line bg-[#fffcf9]/95 px-[18px] pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-lg lg:hidden">
      <NavItem item={home} active={isActive(home.href)} layout="bottom" />
      <NavItem item={records} active={isActive(records.href)} layout="bottom" />
      <button
        type="button"
        onClick={openRecordModal}
        aria-label="마음 기록하기"
        className="grid size-[52px] -translate-y-[11px] cursor-pointer place-items-center rounded-[18px] bg-coral text-white shadow-[0_8px_20px_#d76b5a4a]"
      >
        <Plus size={25} />
      </button>
      <NavItem item={people} active={isActive(people.href)} layout="bottom" />
      <NavItem item={calendar} active={isActive(calendar.href)} layout="bottom" />
    </nav>
  );
}

export default BottomNav;
