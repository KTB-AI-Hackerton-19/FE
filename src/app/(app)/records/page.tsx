import PageContainer from '@/components/common/page-container';
import PageHeader from '@/components/common/page-header';

import RecordsTabs from './_components/RecordsTabs';

export default function RecordsPage() {
  return (
    <PageContainer subpage>
      <PageHeader
        eyebrow="마음 기록"
        title="받은 마음을 모아봤어요"
        description="선물과 부조금을 잊지 않도록 차곡차곡 기록해요."
      />
      <RecordsTabs />
    </PageContainer>
  );
}
