import PageContainer from '@/components/common/page-container';
import PageHeader from '@/components/common/page-header';

import PeopleList from './_components/PeopleList';

export default function PeoplePage() {
  return (
    <PageContainer subpage>
      <PageHeader
        eyebrow="사람들"
        title="소중한 사람들"
        description="카드를 누르면 주고받은 마음과 어울리는 선물 추천을 볼 수 있어요."
      />
      <PeopleList />
    </PageContainer>
  );
}
