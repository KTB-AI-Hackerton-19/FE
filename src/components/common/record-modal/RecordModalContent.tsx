'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetDashboard } from '@/hooks/useGetDashboard';
import {
  useDeleteGiftRecords,
  usePatchGiftRecord,
  usePostGiftRecord,
  usePostGiftRecordExtract,
} from '@/hooks/useGiftRecordMutations';
import type { GiftRecordT } from '@/types/record';
import { getTodayDateKey } from '@/utils/formatDate';

import ConfirmStep from './ConfirmStep';
import LoadingStep from './LoadingStep';
import UploadStep from './UploadStep';
import { draftToForm, emptyRecordForm } from './recordModal.const';
import type { ModalStepT, RecordFormT } from './recordModal.const';

function RecordModalContent() {
  const { closeRecordModal, showToast } = useAppUi();
  const { dashboardData } = useGetDashboard();
  // toISOString 은 UTC 라 한국 새벽에는 어제가 나온다 — 로컬 기준으로 계산한다.
  const today = dashboardData?.today ?? getTodayDateKey();

  const { postGiftRecordExtractMutation } = usePostGiftRecordExtract();
  const { postGiftRecordMutation, isPostGiftRecordPending } = usePostGiftRecord();
  const { patchGiftRecordMutation, isPatchGiftRecordPending } = usePatchGiftRecord();
  const { deleteGiftRecordsMutation } = useDeleteGiftRecords();

  const [step, setStep] = useState<ModalStepT>('upload');
  const [form, setForm] = useState<RecordFormT>(() => emptyRecordForm(today));
  /** 사람 등록·카테고리 추가 모달이 떠 있는 동안은 이 모달을 감춘다 (값은 유지) */
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  /** AI 분석으로 만들어진 DRAFT 기록들. 직접 입력이면 빈 배열 */
  const [drafts, setDrafts] = useState<GiftRecordT[]>([]);

  const isSaving = isPostGiftRecordPending || isPatchGiftRecordPending;

  const handleError = (error: unknown) =>
    showToast(error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.');

  /**
   * AI 분석은 성공하는 순간 서버에 DRAFT 기록을 만든다.
   * 확정하지 않고 닫으면 반쪽 기록이 남으므로 여기서 지운다.
   */
  const handleClose = () => {
    if (drafts.length > 0) deleteGiftRecordsMutation(drafts.map(draft => draft.id));
    closeRecordModal();
  };

  const handleAnalyze = (file: File) => {
    setStep('loading');
    postGiftRecordExtractMutation(file, {
      onSuccess: ({ records, personCount }) => {
        setDrafts(records);
        // 여러 명이어도 같은 확인 폼을 쓴다 — 사람별 칸만 목록으로 바뀐다.
        setForm(draftToForm(records[0], today, personCount));
        setStep('confirm');
      },
      onError: error => {
        setStep('upload');
        handleError(error);
      },
    });
  };

  const handleSkip = () => {
    setDrafts([]);
    setForm(emptyRecordForm(today));
    setStep('confirm');
  };

  const handleSave = (values: RecordFormT) => {
    const isEvent = values.recordType === 'EVENT';

    const body = {
      recordType: values.recordType,
      // 목록에서 고른 사람이면 id 로 확실히 연결하고, 아니면 이름으로 찾거나 새로 만들게 둔다.
      personId: values.personId,
      personName: values.personName,
      relation: values.relation || undefined,
      date: values.date,
      reminderDate: values.reminderDate || undefined,
      gift: values.gift,
      price: values.price || undefined,
      // 선물이면 카테고리와 받은 이유를, 경조사면 행사 유형과 행사일을 보낸다.
      // 반대쪽 값은 서버가 무시하지만, 안 보이는 값이 저장되지 않도록 아예 빼고 보낸다.
      occasion: isEvent ? undefined : values.occasion || undefined,
      category: isEvent ? undefined : values.category,
      eventCategory: isEvent ? values.eventCategory : undefined,
      eventDate: isEvent ? values.eventDate || undefined : undefined,
    };

    const onSuccess = () => {
      closeRecordModal();
      showToast('새로운 마음을 기록했어요');
    };

    /**
     * 여러 명은 사람마다 DRAFT 가 하나씩 있어 각각 확정한다.
     * 이름·금액·받은 날짜는 AI 값을 그대로 두고, 폼에서 함께 고른 값만 얹는다.
     */
    if (drafts.length > 1) {
      // 사람마다 다른 값(이름·금액·관계·받은 날짜)은 AI 가 넣어 둔 것을 그대로 둔다.
      // 하나라도 실어 보내면 첫 사람의 값이 전원에게 덮어써진다.
      const {
        personId: _personId,
        personName: _personName,
        relation: _relation,
        date: _date,
        price: _price,
        ...shared
      } = body;

      Promise.all(
        drafts.map(
          draft =>
            new Promise<void>((resolve, reject) => {
              patchGiftRecordMutation(
                { id: draft.id, ...shared, confirm: true },
                { onSuccess: () => resolve(), onError: reject }
              );
            })
        )
      )
        .then(() => {
          closeRecordModal();
          showToast(`${drafts.length}명의 마음을 기록했어요`);
        })
        .catch(handleError);

      return;
    }

    // AI가 만든 DRAFT면 확정(PATCH), 직접 입력이면 새로 등록(POST).
    if (drafts.length > 0) {
      patchGiftRecordMutation(
        { id: drafts[0].id, ...body, confirm: true },
        { onSuccess, onError: handleError }
      );
      return;
    }

    /**
     * 경조사는 한 행사에 여러 명이 오므로 고른 사람 수만큼 기록을 만든다.
     * 하객은 '사람들' 목록에 올리지 않는다 — 목록에서 고른 사람만 personId 로 연결한다.
     */
    if (isEvent && values.guests.length > 0) {
      // 관계는 사람마다 다르다 — 등록된 사람의 관계를 덮어쓰지 않도록 아예 보내지 않는다.
      const { personId: _personId, personName: _personName, relation: _relation, ...shared } = body;

      Promise.all(
        values.guests.map(
          guest =>
            new Promise<void>((resolve, reject) => {
              postGiftRecordMutation(
                guest.personId
                  ? { ...shared, personId: guest.personId }
                  : { ...shared, guestName: guest.name },
                { onSuccess: () => resolve(), onError: reject }
              );
            })
        )
      )
        .then(() => {
          closeRecordModal();
          showToast(`${values.guests.length}명의 마음을 기록했어요`);
        })
        .catch(handleError);

      return;
    }

    // 선물은 보낸 사람을 '사람들'에도 남긴다 — 이 플래그가 없으면 이름만 기록된다.
    postGiftRecordMutation({ ...body, registerPerson: true }, { onSuccess, onError: handleError });
  };

  return (
    <div
      className={`fixed inset-0 z-30 grid place-items-end bg-[#211c19]/50 backdrop-blur-[5px] sm:place-items-center sm:p-5 ${
        isSubModalOpen ? 'invisible' : ''
      }`}
      onMouseDown={event => event.target === event.currentTarget && handleClose()}
    >
      <div className="relative max-h-[92vh] w-full overflow-auto rounded-t-[23px] bg-[#fffdfa] px-[19px] pt-[27px] pb-[30px] shadow-[0_25px_70px_#1b171345] sm:max-w-[480px] sm:rounded-[22px] sm:p-[34px]">
        <button
          type="button"
          onClick={handleClose}
          aria-label="닫기"
          className="absolute top-[18px] right-[18px] grid size-8 cursor-pointer place-items-center rounded-full bg-[#f2efeb] text-[#77716a]"
        >
          <X size={17} />
        </button>

        {step === 'upload' && <UploadStep onAnalyze={handleAnalyze} onSkip={handleSkip} />}
        {step === 'loading' && <LoadingStep />}
        {step === 'confirm' && (
          <ConfirmStep
            defaultValues={form}
            isPending={isSaving}
            isDraft={drafts.length > 0}
            manyRecords={drafts}
            onSubModalToggle={setIsSubModalOpen}
            onSubmit={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default RecordModalContent;
