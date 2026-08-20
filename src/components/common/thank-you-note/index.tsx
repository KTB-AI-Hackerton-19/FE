'use client';

import { Check, Copy, MessageCircleHeart } from 'lucide-react';
import { useState } from 'react';

import { useAppUi } from '@/hooks/useAppUi';

type ThankYouNoteProps = {
  /** AI가 써 준 답례 인사. 추천 한 세트에 하나뿐이다 */
  message: string;
};

/** 선물 대신 마음만 전하고 싶을 때를 위한 문구. 추천 카드 아래에 한 번만 붙는다. */
function ThankYouNote({ message }: ThankYouNoteProps) {
  const { showToast } = useAppUi();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // 브라우저가 클립보드를 막아 두면 실패한다 — 조용히 아무 일도 없으면 안 된다.
      await navigator.clipboard.writeText(message);
      setIsCopied(true);
      // 복사했다는 표시는 잠깐만 보여주고 원래 버튼으로 돌아간다.
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      showToast('복사하지 못했어요. 문구를 길게 눌러 직접 복사해주세요.');
    }
  };

  return (
    <div className="mt-[15px] rounded-2xl border border-line bg-[#fdf8f4] p-[15px]">
      <p className="flex items-center gap-1.5 text-[10px] font-bold text-[#c88431]">
        <MessageCircleHeart size={14} />
        선물이 부담스럽다면, 마음을 전할 문구도 골라뒀어요
      </p>

      <div className="mt-2 flex items-start gap-2.5">
        <p className="min-w-0 flex-1 text-[12px] leading-[1.7] text-[#5f5951]">{message}</p>
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1.5 text-[10px] font-bold text-[#7c7770] transition hover:text-ink"
        >
          {isCopied ? <Check size={12} /> : <Copy size={12} />}
          {isCopied ? '복사했어요' : '복사'}
        </button>
      </div>
    </div>
  );
}

export default ThankYouNote;
