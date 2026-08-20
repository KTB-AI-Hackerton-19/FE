import { Heart, Sparkles } from 'lucide-react';

import GiftBoxIcon from '@/assets/icons/GiftBoxIcon';

/** 로그인 화면 왼쪽의 브랜드 면. 좁은 화면에서는 자리를 차지하지 않고 숨는다. */
function BrandPanel() {
  return (
    <aside className="relative hidden overflow-hidden bg-[linear-gradient(155deg,#fdf4f0_0%,#fae4dc_52%,#f4cfc4_100%)] px-14 py-16 text-ink lg:flex lg:flex-col xl:px-20">
      {/* 배경 장식 — 로고와 문구 사이 빈 자리를 선물상자와 하트로 옅게 채운다 */}
      <div className="pointer-events-none absolute inset-0 text-white" aria-hidden="true">
        <GiftBoxIcon
          size={250}
          className="absolute top-[30%] left-[10%] -rotate-[9deg] opacity-45"
        />
        <Heart
          size={300}
          fill="currentColor"
          strokeWidth={0}
          className="absolute -top-16 -right-20 rotate-[18deg] opacity-55"
        />
        <Heart
          size={170}
          fill="currentColor"
          strokeWidth={0}
          className="absolute right-[22%] bottom-[14%] -rotate-12 opacity-35"
        />
        <Heart
          size={92}
          fill="#ed7b69"
          strokeWidth={0}
          className="absolute top-[34%] left-[-18px] rotate-[8deg] opacity-[0.13]"
        />
      </div>

      <div className="font-logo relative flex items-center gap-2.5 text-[26px] font-extrabold tracking-[-0.01em]">
        <span className="grid size-10 place-items-center rounded-[14px_14px_14px_5px] bg-coral text-white shadow-[0_8px_20px_#ed7b6935]">
          <Heart size={20} fill="currentColor" />
        </span>
        Giftie
      </div>

      <div className="relative mt-auto">
        <span className="text-[13px] font-bold tracking-[0.08em] text-coral-deep">AI 마음장부</span>
        <h2 className="mt-4 font-title text-[38px] leading-[1.34] font-bold tracking-[-0.035em] xl:text-[44px]">
          받은 마음을 기억하는
          <br />
          가장 쉬운 방법
        </h2>
        <p className="mt-6 text-[15px] leading-[1.8] text-[#8a6a60]">
          선물과 부조금을 기록해 두면
          <br />
          답례할 때가 됐을 때 먼저 알려드려요.
        </p>
      </div>

      <div className="relative mt-14 flex items-center gap-2 text-[13px] text-[#a08278]">
        <Sparkles size={16} className="shrink-0" />
        사진 한 장이면 AI가 자동으로 기록해요
      </div>
    </aside>
  );
}

export default BrandPanel;
