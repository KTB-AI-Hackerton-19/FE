import type { Metadata } from 'next';

import PageContainer from '@/components/common/page-container';
import PageHeader from '@/components/common/page-header';
import StatsGrid from '@/components/common/stats-grid';

import AccountActions from './_components/AccountActions';
import ProfileCard from './_components/ProfileCard';

export const metadata: Metadata = {
  title: '마이페이지 — Giftie',
};

export default function MyPage() {
  return (
    <PageContainer subpage narrow>
      <PageHeader
        eyebrow="마이페이지"
        title="내 정보"
        description="프로필과 계정을 관리할 수 있어요."
      />

      <ProfileCard />

      <h2 className="mt-8 mb-1 font-serif text-[19px]">내 기록 요약</h2>
      <StatsGrid />

      <AccountActions />
    </PageContainer>
  );
}