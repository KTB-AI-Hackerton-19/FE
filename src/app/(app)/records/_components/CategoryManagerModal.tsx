'use client';

import { Check, Info, Pencil, Plus } from 'lucide-react';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal';
import { useAppUi } from '@/hooks/useAppUi';
import { usePatchCategory, usePostCategory } from '@/hooks/useCategoryMutations';
import { useGetCategories } from '@/hooks/useGetCategories';
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

type CategoryManagerModalProps = {
  onClose: () => void;
};

function CategoryManagerModal({ onClose }: CategoryManagerModalProps) {
  const { categoriesData } = useGetCategories();
  const { postCategoryMutation, isPostCategoryPending } = usePostCategory();
  const { patchCategoryMutation, isPatchCategoryPending } = usePatchCategory();
  const { showToast } = useAppUi();

  const [editing, setEditing] = useState<CategoryT | null>(null);
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('');
  const [color, setColor] = useState<AccentT>('blue');

  const isPending = isPostCategoryPending || isPatchCategoryPending;

  const reset = () => {
    setEditing(null);
    setName('');
    setEmoji('');
    setColor('blue');
  };

  const startEdit = (category: CategoryT) => {
    setEditing(category);
    setName(category.name);
    setEmoji(category.emoji);
    setColor(category.color);
  };

  const handleError = (error: unknown) =>
    showToast(error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    const body = { name: name.trim(), emoji: emoji.trim() || undefined, color };

    if (editing) {
      patchCategoryMutation(
        { id: editing.id, ...body },
        {
          onSuccess: () => {
            showToast('카테고리를 수정했어요');
            reset();
          },
          onError: handleError,
        }
      );
      return;
    }

    postCategoryMutation(body, {
      onSuccess: () => {
        showToast('카테고리를 추가했어요');
        reset();
      },
      onError: handleError,
    });
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-1.5 font-serif text-[21px]">선물 카테고리</h2>
      <p className="mb-3 text-[11px] leading-[1.7] text-[#8e8880]">
        기록을 분류하는 카테고리예요. 추가하면 기록 모달과 필터에 바로 나타나요.
      </p>

      <div className="mb-4 flex items-start gap-2 rounded-xl bg-[#f3f7f2] p-3 text-[10px] leading-[1.6] text-[#567164]">
        <Info size={14} className="mt-px shrink-0" />
        <span>
          카테고리는 모든 사용자가 함께 쓰는 목록이에요. 추가·수정하면 다른 사람 화면에도 반영돼요.
        </span>
      </div>

      <div className="mb-5 overflow-hidden rounded-[14px] border border-line bg-white">
        {categoriesData.map(category => (
          <div
            key={category.id}
            className="flex items-center gap-2.5 border-b border-line px-3 py-2.5 last:border-b-0"
          >
            <span
              className={`grid size-8 place-items-center rounded-[10px] text-base ${COLOR_CLASS[category.color]}`}
            >
              {category.emoji}
            </span>
            <span className="flex-1 text-[12px]">{category.name}</span>
            <span className="text-[10px] text-subtle">{category.recordCount}건</span>
            <button
              type="button"
              onClick={() => startEdit(category)}
              aria-label={`${category.name} 수정`}
              className="cursor-pointer p-1 text-subtle hover:text-ink"
            >
              <Pencil size={14} />
            </button>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="rounded-[14px] bg-[#f6f4f0] p-3.5">
        <p className="mb-2.5 text-[11px] font-bold text-[#817b74]">
          {editing ? `'${editing.name}' 수정` : '새 카테고리 추가'}
        </p>

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
            placeholder="여행·체험"
            aria-label="카테고리 이름"
            className={`${fieldClass} flex-1`}
          />
        </div>

        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-[10px] text-[#817b74]">색</span>
          {COLORS.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => setColor(option)}
              aria-label={option}
              className={`grid size-7 cursor-pointer place-items-center rounded-lg border ${COLOR_CLASS[option]} ${
                color === option ? 'border-coral' : 'border-line'
              }`}
            >
              {color === option ? <Check size={13} className="text-ink" /> : null}
            </button>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          {editing ? (
            <Button variant="ghost" size="sm" full onClick={reset}>
              취소
            </Button>
          ) : null}
          <Button type="submit" size="sm" full disabled={isPending || !name.trim()}>
            <Plus size={15} /> {editing ? '수정하기' : '추가하기'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CategoryManagerModal;
