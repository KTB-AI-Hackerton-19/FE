'use client';

import { ChevronRight, LogOut, UserMinus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import ConfirmDialog from '@/components/common/confirm-dialog';
import LogoutConfirmDialog from '@/components/common/logout-confirm-dialog';
import { useAppUi } from '@/hooks/useAppUi';
import { useLogoutFlow } from '@/hooks/useLogoutFlow';
import { useDeleteMe } from '@/hooks/useUserMutations';
import { clearTokens, notifyAuthChanged } from '@/utils/tokenStorage';

const rowClass =
  'flex w-full cursor-pointer items-center gap-2.5 border-b border-line px-4 py-[15px] text-[12px] transition last:border-b-0 hover:bg-[#fdfaf7]';

function AccountActions() {
  const router = useRouter();
  const { showToast } = useAppUi();
  const { deleteMeMutation, isDeleteMePending } = useDeleteMe();

  const { isConfirmOpen, isLoggingOut, openLogoutConfirm, closeLogoutConfirm, confirmLogout } =
    useLogoutFlow();
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);

  const handleWithdraw = () =>
    deleteMeMutation(undefined, {
      onSuccess: () => {
        // 계정이 사라졌으니 서버 로그아웃 없이 로컬 토큰만 정리한다.
        clearTokens();
        notifyAuthChanged();
        router.replace('/login');
      },
      onError: error => {
        showToast(error instanceof ApiError ? error.message : '탈퇴하지 못했어요');
        setIsWithdrawOpen(false);
      },
    });

  return (
    <>
      <h2 className="mt-8 mb-3 font-serif text-[19px]">계정</h2>

      <section className="overflow-hidden rounded-[17px] border border-line bg-white">
        <button type="button" onClick={openLogoutConfirm} className={rowClass}>
          <LogOut size={16} className="text-[#8e8880]" />
          <span className="flex-1 text-left">로그아웃</span>
          <ChevronRight size={17} className="text-[#b1aba3]" />
        </button>

        <button
          type="button"
          onClick={() => setIsWithdrawOpen(true)}
          className={`${rowClass} text-coral-dark`}
        >
          <UserMinus size={16} />
          <span className="flex-1 text-left">회원 탈퇴</span>
          <ChevronRight size={17} className="text-[#b1aba3]" />
        </button>
      </section>

      {isConfirmOpen ? (
        <LogoutConfirmDialog
          isPending={isLoggingOut}
          onConfirm={confirmLogout}
          onCancel={closeLogoutConfirm}
        />
      ) : null}

      {isWithdrawOpen ? (
        <ConfirmDialog
          title="정말 탈퇴하시겠어요?"
          description={
            <>
              기록한 마음과 사람, 카테고리가 <b className="text-ink">모두 사라져요.</b>
              <br />
              되돌릴 수 없어요.
            </>
          }
          icon={<UserMinus size={22} />}
          confirmLabel="탈퇴할래요"
          cancelLabel="유지할래요"
          isPending={isDeleteMePending}
          onConfirm={handleWithdraw}
          onCancel={() => setIsWithdrawOpen(false)}
        />
      ) : null}
    </>
  );
}

export default AccountActions;