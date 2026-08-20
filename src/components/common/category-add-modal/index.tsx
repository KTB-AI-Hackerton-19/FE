'use client';

import { Check } from 'lucide-react';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal';
import { useAppUi } from '@/hooks/useAppUi';
import { usePostCategory } from '@/hooks/useCategoryMutations';
import type { AccentT, CategoryT } from '@/types/category';

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
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  onCreated: (created: CategoryT) => void;
  onClose: () => void;
};

/** 기록 도중 선물 카테고리를 새로 만들고 바로 고르기 위한 작은 폼. */
function CategoryAddModal({
  title,
  nameLabel,
  namePlaceholder,
  onCreated,
  onClose,
}: CategoryAddModalProps) {
  const { showToast } = useAppUi();
  const { postCategoryMutation, isPostCategoryPending } = usePostCategory();

  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState<AccentT>('blue');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    postCategoryMutation(
      { name: name.trim(), emoji: emoji.trim() || undefined, color },
      {
        onSuccess: created => {
          showToast(`'${created.name}'을(를) 추가했어요`);
          onCreated(created);
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
