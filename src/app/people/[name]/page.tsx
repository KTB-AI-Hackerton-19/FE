import PageContainer from '@/components/common/page-container';

import PersonTimeline from './_components/PersonTimeline';

export default async function PersonDetailPage({ params }: PageProps<'/people/[name]'>) {
  const { name } = await params;

  return (
    <PageContainer subpage>
      <PersonTimeline name={decodeURIComponent(name)} />
    </PageContainer>
  );
}
