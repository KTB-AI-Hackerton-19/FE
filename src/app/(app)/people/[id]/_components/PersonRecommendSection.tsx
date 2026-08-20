'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { getPersonRecommendations } from '@/apis/getPersonRecommendations';
import Button from '@/components/common/button';
import GiftCardList from '@/components/common/gift-card/GiftCardList';
import SectionHeading from '@/components/common/section-heading';
import ThankYouNote from '@/components/common/thank-you-note';
import { QUERY_KEY } from '@/consts/api';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetMe } from '@/hooks/useGetMe';
import { useGetPersonRecommendations } from '@/hooks/useGetPersonRecommendations';
import type { RecommendedGiftT } from '@/types/recommendation';

type PersonRecommendSectionProps = {
  id: number;
  name: string;
};

/** 사람 상세의 '이 사람을 위한 추천'. 관계·메모·지난 선물을 근거로 서버가 골라 준다. */
function PersonRecommendSection({ id, name }: PersonRecommendSectionProps) {
  const { showToast } = useAppUi();
  const { meData } = useGetMe();
  const queryClient = useQueryClient();
  const { personRecommendations } = useGetPersonRecommendations(id);

  // '다시 추천받기'로 새로 받은 목록은 저장된 추천보다 우선한다.
  const [refreshed, setRefreshed] = useState<RecommendedGiftT[] | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const gifts = refreshed ?? personRecommendations;
  // 한 세트에 하나뿐이라 카드마다 같은 값이 들어 있다 — 아래에 한 번만 보여준다.
  const thankYouMessage = gifts.find(gift => gift.thankYouMessage)?.thankYouMessage;

  if (gifts.length === 0) return null;

  const handleRefresh = async () => {
    setIsRefreshing(true);

    try {
      const next = await getPersonRecommendations({ id, refresh: true });
      setRefreshed(next);
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.PERSON_RECOMMENDATIONS(id) });
      showToast('새로운 추천을 준비했어요');
    } catch {
      showToast('추천을 불러오지 못했어요');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <section className="mt-[30px]">
      <SectionHeading
        title={`${name}님께는 이런 선물 어때요?`}
        description={`${meData?.name ?? '나'}님과 ${name}님의 관계와 마음 기록을 살펴 골랐어요.`}
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

      <GiftCardList gifts={gifts} />

      {thankYouMessage ? <ThankYouNote message={thankYouMessage} /> : null}
    </section>
  );
}

export default PersonRecommendSection;
