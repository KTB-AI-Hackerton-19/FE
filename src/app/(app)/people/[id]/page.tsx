import PageContainer from '@/components/common/page-container';

import PersonTimeline from './_components/PersonTimeline';

export default async function PersonDetailPage({ params }: PageProps<'/people/[id]'>) {
  const { id } = await params;

  return (
    <PageContainer subpage>
      <PersonTimeline id={Number(id)} />
    </PageContainer>
  );
}
