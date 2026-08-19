'use client';

import { Check, Clock3 } from 'lucide-react';

import { useAppUi } from '@/hooks/useAppUi';
import { usePatchGiftRecordThanked } from '@/hooks/useGiftRecordMutations';

type ThankedBadgeProps = {
  id: number;
  thanked: boolean;
  /** 상위가 Link 인 경우 클릭이 전파되지 않도록 막는다 */
  stopPropagation?: boolean;
};

function ThankedBadge({ id, thanked, stopPropagation = false }: ThankedBadgeProps) {
  const { patchGiftRecordThankedMutation, isPatchGiftRecordThankedPending } =
    usePatchGiftRecordThanked();
  const { showToast } = useAppUi();

  const handleClick = (event: React.MouseEvent) => {
    if (stopPropagation) {
      event.preventDefault();
      event.stopPropagation();
    }

    patchGiftRecordThankedMutation(
      { id, thanked: !thanked },
      { onSuccess: () => showToast(thanked ? '확인 필요로 되돌렸어요' : '감사 완료로 표시했어요') }
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPatchGiftRecordThankedPending}
      aria-pressed={thanked}
      title={thanked ? '확인 필요로 되돌리기' : '감사 완료로 표시하기'}
      className={`flex cursor-pointer items-center gap-[3px] rounded-lg px-1.5 py-1 text-[9px] transition disabled:opacity-50 ${
        thanked ? 'text-[#6b917b] hover:bg-mint-soft' : 'text-[#b27b48] hover:bg-gold-soft'
      }`}
    >
      {thanked ? (
        <>
          <Check size={14} /> 감사 완료
        </>
      ) : (
        <>
          <Clock3 size={14} /> 확인 필요
        </>
      )}
    </button>
  );
}

export default ThankedBadge;
