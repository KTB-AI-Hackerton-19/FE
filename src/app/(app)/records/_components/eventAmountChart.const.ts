import type { GiftRecordT } from '@/types/record';

/**
 * 금액 구간은 순서가 있는 값이라 categorical 색이 아니라 단일 색조 명도 램프를 쓴다.
 * 명도 0.90 → 0.39 로 단조 감소하고, 인접 색 ΔE 는 정상시각 15.9 / 적록색약 15.4 다.
 */
export const AMOUNT_BUCKETS = [
  { label: '5만원 이하', max: 50_000, color: '#fad3c6' },
  { label: '5만~10만원', max: 100_000, color: '#e88a6c' },
  { label: '10만~20만원', max: 200_000, color: '#c14e2c' },
  { label: '20만원 초과', max: Infinity, color: '#75291a' },
] as const;

/**
 * 금액 구간은 서버 필터 파라미터가 없어 여기서 거른다.
 * 이 경우에만 예외적으로 클라이언트 필터링을 쓴다 (차트용으로 전량을 이미 받아 둔다).
 */
export const isInAmountBucket = (amount: number, label: string) => {
  const index = AMOUNT_BUCKETS.findIndex(bucket => bucket.label === label);
  if (index === -1) return true;

  const min = index === 0 ? -Infinity : AMOUNT_BUCKETS[index - 1].max;
  return amount > min && amount <= AMOUNT_BUCKETS[index].max;
};

export type AmountSliceT = {
  label: string;
  color: string;
  /** 구간 합계 금액 — 조각 크기의 기준 */
  amount: number;
  count: number;
  ratio: number;
};

/** 기록을 금액 구간으로 묶는다. 표시용 price 가 아니라 계산용 amount 를 쓴다. */
export const toAmountSlices = (records: GiftRecordT[]): AmountSliceT[] => {
  const totals = AMOUNT_BUCKETS.map(() => ({ amount: 0, count: 0 }));

  records.forEach(record => {
    const index = AMOUNT_BUCKETS.findIndex(bucket => record.amount <= bucket.max);
    if (index === -1) return;

    totals[index].amount += record.amount;
    totals[index].count += 1;
  });

  const total = totals.reduce((sum, item) => sum + item.amount, 0);
  if (total === 0) return [];

  return AMOUNT_BUCKETS.map((bucket, index) => ({
    label: bucket.label,
    color: bucket.color,
    amount: totals[index].amount,
    count: totals[index].count,
    ratio: totals[index].amount / total,
  })).filter(slice => slice.amount > 0);
};