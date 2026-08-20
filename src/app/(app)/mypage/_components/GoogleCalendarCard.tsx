'use client';

import { CalendarCheck, TriangleAlert } from 'lucide-react';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import ConfirmDialog from '@/components/common/confirm-dialog';
import { useAppUi } from '@/hooks/useAppUi';
import {
  useConnectGoogleCalendar,
  useDisconnectGoogleCalendar,
  useGetGoogleCalendarStatus,
} from '@/hooks/useGoogleCalendar';
import { formatDate } from '@/utils/formatDate';

function GoogleCalendarCard() {
  const { showToast } = useAppUi();
  const { googleStatus } = useGetGoogleCalendarStatus();
  const { connectGoogleMutation, isConnectGooglePending } = useConnectGoogleCalendar();
  const { disconnectGoogleMutation, isDisconnectGooglePending } = useDisconnectGoogleCalendar();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // 서버에 구글 설정이 없으면 연동을 제안할 수 없다.
  if (googleStatus && !googleStatus.available) return null;

  const isConnected = Boolean(googleStatus?.connected);
  const needsReauth = Boolean(googleStatus?.reauthRequired);

  const handleError = (error: unknown) =>
    showToast(error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.');

  const handleConnect = () => connectGoogleMutation(undefined, { onError: handleError });

  const handleDisconnect = () =>
    disconnectGoogleMutation(undefined, {
      onSuccess: () => {
        showToast('구글 캘린더 연동을 해제했어요');
        setIsConfirmOpen(false);
      },
      onError: error => {
        handleError(error);
        setIsConfirmOpen(false);
      },
    });

  return (
    <>
      <section className="rounded-[17px] border border-line bg-white p-4 sm:p-[18px]">
        <div className="flex items-center gap-3">
          <div className="grid size-10 shrink-0 place-items-center rounded-[13px] bg-blue-soft text-[#5b6f8a]">
            <CalendarCheck size={19} />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-[13px] font-bold">구글 캘린더</h3>
            <p className="mt-0.5 truncate text-[11px] text-[#918b83]">
              {isConnected
                ? (googleStatus?.googleEmail ?? '연동됨')
                : '답례 알림일을 구글 캘린더에도 남겨요'}
            </p>
          </div>

          {isConnected ? (
            <Button variant="ghost" size="sm" onClick={() => setIsConfirmOpen(true)}>
              연동 해제
            </Button>
          ) : (
            <Button size="sm" onClick={handleConnect} disabled={isConnectGooglePending}>
              {isConnectGooglePending ? '여는 중…' : '연동하기'}
            </Button>
          )}
        </div>

        {isConnected && googleStatus?.connectedAt ? (
          <p className="mt-3 border-t border-line pt-3 text-[10px] text-subtle">
            {formatDate(googleStatus.connectedAt.slice(0, 10))}부터 연동 중이에요.
          </p>
        ) : null}

        {needsReauth ? (
          <p className="mt-3 flex items-start gap-1.5 rounded-xl bg-coral-soft p-2.5 text-[10px] leading-[1.6] text-coral-dark">
            <TriangleAlert size={13} className="mt-px shrink-0" />
            연결이 끊겼어요. 다시 연동해야 새 일정이 등록됩니다.
          </p>
        ) : null}
      </section>

      {isConfirmOpen ? (
        <ConfirmDialog
          title="연동을 해제할까요?"
          description="앞으로 답례 알림이 구글 캘린더에 등록되지 않아요. 이미 등록된 일정은 그대로 남습니다."
          icon={<CalendarCheck size={22} />}
          confirmLabel="해제하기"
          cancelLabel="유지하기"
          isPending={isDisconnectGooglePending}
          onConfirm={handleDisconnect}
          onCancel={() => setIsConfirmOpen(false)}
        />
      ) : null}
    </>
  );
}

export default GoogleCalendarCard;
