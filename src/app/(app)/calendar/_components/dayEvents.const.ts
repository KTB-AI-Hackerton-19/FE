import type { CalendarEventT } from '@/types/calendar';
import type { EventCategoryT } from '@/types/eventCategory';

/** 같은 행사에 온 사람들을 유형 하나로 묶은 것 */
export type EventGroupT = {
  /** 행사 유형 라벨 ('결혼'). 목록 화면의 필터 값과 같다 */
  label: string;
  emoji: string;
  peopleCount: number;
  totalAmount: number;
};

type SplitResultT = {
  /** 유형별로 묶은 경조사 */
  eventGroups: EventGroupT[];
  /** 선물·답례 알림처럼 한 건씩 보여줄 것들 */
  singles: CalendarEventT[];
};

/**
 * 경조사는 한 행사에 수십 명이 오므로 사람마다 한 줄씩 그리면 목록이 넘친다.
 * 유형('결혼')으로 묶어 한 줄로 접고, 나머지는 그대로 둔다.
 *
 * 달력 응답에는 경조사 표시가 따로 없고 category 에 유형 라벨이 담겨 온다 —
 * 서버가 정한 7종 목록과 대조해 가른다.
 */
export const splitDayEvents = (
  events: CalendarEventT[],
  eventCategories: EventCategoryT[]
): SplitResultT => {
  const labels = new Set(eventCategories.map(category => category.label));
  const groups = new Map<string, EventGroupT>();
  const singles: CalendarEventT[] = [];

  events.forEach(event => {
    // 답례 알림은 사람마다 챙겨야 하므로 묶지 않는다.
    if (event.type !== 'RECEIVED' || !labels.has(event.category)) {
      singles.push(event);
      return;
    }

    const group = groups.get(event.category);

    if (group) {
      group.peopleCount += 1;
      group.totalAmount += event.amount ?? 0;
      return;
    }

    groups.set(event.category, {
      label: event.category,
      emoji: event.emoji,
      peopleCount: 1,
      totalAmount: event.amount ?? 0,
    });
  });

  return { eventGroups: [...groups.values()], singles };
};
