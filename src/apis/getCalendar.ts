import { API } from '@/consts/api';
import type { CalendarT } from '@/types/calendar';

import { apiClient } from './apiClient';

export type GetCalendarResponseT = CalendarT;

/**
 * 월별 조회. 응답의 각 날짜에 이벤트 상세(선물명·금액·이유)가 모두 들어 있어
 * '이날의 마음' 패널까지 추가 호출 없이 그릴 수 있다.
 */
export const getCalendar = ({ year, month }: { year: number; month: number }) =>
  apiClient.get<GetCalendarResponseT>(API.CALENDAR, { year, month });
