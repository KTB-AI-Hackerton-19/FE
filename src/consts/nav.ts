import { CalendarDays, Gift, Home, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Route } from 'next';

export type NavItemT = {
  href: Route;
  label: string;
  shortLabel: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItemT[] = [
  { href: '/', label: '홈', shortLabel: '홈', icon: Home },
  { href: '/records', label: '마음 기록', shortLabel: '기록', icon: Gift },
  { href: '/people', label: '사람들', shortLabel: '사람', icon: Users },
  { href: '/calendar', label: '마음 캘린더', shortLabel: '달력', icon: CalendarDays },
];
