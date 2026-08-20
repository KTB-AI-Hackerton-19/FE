import PageContainer from '@/components/common/page-container';
import StatsGrid from '@/components/common/stats-grid';

import HomeBanners from './_components/HomeBanners';
import RecentRecords from './_components/RecentRecords';
import RecommendSection from './_components/RecommendSection';
import WelcomeSection from './_components/WelcomeSection';

export default function HomePage() {
  return (
    <PageContainer>
      <WelcomeSection />
      <StatsGrid className="my-[15px] lg:mb-6" />
      <HomeBanners />
      <RecentRecords />
      <RecommendSection />
    </PageContainer>
  );
}
