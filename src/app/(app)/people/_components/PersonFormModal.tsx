'use client';

import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import Modal from '@/components/common/modal';
import { useAppUi } from '@/hooks/useAppUi';
import { usePatchPerson, usePostPerson } from '@/hooks/usePeopleMutations';
import { GENDER_OPTIONS } from '@/types/person';
import type { GenderT, PersonT } from '@/types/person';

const fieldClass =
  'rounded-[10px] border border-line bg-white p-2.5 text-[12px] outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]';
const labelClass = 'flex flex-col gap-[5px]';
const labelTextClass = 'text-[10px] font-bold text-[#817b74]';

type PersonFormModalProps = {
  /** 있으면 수정, 없으면 새로 등록 */
  person?: PersonT;
  onClose: () => void;
};

function PersonFormModal({ person, onClose }: PersonFormModalProps) {
  const { showToast } = useAppUi();
  const { postPersonMutation, isPostPersonPending } = usePostPerson();
  const { patchPersonMutation, isPatchPersonPending } = usePatchPerson();

  const [name, setName] = useState(person?.name ?? '');
  const [relation, setRelation] = useState(person?.relation ?? '');
  const [gender, setGender] = useState<GenderT | null>(person?.gender ?? null);
  const [birthday, setBirthday] = useState(person?.birthday ?? '');
  const [memo, setMemo] = useState(person?.memo ?? '');

  const isEdit = Boolean(person);
  const isPending = isPostPersonPending || isPatchPersonPending;
  const submitLabel = isEdit ? '수정하기' : '등록하기';

  const handleError = (error: unknown) =>
    showToast(error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;

    const body = {
      name: name.trim(),
      relation: relation.trim() || undefined,
      gender: gender ?? undefined,
      birthday: birthday || undefined,
      memo: memo.trim() || undefined,
    };

    const onSuccess = () => {
      showToast(isEdit ? '정보를 수정했어요' : '새로운 사람을 등록했어요');
      onClose();
    };

    if (person) {
      patchPersonMutation({ id: person.id, ...body }, { onSuccess, onError: handleError });
      return;
    }

    postPersonMutation(body, { onSuccess, onError: handleError });
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="mb-1.5 font-title font-bold text-[21px]">
        {isEdit ? '정보 수정' : '사람 등록'}
      </h2>
      <p className="mb-5 text-[11px] leading-[1.7] text-[#8e8880]">
        생일과 성별을 넣어두면 홈 화면 에이전트 카드와 선물 추천에 반영돼요.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className={labelClass}>
          <span className={labelTextClass}>이름</span>
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="김민수"
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>관계</span>
          <input
            value={relation}
            onChange={event => setRelation(event.target.value)}
            placeholder="친한 친구"
            className={fieldClass}
          />
        </label>

        <div className={labelClass}>
          <span className={labelTextClass}>성별</span>
          <div className="flex gap-1.5">
            {GENDER_OPTIONS.map(option => (
              <button
                key={option}
                type="button"
                // 선택 항목이라 같은 값을 다시 누르면 해제된다.
                onClick={() => setGender(current => (current === option ? null : option))}
                className={`flex-1 cursor-pointer rounded-[10px] border py-2.5 text-[11px] transition ${
                  gender === option
                    ? 'border-forest bg-forest text-white'
                    : 'border-line bg-white text-[#7c7770] hover:border-[#d7c7bc]'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <label className={labelClass}>
          <span className={labelTextClass}>생일</span>
          <input
            type="date"
            value={birthday}
            onChange={event => setBirthday(event.target.value)}
            className={fieldClass}
          />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>메모</span>
          <textarea
            value={memo}
            onChange={event => setMemo(event.target.value)}
            placeholder="커피를 좋아함 / 향수는 기피"
            className={`${fieldClass} h-[70px] resize-none`}
          />
        </label>

        <div className="mt-2 flex gap-2">
          <Button variant="ghost" full onClick={onClose} disabled={isPending}>
            취소
          </Button>
          <Button type="submit" full disabled={isPending || !name.trim()}>
            {isPending ? '저장 중…' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default PersonFormModal;
