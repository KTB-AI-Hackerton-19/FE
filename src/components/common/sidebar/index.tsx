'use client';

import { Heart, LogOut, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import LogoutConfirmDialog from '@/components/common/logout-confirm-dialog';
import NavItem from '@/components/common/nav-item';
import ProfileAvatar from '@/components/common/profile-avatar';
import { NAV_ITEMS } from '@/consts/nav';
import { useDisplayName } from '@/hooks/useAuth';
import { useGetDashboard } from '@/hooks/useGetDashboard';
import { useGetMe } from '@/hooks/useGetMe';
import { useLogoutFlow } from '@/hooks/useLogoutFlow';

function Sidebar() {
  const pathname = usePathname();
  const { dashboardData } = useGetDashboard();
  const { meData } = useGetMe();
  const displayName = useDisplayName();

  const { isConfirmOpen, isLoggingOut, openLogoutConfirm, closeLogoutConfirm, confirmLogout } =
    useLogoutFlow();

  const totalRecords = dashboardData?.stats.totalRecords ?? 0;

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-[244px] flex-col border-r border-line bg-white px-[18px] pt-[30px] pb-[22px] lg:flex">
        <div className="font-logo flex items-center gap-[11px] px-2.5 pb-8 text-[24px] font-extrabold tracking-[-0.01em]">
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
              active={
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href as string)
              }
              count={item.href === '/records' ? totalRecords : undefined}
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
          <Link
            href="/mypage"
            className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl transition hover:opacity-70"
          >
            <ProfileAvatar name={displayName} imageUrl={meData?.profileImageUrl} />
            <span className="flex min-w-0 flex-col text-xs">
              <b className="truncate">{displayName ?? '사용자'}</b>
              <span className="mt-0.5 text-[10px] text-[#99948c]">
                마음 {totalRecords}개 기록 중
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={openLogoutConfirm}
            aria-label="로그아웃"
            className="cursor-pointer text-subtle hover:text-ink"
          >
            <LogOut size={17} />
          </button>
        </div>
      </aside>

      {/* aside 가 z-10 스태킹 컨텍스트라, 다이얼로그는 그 밖에서 띄워야 헤더(z-25) 위로 올라온다. */}
      {isConfirmOpen ? (
        <LogoutConfirmDialog
          isPending={isLoggingOut}
          onConfirm={confirmLogout}
          onCancel={closeLogoutConfirm}
        />
      ) : null}
    </>
  );
}

export default Sidebar;
