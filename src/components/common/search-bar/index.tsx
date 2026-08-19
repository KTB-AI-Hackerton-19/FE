'use client';

import { Search, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { recordEmojiStyles } from '@/components/common/record-card/recordCard.style';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useGetSearch } from '@/hooks/useGetSearch';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { formatDate } from '@/utils/formatDate';

function SearchBar() {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const debouncedKeyword = useDebouncedValue(keyword);
  const { searchData, isGetSearchFetching } = useGetSearch(debouncedKeyword);

  // 모바일은 로고에 자리를 내주느라 검색창이 좁아 문구를 줄인다.
  const isCompact = useMediaQuery('(max-width: 1023px)');

  // 바깥을 누르면 결과 패널을 닫는다.
  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const close = () => {
    setIsOpen(false);
    setKeyword('');
  };

  const people = searchData?.people ?? [];
  const records = searchData?.records ?? [];
  const hasKeyword = debouncedKeyword.trim().length > 0;
  const isEmpty = hasKeyword && !isGetSearchFetching && people.length === 0 && records.length === 0;

  return (
    <div ref={containerRef} className="relative mr-auto w-full min-w-0 lg:w-[420px]">
      <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white px-[13px] py-2.5 text-subtle">
        <Search size={18} />
        <input
          value={keyword}
          onChange={event => {
            setKeyword(event.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={event => event.key === 'Escape' && close()}
          className="w-full min-w-0 border-0 text-[13px] text-ink outline-0"
          placeholder={isCompact ? '사람·선물 검색' : '사람 또는 선물을 검색해보세요'}
        />
        {keyword ? (
          <button
            type="button"
            onClick={close}
            aria-label="검색어 지우기"
            className="cursor-pointer text-subtle hover:text-ink"
          >
            <X size={15} />
          </button>
        ) : null}
      </div>

      {isOpen && hasKeyword ? (
        <div className="absolute top-[calc(100%+8px)] left-0 z-20 max-h-[420px] w-full overflow-auto rounded-2xl border border-line bg-white p-2 shadow-[0_16px_40px_#4b3a3220]">
          {isEmpty ? (
            <p className="px-2 py-6 text-center text-[11px] text-muted">검색 결과가 없어요.</p>
          ) : null}

          {people.length > 0 ? (
            <>
              <p className="px-2 pt-1.5 pb-1 text-[9px] font-bold text-subtle">사람</p>
              {people.map(person => (
                <Link
                  key={person.id}
                  href={`/people/${person.id}`}
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-cream"
                >
                  <span className="grid size-8 place-items-center rounded-lg bg-[#f5e3dd] text-[13px] text-[#b86152]">
                    {person.name[0]}
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block text-[12px]">{person.name}</b>
                    <small className="text-[10px] text-muted">
                      {person.relation} · 마음 {person.giftCount}개
                    </small>
                  </span>
                </Link>
              ))}
            </>
          ) : null}

          {records.length > 0 ? (
            <>
              <p className="px-2 pt-2.5 pb-1 text-[9px] font-bold text-subtle">마음 기록</p>
              {records.map(record => (
                <Link
                  key={record.id}
                  href={record.personId ? `/people/${record.personId}` : '/records'}
                  onClick={close}
                  className="flex items-center gap-2.5 rounded-xl px-2 py-2 hover:bg-cream"
                >
                  <span className={recordEmojiStyles({ accent: record.color, size: 'sm' })}>
                    {record.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <b className="block truncate text-[12px]">{record.gift}</b>
                    <small className="text-[10px] text-muted">
                      {record.person} · {formatDate(record.date)}
                    </small>
                  </span>
                  <span className="text-[11px] text-[#dc725f]">{record.price}</span>
                </Link>
              ))}
            </>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default SearchBar;
