import type { RecommendationT } from './recommendation';
import type { GiftRecordT } from './record';

export type DashboardStatsT = {
  totalRecords: number;
  totalRecordsText: string;
  recordsThisMonth: number;
  recordsThisMonthText: string;
  totalPeople: number;
  totalPeopleText: string;
  upcomingReminders: number;
  upcomingRemindersText: string;
  daysToNearestReminder: number | null;
  nearestReminderText: string;
};

export type AgentInsightT = {
  type: 'BIRTHDAY' | 'REMINDER';
  personId: number;
  person: string;
  date: string;
  daysLeft: number;
  title: string;
  message: string;
  monthLabel: string;
  dayLabel: number;
  caption: string;
};

export type DashboardT = {
  today: string;
  stats: DashboardStatsT;
  /** 다가오는 일정이 없으면 null — 에이전트 카드를 렌더하지 않는다 */
  agentInsight: AgentInsightT | null;
  recentRecords: GiftRecordT[];
  recommendations: RecommendationT[];
};
