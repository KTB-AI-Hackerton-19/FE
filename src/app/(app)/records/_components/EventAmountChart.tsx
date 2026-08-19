'use client';

import { useState } from 'react';

import type { GiftRecordT } from '@/types/record';
import { formatAmount } from '@/utils/formatAmount';

import { toAmountSlices } from './eventAmountChart.const';

const RADIUS = 54;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
/** 조각 사이 여백 — 색이 붙어 보이지 않게 표면색을 2px 남긴다 */
const GAP = 2;

const formatPercent = (ratio: number) => `${(ratio * 100).toFixed(1)}%`;

type EventAmountChartProps = {
  records: GiftRecordT[];
  /** 서버 전체 건수 — 불러온 목록보다 많으면 일부만 집계된 것이다 */
  totalElements: number;
  /** 목록을 좁히고 있는 금액대들. 조각을 다시 누르면 해제된다 */
  selectedLabels: string[];
  onToggle: (label: string) => void;
};

function EventAmountChart({
  records,
  totalElements,
  selectedLabels,
  onToggle,
}: EventAmountChartProps) {
  const [hoverLabel, setHoverLabel] = useState<string | null>(null);

  // 마우스를 올린 조각이 우선, 없으면 골라 둔 조각들을 부각한다.
  const isDimmed = (label: string) => {
    if (hoverLabel) return hoverLabel !== label;
    return selectedLabels.length > 0 && !selectedLabels.includes(label);
  };

  // 선택 표시로 굵기나 테두리를 더하면 행이 흔들리거나 옆 행과 붙어 보인다 — 배경색만 바꾼다.
  const legendClass = (label: string) => {
    if (selectedLabels.includes(label)) return 'bg-[#f0e7df]';
    return hoverLabel === label ? 'bg-[#faf6f2]' : '';
  };

  const slices = toAmountSlices(records);
  if (slices.length === 0) return null;

  const total = slices.reduce((sum, slice) => sum + slice.amount, 0);
  const totalCount = slices.reduce((sum, slice) => sum + slice.count, 0);
  const isPartial = totalElements > records.length;

  // 가운데 표시 — 올린 조각 > 고른 조각(들) > 전체 합계 순으로 보여 준다.
  const hovered = slices.find(slice => slice.label === hoverLabel);
  const picked = slices.filter(slice => selectedLabels.includes(slice.label));
  const focused = hovered ? [hovered] : picked;

  const focusedAmount = focused.reduce((sum, slice) => sum + slice.amount, 0);
  const focusedCount = focused.reduce((sum, slice) => sum + slice.count, 0);

  const centerLabel = (() => {
    if (focused.length === 0) return '합계';
    return focused.length === 1 ? focused[0].label : `금액대 ${focused.length}개`;
  })();

  // 조각의 시작 위치는 앞 조각들의 누적 길이다 — 렌더 중 변수를 고쳐 쓰지 않도록 미리 계산한다.
  const arcs = slices.map((slice, index) => {
    const startRatio = slices.slice(0, index).reduce((sum, item) => sum + item.ratio, 0);

    return {
      ...slice,
      length: Math.max(CIRCUMFERENCE * slice.ratio - GAP, 0),
      dashOffset: -CIRCUMFERENCE * startRatio,
    };
  });

  return (
    <section className="mb-4 rounded-[17px] border border-line bg-white p-5 sm:p-6">
      <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
        <div className="relative shrink-0">
          <svg
            width="140"
            height="140"
            viewBox="0 0 140 140"
            role="img"
            aria-label="금액 구간별 비중"
          >
            <g transform="rotate(-90 70 70)">
              {arcs.map(arc => (
                <circle
                  key={arc.label}
                  cx="70"
                  cy="70"
                  r={RADIUS}
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="22"
                  strokeDasharray={`${arc.length} ${CIRCUMFERENCE - arc.length}`}
                  strokeDashoffset={arc.dashOffset}
                  opacity={isDimmed(arc.label) ? 0.3 : 1}
                  onMouseEnter={() => setHoverLabel(arc.label)}
                  onMouseLeave={() => setHoverLabel(null)}
                  onClick={() => onToggle(arc.label)}
                  className="cursor-pointer transition-opacity"
                >
                  <title>{`${arc.label} · ${formatAmount(arc.amount)}`}</title>
                </circle>
              ))}
            </g>
          </svg>

          {/* 줄 수가 바뀌면 가운데 정렬이 다시 잡히며 글자가 튄다 — 항상 세 줄을 그린다. */}
          <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
            <div>
              <span className="block text-[10px] text-subtle">{centerLabel}</span>
              <b className="mt-0.5 block text-[13px]">
                {formatAmount(focused.length === 0 ? total : focusedAmount)}
              </b>
              <span className="mt-0.5 block text-[10px] text-subtle">
                {focused.length === 0
                  ? `${totalCount}명`
                  : `${focusedCount}명 · ${formatPercent(focusedAmount / total)}`}
              </span>
            </div>
          </div>
        </div>

        {/* 색만으로 구분되지 않도록 값과 이름을 함께 적는다 */}
        <ul className="grid w-full min-w-0 flex-1 gap-1">
          {slices.map(slice => (
            <li key={slice.label}>
              <button
                type="button"
                onMouseEnter={() => setHoverLabel(slice.label)}
                onMouseLeave={() => setHoverLabel(null)}
                onClick={() => onToggle(slice.label)}
                aria-pressed={selectedLabels.includes(slice.label)}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-[11px] transition ${legendClass(slice.label)}`}
              >
                <span
                  className="size-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: slice.color }}
                />
                <span className="min-w-0 flex-1 truncate">{slice.label}</span>
                <span className="shrink-0 text-subtle">{slice.count}명</span>
                <b className="w-[86px] shrink-0 text-right">{formatAmount(slice.amount)}</b>
                <span className="w-[42px] shrink-0 text-right text-subtle">
                  {formatPercent(slice.ratio)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {isPartial ? (
        <p className="mt-3 text-[10px] text-subtle">
          최근 {records.length}건 기준이에요 (전체 {totalElements}건).
        </p>
      ) : null}
    </section>
  );
}

export default EventAmountChart;
