'use client';

import { CalendarDays, Heart, Users } from 'lucide-react';

import StatCard from '@/components/common/stat-card';
import { useGetRecords } from '@/hooks/useGetRecords';

function StatsGrid() {
  const { recordsData } = useGetRecords();
  const totalPeople = new Set(recordsData.map(record => record.person)).size;

  return (
    <section className="my-[15px] grid grid-cols-3 gap-1.5 sm:gap-[15px] lg:my-[15px] lg:mb-6">
      <StatCard
        icon={Heart}
        label="기록한 마음"
        value={`${recordsData.length}개`}
        detail="이번 달 +3"
        tone="coral"
      />
      <StatCard
        icon={Users}
        label="소중한 사람"
        value={`${totalPeople}명`}
        detail="꾸준히 이어가는 중"
        tone="mint"
      />
      <StatCard
        icon={CalendarDays}
        label="다가오는 일정"
        value="2개"
        detail="가장 가까운 일정 27일 후"
        tone="blue"
      />
    </section>
  );
}

export default StatsGrid;
