'use client';

import { ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

import RecordCard from '@/components/common/record-card';
import SectionHeading from '@/components/common/section-heading';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetDashboard } from '@/hooks/useGetDashboard';

function RecentRecords() {
  const { dashboardData } = useGetDashboard();
  const { openRecordModal } = useAppUi();

  const records = dashboardData?.recentRecords ?? [];

  return (
    <>
      <SectionHeading
        title="최근 받은 마음"
        description="기억해두고 싶은 소중한 순간들이에요."
        action={
          <Link
            href="/records"
            className="flex items-center gap-0.5 text-[11px] font-bold text-muted hover:text-ink"
          >
            전체보기 <ChevronRight size={17} />
          </Link>
        }
      />

      <section className="grid gap-3 lg:grid-cols-2">
        {records.map(record => (
          <RecordCard key={record.id} record={record} />
        ))}

        <button
          type="button"
          onClick={openRecordModal}
          className="flex min-h-[114px] cursor-pointer flex-col items-center justify-center gap-[3px] rounded-[15px] border border-dashed border-[#d7d1c8] text-[#827d76]"
        >
          <span className="grid size-[29px] place-items-center rounded-full bg-[#f1e9e3] text-[#cf7767]">
            <Plus size={16} />
          </span>
          <b className="text-[11px]">새로운 마음 기록하기</b>
          <small className="text-[9px] text-[#a49f98]">사진이나 메시지만 올려도 괜찮아요</small>
        </button>
      </section>
    </>
  );
}

export default RecentRecords;
