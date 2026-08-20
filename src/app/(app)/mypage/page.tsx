import PageContainer from '@/components/common/page-container';
import PageHeader from '@/components/common/page-header';
import StatsGrid from '@/components/common/stats-grid';

import AccountActions from './_components/AccountActions';
import GoogleCalendarCard from './_components/GoogleCalendarCard';
import ProfileCard from './_components/ProfileCard';
import SectionTitle from './_components/SectionTitle';

export default function MyPage() {
  return (
    <PageContainer subpage narrow>
      <PageHeader eyebrow="마이페이지" title="내 정보" />

      <SectionTitle>프로필</SectionTitle>
      <ProfileCard />

      <SectionTitle>내 기록 요약</SectionTitle>
      <StatsGrid />

      <SectionTitle>연동</SectionTitle>
      <GoogleCalendarCard />

      <SectionTitle>계정</SectionTitle>
      <AccountActions />
    </PageContainer>
  );
}
