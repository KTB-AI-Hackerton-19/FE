'use client';

import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal';
import { useAppUi } from '@/hooks/useAppUi';
import { usePostRelationship } from '@/hooks/useRelationshipMutations';
import type { RelationshipT } from '@/types/relationship';

const fieldClass =
  'rounded-[10px] border border-line bg-white p-2.5 text-[12px] outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]';

type RelationAddModalProps = {
  onCreated: (created: RelationshipT) => void;
  onClose: () => void;
};

/** 기본 목록에 없는 관계를 직접 만들고 바로 고르기 위한 작은 폼. */
function RelationAddModal({ onCreated, onClose }: RelationAddModalProps) {
  const { showToast } = useAppUi();
  const { postRelationshipMutation, isPostRelationshipPending } = usePostRelationship();

  const [name, setName] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    postRelationshipMutation(
      { name: name.trim() },
      {
        onSuccess: created => {
          showToast(`'${created.label}'을(를) 추가했어요`);
          onCreated(created);
          onClose();
        },
        onError: error =>
          showToast(error instanceof ApiError ? error.message : '추가하지 못했어요'),
      }
    );
  };

  return (
    <Modal onClose={onClose} size="sm" hideClose noScroll>
      <h2 className="mb-5 font-title font-bold text-[19px]">관계 추가</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          value={name}
          onChange={event => setName(event.target.value)}
          placeholder="동호회"
          aria-label="관계 이름"
          className={fieldClass}
        />

        <div className="mt-2 flex gap-2">
          <Button variant="ghost" full onClick={onClose} disabled={isPostRelationshipPending}>
            취소
          </Button>
          <Button type="submit" full disabled={isPostRelationshipPending || !name.trim()}>
            {isPostRelationshipPending ? '추가 중…' : '추가하기'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default RelationAddModal;
