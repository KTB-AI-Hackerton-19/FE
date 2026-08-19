'use client';

import { useGetDashboard } from '@/hooks/useGetDashboard';

import MonthCalendar from './MonthCalendar';

/** 캘린더의 기준 날짜는 클라이언트 시계가 아니라 서버가 내려준 today 를 쓴다. */
function CalendarView() {
  const { dashboardData } = useGetDashboard();

  if (!dashboardData) return null;

  return <MonthCalendar today={dashboardData.today} />;
}

export default CalendarView;
