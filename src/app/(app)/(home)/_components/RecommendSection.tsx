'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowRight, Lightbulb } from 'lucide-react';
import { useState } from 'react';

import { getRecommendations } from '@/apis/getRecommendations';
import Button from '@/components/common/button';
import SectionHeading from '@/components/common/section-heading';
import { QUERY_KEY } from '@/consts/api';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetDashboard } from '@/hooks/useGetDashboard';
import type { RecommendationT } from '@/types/recommendation';

import GiftThumbnail from './GiftThumbnail';

const TONES = ['bg-[#e9f1ed]', 'bg-[#f5ede2]', 'bg-[#f7e9e7]'];

const cardFooterClass =
  'mt-2.5 flex w-full items-center justify-center gap-[5px] border-t border-line pt-[11px] text-[10px] font-bold';

function RecommendSection() {
  const { dashboardData } = useGetDashboard();
  const { showToast } = useAppUi();
  const queryClient = useQueryClient();

  // '다시 추천받기'로 새로 받은 목록은 대시보드 응답보다 우선한다.
  const [refreshed, setRefreshed] = useState<RecommendationT[] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const insight = dashboardData?.agentInsight;
  // 서버는 사람·일정 단위로 묶어 주는데, 카드는 한 줄로 늘어놓는다.
  const groups = refreshed ?? dashboardData?.recommendations ?? [];
  const items = groups.flatMap(group => group.gifts.map(gift => ({ group, gift })));

  if (items.length === 0) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const next = await getRecommendations({ personId: insight?.personId, refresh: true });
      setRefreshed(next);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.RECOMMENDATIONS });
      showToast('새로운 추천을 준비했어요');
    } catch {
      showToast('추천을 불러오지 못했어요');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <>
      <SectionHeading
        id="recommendations"
        title="이런 선물은 어때요?"
        description="관계와 지난 선물을 살펴 적당한 마음을 골랐어요."
        label={
          insight ? (
            <div className="mb-1.5 flex items-center gap-1 text-[10px] font-bold text-[#c88431]">
              <Lightbulb size={15} /> {insight.person}님을 위한 추천
            </div>
          ) : null
        }
        action={
          <Button
            variant="text"
            size="xs"
            className="px-0 py-0"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? '준비 중…' : '다시 추천받기'}
          </Button>
        }
      />

      <section className="flex snap-x snap-mandatory gap-[15px] overflow-auto lg:grid lg:grid-cols-3 lg:overflow-visible">
        {items.map(({ group, gift }, index) => (
          <article
            key={`${group.personId}-${gift.id}`}
            className="min-w-[78%] snap-start overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-[0_14px_30px_#503e3514] lg:min-w-0"
          >
            <div className="relative h-[125px]">
              <GiftThumbnail
                imageUrl={gift.imageUrl}
                emoji={gift.emoji}
                name={gift.name}
                toneClass={TONES[index % TONES.length]}
              />
              <span className="absolute top-2.5 left-[11px] rounded-[10px] bg-white px-2 py-[5px] text-[8px] font-bold text-[#7a746c]">
                {gift.tag}
              </span>
            </div>
            <div className="p-[15px]">
              <h3 className="mb-[3px] text-[13px]">{gift.name}</h3>
              <strong className="text-xs text-[#dc725f]">{gift.price}</strong>
              <p className="h-[29px] text-[9px] leading-[1.55] text-[#8e8981]">{gift.reason}</p>
              {/* 구매 링크는 AI가 상품을 찾았을 때만 내려온다 */}
              {gift.productUrl ? (
                <a
                  href={gift.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${cardFooterClass} cursor-pointer text-[#5c7769]`}
                >
                  이 선물로 마음 전하기 <ArrowRight size={16} />
                </a>
              ) : (
                <p className={`${cardFooterClass} text-subtle`}>구매 링크를 찾지 못했어요</p>
              )}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}

export default RecommendSection;
