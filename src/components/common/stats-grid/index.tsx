'use client';

import { CalendarDays, Heart, Users } from 'lucide-react';

import StatCard from '@/components/common/stat-card';
import { useGetDashboard } from '@/hooks/useGetDashboard';

function StatsGrid() {
  const { dashboardData } = useGetDashboard();
  const stats = dashboardData?.stats;

  return (
    <section className="my-[15px] grid grid-cols-3 gap-1.5 sm:gap-[15px] lg:mb-6">
      <StatCard
        icon={Heart}
        label="기록한 마음"
        value={stats?.totalRecordsText ?? '—'}
        detail={stats?.recordsThisMonthText ?? ''}
        tone="coral"
      />
      <StatCard
        icon={Users}
        label="소중한 사람"
        value={stats?.totalPeopleText ?? '—'}
        detail="꾸준히 이어가는 중"
        tone="mint"
      />
      <StatCard
        icon={CalendarDays}
        label="다가오는 일정"
        value={stats?.upcomingRemindersText ?? '—'}
        detail={stats?.nearestReminderText ?? ''}
        tone="blue"
      />
    </section>
  );
}

export default StatsGrid;
