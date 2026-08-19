import PageContainer from '@/components/common/page-container';
import StatsGrid from '@/components/common/stats-grid';

import AgentCard from './_components/AgentCard';
import RecentRecords from './_components/RecentRecords';
import RecommendSection from './_components/RecommendSection';
import WelcomeSection from './_components/WelcomeSection';

export default function HomePage() {
  return (
    <PageContainer>
      <WelcomeSection />
      <StatsGrid />
      <AgentCard />
      <RecentRecords />
      <RecommendSection />
    </PageContainer>
  );
}
