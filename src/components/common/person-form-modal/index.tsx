'use client';

import { useState } from 'react';

import { ApiError, toFieldMessages } from '@/apis/apiClient';
import Button from '@/components/common/button';
import ChoiceButton from '@/components/common/choice-button';
import DatePicker from '@/components/common/date-picker';
import FieldLabel from '@/components/common/field-label';
import FieldMessage from '@/components/common/field-label/FieldMessage';
import Modal from '@/components/common/modal';
import RelationPicker from '@/components/common/relation-picker';
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
  /** 등록·수정된 사람을 바로 골라 쓰고 싶을 때 (기록 모달) */
  onCreated?: (created: PersonT) => void;
  onClose: () => void;
};

function PersonFormModal({ person, onCreated, onClose }: PersonFormModalProps) {
  const { showToast } = useAppUi();
  const { postPersonMutation, isPostPersonPending } = usePostPerson();
  const { patchPersonMutation, isPatchPersonPending } = usePatchPerson();

  const [name, setName] = useState(person?.name ?? '');
  const [relation, setRelation] = useState(person?.relation ?? '');
  const [gender, setGender] = useState<GenderT | null>(person?.gender ?? null);
  const [birthday, setBirthday] = useState(person?.birthday ?? '');
  const [memo, setMemo] = useState(person?.memo ?? '');
  /** 관계 추가 모달이 떠 있는 동안은 이 모달을 감춘다 (값은 유지) */
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  /** 서버가 짚어 준 칸별 안내 문구 */
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // 서버가 막는 값이라 채우기 전에는 저장 버튼을 열지 않는다.
  const isFilled = Boolean(name.trim() && relation.trim() && gender);
  const isEdit = Boolean(person);
  const isPending = isPostPersonPending || isPatchPersonPending;
  const submitLabel = isEdit ? '수정하기' : '등록하기';

  const handleError = (error: unknown) => {
    // 어느 칸이 잘못됐는지 서버가 알려주면 토스트 대신 그 칸 아래에 띄운다.
    const messages = toFieldMessages(error);
    setFieldErrors(messages);

    if (Object.keys(messages).length > 0) return;

    showToast(error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setFieldErrors({});

    const body = {
      name: name.trim(),
      relation: relation.trim() || undefined,
      gender: gender ?? undefined,
      birthday: birthday || undefined,
      memo: memo.trim() || undefined,
    };

    const onSuccess = (saved: PersonT) => {
      showToast(isEdit ? '정보를 수정했어요' : '새로운 사람을 등록했어요');
      onCreated?.(saved);
      onClose();
    };

    if (person) {
      patchPersonMutation({ id: person.id, ...body }, { onSuccess, onError: handleError });
      return;
    }

    postPersonMutation(body, { onSuccess, onError: handleError });
  };

  return (
    <Modal onClose={onClose} hidden={isSubModalOpen}>
      <h2 className="mb-1.5 font-title font-bold text-[21px]">
        {isEdit ? '정보 수정' : '사람 등록'}
      </h2>
      <p className="mb-5 text-[11px] leading-[1.7] text-[#8e8880]">
        생일까지 넣어두면 홈 화면 에이전트 카드와 선물 추천에 반영돼요.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className={labelClass}>
          <FieldLabel required className={labelTextClass}>
            이름
          </FieldLabel>
          <input
            value={name}
            onChange={event => setName(event.target.value)}
            placeholder="김민수"
            className={fieldClass}
          />
          <FieldMessage message={fieldErrors.name} />
        </label>

        <div className={labelClass}>
          <FieldLabel required className={labelTextClass}>
            관계
          </FieldLabel>
          <RelationPicker
            value={relation}
            onChange={setRelation}
            onSubModalToggle={setIsSubModalOpen}
            addButtonSize="lg"
            className={fieldClass}
          />
          <FieldMessage message={fieldErrors.relation} />
        </div>

        <div className={labelClass}>
          <FieldLabel required className={labelTextClass}>
            성별
          </FieldLabel>
          <div className="flex gap-1.5">
            {GENDER_OPTIONS.map(option => (
              <ChoiceButton
                key={option}
                selected={gender === option}
                // 선택 항목이라 같은 값을 다시 누르면 해제된다.
                onClick={() => setGender(current => (current === option ? null : option))}
                className="flex-1 py-2.5"
              >
                {option}
              </ChoiceButton>
            ))}
          </div>
          <FieldMessage message={fieldErrors.gender} />
        </div>

        <div className={labelClass}>
          <span className={labelTextClass}>생일</span>
          <DatePicker
            value={birthday}
            onChange={setBirthday}
            placeholder="선택 안 함"
            clearable
            className={fieldClass}
          />
        </div>

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
          <Button type="submit" full disabled={isPending || !isFilled}>
            {isPending ? '저장 중…' : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default PersonFormModal;
