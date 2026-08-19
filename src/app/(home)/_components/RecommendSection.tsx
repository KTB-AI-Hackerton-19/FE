'use client';

import { ArrowRight, Lightbulb } from 'lucide-react';

import Button from '@/components/common/button';
import SectionHeading from '@/components/common/section-heading';
import { useAppUi } from '@/hooks/useAppUi';

import { RECOMMENDATIONS, RECOMMEND_TONES } from '../_consts/recommendations';

function RecommendSection() {
  const { showToast } = useAppUi();

  return (
    <>
      <SectionHeading
        id="recommendations"
        title="이런 선물은 어때요?"
        description="관계와 지난 선물을 살펴 적당한 마음을 골랐어요."
        label={
          <div className="mb-1.5 flex items-center gap-1 text-[10px] font-bold text-[#c88431]">
            <Lightbulb size={15} /> 민수님을 위한 추천
          </div>
        }
        action={
          <Button variant="text" size="xs" onClick={() => showToast('다른 추천을 준비하고 있어요')}>
            다시 추천받기
          </Button>
        }
      />

      <section className="flex snap-x snap-mandatory gap-[15px] overflow-auto lg:grid lg:grid-cols-3 lg:overflow-visible">
        {RECOMMENDATIONS.map((item, index) => (
          <article
            key={item.name}
            className="min-w-[78%] snap-start overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_14px_30px_#503e3514] lg:min-w-0"
          >
            <div
              className={`relative grid h-[125px] place-items-center text-[51px] ${RECOMMEND_TONES[index]}`}
            >
              {item.emoji}
              <span className="absolute top-2.5 left-[11px] rounded-[10px] bg-white px-2 py-[5px] text-[8px] font-bold text-[#7a746c]">
                {item.tag}
              </span>
            </div>
            <div className="p-[15px]">
              <h3 className="mb-[3px] text-[13px]">{item.name}</h3>
              <strong className="text-xs text-[#dc725f]">{item.price}</strong>
              <p className="h-[29px] text-[9px] leading-[1.55] text-[#8e8981]">{item.reason}</p>
              <button
                type="button"
                onClick={() => showToast(`${item.name}을(를) 선택했어요`)}
                className="mt-2.5 flex w-full cursor-pointer items-center justify-center gap-[5px] border-t border-line pt-[11px] text-[10px] font-bold text-[#5c7769]"
              >
                이 선물로 마음 전하기 <ArrowRight size={16} />
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

export default RecommendSection;
