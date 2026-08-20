'use client';

import { Settings2 } from 'lucide-react';
import { useState } from 'react';

import InfiniteScrollSentinel from '@/components/common/infinite-scroll-sentinel';
import { useGetCategories } from '@/hooks/useGetCategories';
import { useGetInfiniteGiftRecords } from '@/hooks/useGetInfiniteGiftRecords';

import CategoryManagerModal from './CategoryManagerModal';
import RecordRows from './RecordRows';
import SortToggle from './SortToggle';
import type { SortKeyT } from './SortToggle';

const ALL = '전체';

function GiftRecordList() {
  const [category, setCategory] = useState(ALL);
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false);
  const [sort, setSort] = useState<SortKeyT>('latest');

  const { categoriesData } = useGetCategories({ kind: 'GIFT' });

  // 필터링은 서버에서 처리한다 — 전체를 받아 클라이언트에서 거르지 않는다.
  const {
    giftRecords,
    giftRecordsTotal,
    fetchNextGiftRecordsPage,
    hasNextGiftRecordsPage,
    isFetchingNextGiftRecordsPage,
    isGetGiftRecordsPending,
  } = useGetInfiniteGiftRecords({
    kind: 'GIFT',
    // '전체'는 카테고리 필터를 걸지 않는다는 뜻이다.
    category: category === ALL ? undefined : category,
    sort,
  });
  const chips = [
    ALL,
    ...categoriesData.filter(item => item.recordCount > 0).map(item => item.name),
  ];

  return (
    <>
      <div className="flex items-center gap-2 overflow-auto pb-[5px]">
        {chips.map(name => (
          <button
            key={name}
            type="button"
            onClick={() => setCategory(name)}
            className={`cursor-pointer rounded-[20px] border px-3.5 py-2 text-[10px] whitespace-nowrap transition ${
              category === name
                ? 'border-forest bg-forest text-white'
                : 'border-line bg-white text-[#7c7770]'
            }`}
          >
            {name}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setIsCategoryManagerOpen(true)}
          className="flex shrink-0 cursor-pointer items-center gap-1 rounded-[20px] border border-dashed border-[#d7c7bc] bg-white px-3 py-2 text-[10px] whitespace-nowrap text-[#a5988f] hover:text-ink"
        >
          <Settings2 size={13} /> 카테고리
        </button>
      </div>

      {/* 경조사 탭과 같은 줄 구성 — 왼쪽 건수, 오른쪽 정렬 */}
      <div className="my-[25px] mb-[11px] flex min-h-[28px] items-center justify-between gap-3 text-[11px]">
        <b className="min-w-0 truncate">{giftRecordsTotal}개의 마음</b>
        <SortToggle value={sort} onChange={setSort} />
      </div>

      <RecordRows
        records={giftRecords}
        isPending={isGetGiftRecordsPending}
        emptyTitle="아직 기록된 마음이 없어요"
        emptyDescription="받은 마음을 기록하러 가볼까요?"
        canRecord
      />

      <InfiniteScrollSentinel
        hasMore={hasNextGiftRecordsPage}
        isFetching={isFetchingNextGiftRecordsPage}
        onReach={fetchNextGiftRecordsPage}
      />

      {isCategoryManagerOpen ? (
        <CategoryManagerModal onClose={() => setIsCategoryManagerOpen(false)} />
      ) : null}
    </>
  );
}

export default GiftRecordList;
