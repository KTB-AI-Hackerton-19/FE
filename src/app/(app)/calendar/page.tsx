import type { Metadata } from 'next';

import PageContainer from '@/components/common/page-container';
import PageHeader from '@/components/common/page-header';

import CalendarView from './_components/CalendarView';

export const metadata: Metadata = {
  title: '마음 캘린더 — Giftie',
};

export default function CalendarPage() {
  return (
    <PageContainer subpage narrow>
      <PageHeader
        eyebrow="마음 캘린더"
        title="마음을 챙기는 달력"
        description="선물을 받은 날과 답례할 날을 한눈에 확인해요."
      />
      <CalendarView />
    </PageContainer>
  );
}
