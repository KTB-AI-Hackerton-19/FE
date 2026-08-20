'use client';

import { PieChart, Plus, Search, X } from 'lucide-react';
import { useState } from 'react';

import CategoryAddModal from '@/components/common/category-add-modal';
import EmptyState from '@/components/common/empty-state';
import InfiniteScrollSentinel from '@/components/common/infinite-scroll-sentinel';
import { recordEmojiStyles } from '@/components/common/record-card/recordCard.style';
import { useAppUi } from '@/hooks/useAppUi';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useGetAllGiftRecords } from '@/hooks/useGetAllGiftRecords';
import { useGetCategories } from '@/hooks/useGetCategories';
import { useGetInfiniteGiftRecords } from '@/hooks/useGetInfiniteGiftRecords';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { formatAmount } from '@/utils/formatAmount';
import { formatDate } from '@/utils/formatDate';

import EventAmountChart from './EventAmountChart';
import RecordRows from './RecordRows';
import SortToggle from './SortToggle';
import type { SortKeyT } from './SortToggle';
import { isInAmountBucket } from './eventAmountChart.const';

const kindBadgeClass = (kind: string) =>
  kind === 'CONDOLENCE' ? 'bg-blue-soft text-[#5b6f8a]' : 'bg-gold-soft text-[#8a7433]';

function EventRecordList() {
  const { categoriesData: events, isGetCategoriesPending } = useGetCategories({ kind: 'EVENT' });

  /** null 이면 모든 경조사를 함께 본다 */
  const [activeId, setActiveId] = useState<number | null>(null);
  const [keyword, setKeyword] = useState('');
  const { openRecordModal } = useAppUi();

  const [isChartOpen, setIsChartOpen] = useState(false);
  const [isEventAddOpen, setIsEventAddOpen] = useState(false);
  const [sort, setSort] = useState<SortKeyT>('latest');
  /** 파이 조각을 누르면 그 금액대만 본다. 여러 개 고를 수 있다 */
  const [bucketLabels, setBucketLabels] = useState<string[]>([]);
  const debouncedKeyword = useDebouncedValue(keyword);

  // 데스크톱은 차트를 늘 펼쳐 두고, 자리가 좁은 모바일에서만 접었다 편다.
  const isCompact = useMediaQuery('(max-width: 1023px)');
  const showChart = !isCompact || isChartOpen;

  const serverQuery = {
    kind: 'EVENT',
    categoryId: activeId ?? undefined,
    personName: debouncedKeyword.trim() || undefined,
  } as const;

  const {
    giftRecords,
    giftRecordsTotal,
    fetchNextGiftRecordsPage,
    hasNextGiftRecordsPage,
    isFetchingNextGiftRecordsPage,
    isGetGiftRecordsPending,
  } = useGetInfiniteGiftRecords({ ...serverQuery, sort });

  // 차트는 비율이 맞아야 해서 목록의 첫 페이지가 아니라 전량을 따로 모아 온다.
  const { allGiftRecords, allGiftRecordsTotal } = useGetAllGiftRecords(serverQuery, showChart);

  // 금액 구간은 서버 필터가 없다. 전량을 이미 받아 둔 상태에서만 거른다.
  const bucketRecords = bucketLabels.length
    ? allGiftRecords.filter(record =>
        bucketLabels.some(label => isInAmountBucket(record.amount, label))
      )
    : null;

  const handleToggleBucket = (label: string) =>
    setBucketLabels(current =>
      current.includes(label) ? current.filter(item => item !== label) : [...current, label]
    );

  const records = bucketRecords ?? giftRecords;

  // 차트를 닫으면 금액대 필터를 풀 수단이 사라지므로 함께 해제한다.
  const handleToggleChart = () => {
    if (isChartOpen) setBucketLabels([]);
    setIsChartOpen(!isChartOpen);
  };

  // 서버가 행사별 합계만 내려줘 전체 합계는 여기서 더한다 (표시용 price 가 아니라 계산용 amount 를 쓴다).
  const totalPeople = events.reduce((sum, event) => sum + event.recordCount, 0);
  const totalAmount = events.reduce((sum, event) => sum + event.totalAmount, 0);

  if (!isGetCategoriesPending && events.length === 0) {
    return (
      <EmptyState
        title="아직 기록된 마음이 없어요"
        description="마음을 기록하면 행사별로 모아서 보여드릴게요."
        actionLabel="마음 기록하기"
        onAction={openRecordModal}
      />
    );
  }

  return (
    <>
      <div className="grid gap-2.5 lg:grid-cols-2">
        <button
          type="button"
          onClick={() => setActiveId(null)}
          aria-pressed={activeId === null}
          className={`flex cursor-pointer items-center gap-3 rounded-[17px] border p-3.5 text-left transition sm:p-4 lg:col-span-2 ${
            activeId === null
              ? 'border-ink bg-[#f6f1ea] shadow-[0_8px_20px_#4b3a3212]'
              : 'border-line bg-[#faf7f2] hover:bg-[#f6f1ea]'
          }`}
        >
          <div className="grid size-[43px] shrink-0 place-items-center rounded-[14px] bg-[#f1ede8] text-[20px]">
            🗂️
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold">전체</h3>
            <p className="mt-1 text-[11px] text-[#716b64]">
              {totalPeople}명 · {formatAmount(totalAmount)}
            </p>
          </div>
          <span className="shrink-0 text-[10px] text-subtle">행사 {events.length}개</span>
        </button>

        {events.map(event => (
          <button
            key={event.id}
            type="button"
            onClick={() => setActiveId(event.id)}
            aria-pressed={event.id === activeId}
            className={`flex cursor-pointer items-center gap-3 rounded-[17px] border bg-white p-3.5 text-left transition sm:p-4 ${
              event.id === activeId
                ? 'border-ink shadow-[0_8px_20px_#4b3a3212]'
                : 'border-line hover:bg-[#fdfaf7]'
            }`}
          >
            <div className={recordEmojiStyles({ accent: event.color, size: 'sm' })}>
              {event.emoji}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <h3 className="truncate text-sm font-bold">{event.name}</h3>
                <span
                  className={`shrink-0 rounded-md px-1.5 py-0.5 text-[9px] font-bold ${kindBadgeClass(event.kind)}`}
                >
                  {event.kindLabel}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-[#716b64]">
                {event.recordCount}명 · {formatAmount(event.totalAmount)}
              </p>
            </div>

            <span className="shrink-0 text-[10px] text-subtle">
              {formatDate(event.displayDate)}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setIsEventAddOpen(true)}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-[17px] border border-dashed border-[#d7c7bc] bg-[#fff7f2] p-3.5 text-[11px] font-bold text-[#cf6e5d] transition hover:bg-[#ffefe6] sm:p-4"
        >
          <Plus size={16} /> 행사 추가
        </button>
      </div>

      <label className="mt-3.5 flex items-center gap-2.5 rounded-[14px] border border-line bg-white px-[13px] py-3 text-subtle">
        <Search size={17} />
        <input
          value={keyword}
          onChange={changeEvent => setKeyword(changeEvent.target.value)}
          placeholder="이 목록에서 이름으로 찾기"
          className="w-full min-w-0 border-0 text-[12px] text-ink outline-0"
        />
      </label>

      {/* 금액대 칩이 생겨도 줄 높이가 바뀌지 않도록 높이를 고정한다 — 아래 목록이 밀리면 덜컹거린다. */}
      <div className="my-[25px] mb-[11px] flex min-h-[28px] items-center justify-between gap-3 text-[11px]">
        {/* 칩이 늘어도 줄바꿈으로 높이가 변하지 않도록 가로로 흘린다. */}
        <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
          <b className="shrink-0">
            {bucketRecords ? bucketRecords.length : giftRecordsTotal}개의 마음
          </b>
          {bucketLabels.map(label => (
            <button
              key={label}
              type="button"
              onClick={() => handleToggleBucket(label)}
              aria-label={`${label} 필터 해제`}
              className="flex h-[22px] shrink-0 cursor-pointer items-center gap-1 rounded-full bg-[#f3ece6] px-2.5 text-[10px] font-bold text-[#7c6a5e] hover:text-ink"
            >
              {label}
              <X size={12} />
            </button>
          ))}
        </div>
        <div className="flex shrink-0 items-center gap-3 pl-3">
          {isCompact ? (
            <button
              type="button"
              onClick={handleToggleChart}
              aria-expanded={isChartOpen}
              className="flex cursor-pointer items-center gap-1 text-[#7c7770] hover:text-ink"
            >
              <PieChart size={14} />
              {isChartOpen ? '차트 닫기' : '금액 비중 보기'}
            </button>
          ) : null}
          <SortToggle value={sort} onChange={setSort} />
        </div>
      </div>

      {showChart ? (
        <EventAmountChart
          records={allGiftRecords}
          totalElements={allGiftRecordsTotal}
          selectedLabels={bucketLabels}
          onToggle={handleToggleBucket}
        />
      ) : null}

      <RecordRows
        records={records}
        isPending={isGetGiftRecordsPending}
        emptyTitle={
          debouncedKeyword.trim() ? '그 이름으로 찾은 기록이 없어요' : '아직 기록된 마음이 없어요'
        }
        emptyDescription={
          debouncedKeyword.trim() ? undefined : '받은 마음을 기록하러 가볼까요?'
        }
        canRecord={!debouncedKeyword.trim()}
        showCategory={activeId === null}
      />

      {isEventAddOpen ? (
        <CategoryAddModal
          kinds={[
            { key: 'CELEBRATION', label: '경사' },
            { key: 'CONDOLENCE', label: '조사' },
          ]}
          title="새 행사 추가"
          nameLabel="행사 이름"
          namePlaceholder="내 결혼식"
          withDate
          onCreated={created => setActiveId(created.id)}
          onClose={() => setIsEventAddOpen(false)}
        />
      ) : null}

      {/* 금액대를 고른 동안에는 전량을 이미 들고 있어 더 불러올 것이 없다. */}
      {bucketRecords ? null : (
        <InfiniteScrollSentinel
          hasMore={hasNextGiftRecordsPage}
          isFetching={isFetchingNextGiftRecordsPage}
          onReach={fetchNextGiftRecordsPage}
        />
      )}
    </>
  );
}

export default EventRecordList;
