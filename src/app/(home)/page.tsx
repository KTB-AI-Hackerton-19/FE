import PageContainer from '@/components/common/page-container';

import AgentCard from './_components/AgentCard';
import RecentRecords from './_components/RecentRecords';
import RecommendSection from './_components/RecommendSection';
import StatsGrid from './_components/StatsGrid';
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
