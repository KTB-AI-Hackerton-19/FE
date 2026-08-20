'use client';

import { CalendarDays, Heart, Users } from 'lucide-react';

import StatCard from '@/components/common/stat-card';
import { useGetDashboard } from '@/hooks/useGetDashboard';

type StatsGridProps = {
  /** 바깥 여백은 쓰는 쪽에서 정한다 */
  className?: string;
};

function StatsGrid({ className = '' }: StatsGridProps) {
  const { dashboardData } = useGetDashboard();
  const stats = dashboardData?.stats;

  /** 0 이면 부연을 비운다 — 숫자와 함께 '이번 달 +0' 이 뜨면 허전하다 */
  const detailOf = (count: number | undefined, text: string | undefined) =>
    count && count > 0 ? text : undefined;

  return (
    <section className={`grid grid-cols-3 gap-1.5 sm:gap-[15px] ${className}`}>
      <StatCard
        icon={Heart}
        label="기록한 마음"
        value={stats?.totalRecordsText ?? '0개'}
        detail={detailOf(stats?.recordsThisMonth, stats?.recordsThisMonthText)}
        tone="coral"
        href="/records"
      />
      <StatCard
        icon={Users}
        label="소중한 사람"
        value={stats?.totalPeopleText ?? '0명'}
        detail={detailOf(stats?.totalPeople, '꾸준히 이어가는 중')}
        tone="mint"
        href="/people"
      />
      <StatCard
        icon={CalendarDays}
        label="다가오는 일정"
        value={stats?.upcomingRemindersText ?? '0개'}
        detail={detailOf(stats?.upcomingReminders, stats?.nearestReminderText)}
        tone="blue"
        href="/calendar"
      />
    </section>
  );
}

export default StatsGrid;
