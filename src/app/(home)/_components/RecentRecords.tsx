'use client';

import { ChevronRight, Plus } from 'lucide-react';

import Button from '@/components/common/button';
import RecordCard from '@/components/common/record-card';
import SectionHeading from '@/components/common/section-heading';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetRecords } from '@/hooks/useGetRecords';

function RecentRecords() {
  const { recordsData } = useGetRecords();
  const { openRecordModal, showToast } = useAppUi();

  return (
    <>
      <SectionHeading
        title="최근 받은 마음"
        description="기억해두고 싶은 소중한 순간들이에요."
        action={
          <Button variant="text" size="xs" onClick={() => showToast('모든 기록을 불러왔어요')}>
            전체보기 <ChevronRight size={17} />
          </Button>
        }
      />

      <section className="grid gap-3 lg:grid-cols-2">
        {recordsData.slice(0, 4).map(record => (
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
