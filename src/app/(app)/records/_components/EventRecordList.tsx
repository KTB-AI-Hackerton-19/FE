'use client';

import { Gift, PieChart, Search, X } from 'lucide-react';
import { useState } from 'react';

import EmptyState from '@/components/common/empty-state';
import InfiniteScrollSentinel from '@/components/common/infinite-scroll-sentinel';
import SelectionToolbar from '@/components/common/selection-toolbar';
import { useAppUi } from '@/hooks/useAppUi';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useGetAllGiftRecords } from '@/hooks/useGetAllGiftRecords';
import { useGetEventCategories } from '@/hooks/useGetEventCategories';
import { useGetInfiniteGiftRecords } from '@/hooks/useGetInfiniteGiftRecords';
import { useMediaQuery } from '@/hooks/useMediaQuery';

import { useRecordSelection } from '../_hooks/useRecordSelection';
import EventAmountChart from './EventAmountChart';
import RecordRows from './RecordRows';
import SortToggle from './SortToggle';
import type { SortKeyT } from './SortToggle';
import { isInAmountBucket } from './eventAmountChart.const';

/** 칩 하나가 곧 필터 하나. null 은 '전체' */
const ALL = null;

function EventRecordList() {
  const { eventCategories } = useGetEventCategories();

  /** null 이면 모든 경조사를 함께 본다. 값이 있으면 유형 라벨('결혼' 등) */
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const { openRecordModal } = useAppUi();

  const [isChartOpen, setIsChartOpen] = useState(false);
  const [sort, setSort] = useState<SortKeyT>('latest');
  const selection = useRecordSelection();

  // 무한 스크롤이라 화면에 불러온 건 일부다 — 전체선택은 남은 페이지까지 불러와서 고른다.
  const handleToggleAll = async () => {
    // 금액대를 고른 동안에는 전량을 이미 들고 있어 그 안에서만 고른다.
    if (bucketRecords) {
      selection.selectAll(
        selection.selectedIds.length === bucketRecords.length
          ? []
          : bucketRecords.map(record => record.id)
      );
      return;
    }

    if (selection.selectedIds.length === giftRecordsTotal) {
      selection.clear();
      return;
    }

    selection.selectAll(await loadAllGiftRecordIds());
  };
  /** 파이 조각을 누르면 그 금액대만 본다. 여러 개 고를 수 있다 */
  const [bucketLabels, setBucketLabels] = useState<string[]>([]);
  const debouncedKeyword = useDebouncedValue(keyword);

  // 데스크톱은 차트를 늘 펼쳐 두고, 자리가 좁은 모바일에서만 접었다 편다.
  const isCompact = useMediaQuery('(max-width: 1023px)');
  const showChart = !isCompact || isChartOpen;

  const serverQuery = {
    // 유형을 고르면 그 유형만, 아니면 경조사 전체.
    kind: activeCategory ?? 'EVENT',
    // 저장하지 않고 닫은 AI 초안(DRAFT)이 목록에 섞이면 안 된다.
    status: 'CONFIRMED',
    personName: debouncedKeyword.trim() || undefined,
  } as const;

  const {
    giftRecords,
    loadAllGiftRecordIds,
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

  // 유형을 고르거나 이름으로 찾는 중이면 결과가 비어도 '기록이 없다'가 아니다.
  const isFiltered = activeCategory !== ALL || Boolean(debouncedKeyword.trim());

  if (!isGetGiftRecordsPending && !isFiltered && giftRecordsTotal === 0) {
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
      <div className="flex items-center gap-2 overflow-auto pb-[5px]">
        {[null, ...eventCategories].map(category => {
          // 기록의 eventCategory 는 코드(WEDDING)가 아니라 한글 라벨로 내려온다.
          const value = category?.label ?? ALL;

          return (
            <button
              key={category?.name ?? '전체'}
              type="button"
              onClick={() => setActiveCategory(value)}
              aria-pressed={value === activeCategory}
              className={`flex shrink-0 cursor-pointer items-center gap-1 rounded-[20px] border px-3.5 py-2 text-[10px] whitespace-nowrap transition ${
                value === activeCategory
                  ? 'border-forest bg-forest text-white'
                  : 'border-line bg-white text-[#7c7770]'
              }`}
            >
              {category ? <span>{category.emoji}</span> : null}
              {category?.label ?? '전체'}
            </button>
          );
        })}
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
      <SelectionToolbar
        isSelecting={selection.isSelecting}
        selectedCount={selection.selectedIds.length}
        totalCount={bucketRecords ? bucketRecords.length : giftRecordsTotal}
        onStart={selection.start}
        onToggleAll={handleToggleAll}
        onDelete={selection.openConfirm}
        onCancel={selection.cancel}
        className="my-[25px] mb-[11px]"
        leading={
          /* 칩이 늘어도 줄바꿈으로 높이가 변하지 않도록 가로로 흘린다. */
          <div className="flex min-w-0 items-center gap-2 overflow-x-auto">
            <b className="flex shrink-0 items-center gap-1.5">
              <Gift size={13} className="shrink-0 text-subtle" />
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
        }
        trailing={
          <>
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
          </>
        }
      />

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
        emptyDescription={debouncedKeyword.trim() ? undefined : '받은 마음을 기록하러 가볼까요?'}
        canRecord={!debouncedKeyword.trim()}
        showCategory={activeCategory === null}
        selection={selection}
      />

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
