'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import DatePicker from '@/components/common/date-picker';
import Modal from '@/components/common/modal';
import { useAppUi } from '@/hooks/useAppUi';
import { usePostCategory } from '@/hooks/useCategoryMutations';
import type { AccentT, CategoryT, KindT } from '@/types/category';
import { getTodayDateKey } from '@/utils/formatDate';

const COLORS: AccentT[] = ['mint', 'pink', 'blue', 'gold'];
const COLOR_CLASS: Record<AccentT, string> = {
  mint: 'bg-mint-soft',
  pink: 'bg-pink-soft',
  blue: 'bg-blue-soft',
  gold: 'bg-gold-soft',
};

const fieldClass =
  'rounded-[10px] border border-line bg-white p-2.5 text-[12px] outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]';

type CategoryAddModalProps = {
  /** 고를 수 있는 분류. 하나뿐이면 선택 UI 없이 그 값으로 만든다 */
  kinds: readonly { key: KindT; label: string }[];
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  /**
   * 날짜 칸을 띄울지. 서버 카테고리에는 날짜 필드가 없어서,
   * 여기서 고른 날짜는 이어서 만드는 기록의 '받은 날짜'로 넘긴다.
   */
  withDate?: boolean;
  onCreated: (created: CategoryT, date: string) => void;
  onClose: () => void;
};

/** 기록 도중 카테고리(또는 행사)를 새로 만들고 바로 고르기 위한 작은 폼. */
function CategoryAddModal({
  kinds,
  title,
  nameLabel,
  namePlaceholder,
  withDate = false,
  onCreated,
  onClose,
}: CategoryAddModalProps) {
  const { showToast } = useAppUi();
  const { postCategoryMutation, isPostCategoryPending } = usePostCategory();

  const [kind, setKind] = useState<KindT>(kinds[0].key);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState<AccentT>('blue');
  const [eventDate, setEventDate] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    postCategoryMutation(
      {
        name: name.trim(),
        emoji: emoji.trim() || undefined,
        color,
        kind,
        eventDate: eventDate || undefined,
      },
      {
        onSuccess: created => {
          showToast(`'${created.name}'을(를) 추가했어요`);
          onCreated(created, created.eventDate ?? getTodayDateKey());
          onClose();
        },
        onError: error =>
          showToast(error instanceof ApiError ? error.message : '추가하지 못했어요'),
      }
    );
  };

  return (
    <Modal onClose={onClose} size="sm" hideClose>
      <h2 className="mb-5 font-title font-bold text-[19px]">{title}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {kinds.length > 1 ? (
          <div className="flex gap-1.5">
            {kinds.map(option => (
              <button
                key={option.key}
                type="button"
                onClick={() => setKind(option.key)}
                aria-pressed={kind === option.key}
                className={`h-9 flex-1 cursor-pointer rounded-[10px] border text-[11px] font-bold transition ${
                  kind === option.key
                    ? 'border-coral-soft bg-coral-soft text-coral-deep'
                    : 'border-line bg-white text-[#a5a09a] hover:border-[#d7c7bc] hover:text-[#7c7770]'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        ) : null}

        <div className="flex gap-2">
          <input
            value={emoji}
            onChange={event => setEmoji(event.target.value)}
            placeholder="🎁"
            maxLength={4}
            aria-label="이모지"
            className={`${fieldClass} w-14 text-center`}
          />
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder={namePlaceholder}
            aria-label={nameLabel}
            className={`${fieldClass} min-w-0 flex-1`}
          />
        </div>

        <div className="flex gap-2">
          {COLORS.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setColor(option)}
              aria-label={`${option} 색`}
              aria-pressed={color === option}
              className={`grid h-9 flex-1 cursor-pointer place-items-center rounded-[10px] border ${
                color === option ? 'border-coral' : 'border-line'
              } ${COLOR_CLASS[option]}`}
            >
              {color === option ? <Check size={13} className="text-ink" /> : null}
            </button>
          ))}
        </div>

        {withDate ? (
          <label className="flex flex-col gap-[5px]">
            <span className="text-[10px] font-bold text-[#817b74]">행사 날짜</span>
            <DatePicker
              value={eventDate}
              onChange={setEventDate}
              placeholder="선택 안 함"
              clearable
              className={fieldClass}
            />
            <span className="text-[9px] text-subtle">선택하지 않으면 오늘 날짜로 기록해요.</span>
          </label>
        ) : null}

        <div className="mt-2 flex gap-2">
          <Button variant="ghost" full onClick={onClose} disabled={isPostCategoryPending}>
            취소
          </Button>
          <Button type="submit" full disabled={isPostCategoryPending || !name.trim()}>
            {isPostCategoryPending ? '추가 중…' : '추가하기'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryAddModal;
