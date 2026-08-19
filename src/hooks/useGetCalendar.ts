'use client';

import { useQuery } from '@tanstack/react-query';

import { getCalendar } from '@/apis/getCalendar';
import { QUERY_KEY } from '@/consts/api';

export const useGetCalendar = ({ year, month }: { year: number; month: number }) => {
  const { data: calendarData, isPending: isGetCalendarPending } = useQuery({
    queryKey: QUERY_KEY.CALENDAR(year, month),
    queryFn: () => getCalendar({ year, month }),
    placeholderData: previous => previous,
  });

  return { calendarData, isGetCalendarPending };
};
