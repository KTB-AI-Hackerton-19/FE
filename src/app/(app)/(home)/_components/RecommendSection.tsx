'use client';

import { useQueryClient } from '@tanstack/react-query';
import { Lightbulb } from 'lucide-react';
import { useState } from 'react';

import { getRecommendations } from '@/apis/getRecommendations';
import Button from '@/components/common/button';
import GiftCardList from '@/components/common/gift-card/GiftCardList';
import SectionHeading from '@/components/common/section-heading';
import ThankYouNote from '@/components/common/thank-you-note';
import { QUERY_KEY } from '@/consts/api';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetDashboard } from '@/hooks/useGetDashboard';
import type { RecommendationT } from '@/types/recommendation';

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
  // 한 세트에 하나뿐이라 카드마다 같은 값이 들어 있다 — 아래에 한 번만 보여준다.
  const thankYouMessage = items.find(({ gift }) => gift.thankYouMessage)?.gift.thankYouMessage;

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
        description={
          insight
            ? `${insight.person}님의 관계와 마음 기록을 살펴 골랐어요.`
            : '관계와 지난 선물을 살펴 적당한 마음을 골랐어요.'
        }
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
            {isRefreshing ? '새로 고르는 중…' : '다시 추천받기'}
          </Button>
        }
      />

      <GiftCardList gifts={items.map(({ gift }) => gift)} />

      {thankYouMessage ? <ThankYouNote message={thankYouMessage} /> : null}
    </>
  );
}

export default RecommendSection;
