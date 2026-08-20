'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetDashboard } from '@/hooks/useGetDashboard';
import {
  useDeleteGiftRecord,
  usePatchGiftRecord,
  usePostGiftRecord,
  usePostGiftRecordExtract,
} from '@/hooks/useGiftRecordMutations';
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
  const { deleteGiftRecordMutation } = useDeleteGiftRecord();

  const [step, setStep] = useState<ModalStepT>('upload');
  const [form, setForm] = useState<RecordFormT>(() => emptyRecordForm(today));
  /** 사람 등록·카테고리 추가 모달이 떠 있는 동안은 이 모달을 감춘다 (값은 유지) */
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  /** AI 분석으로 만들어진 DRAFT 기록 ID. 직접 입력이면 null */
  const [draftId, setDraftId] = useState<number | null>(null);

  const isSaving = isPostGiftRecordPending || isPatchGiftRecordPending;

  const handleError = (error: unknown) =>
    showToast(error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.');

  /**
   * AI 분석은 성공하는 순간 서버에 DRAFT 기록을 만든다.
   * 확정하지 않고 닫으면 반쪽 기록이 남으므로 여기서 지운다.
   */
  const handleClose = () => {
    if (draftId !== null) deleteGiftRecordMutation(draftId);
    closeRecordModal();
  };

  const handleAnalyze = (file: File) => {
    setStep('loading');
    postGiftRecordExtractMutation(file, {
      onSuccess: draft => {
        setDraftId(draft.id);
        setForm(draftToForm(draft, today));
        setStep('confirm');
      },
      onError: error => {
        setStep('upload');
        handleError(error);
      },
    });
  };

  const handleSkip = () => {
    setDraftId(null);
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

    // AI가 만든 DRAFT면 확정(PATCH), 직접 입력이면 새로 등록(POST).
    if (draftId !== null) {
      patchGiftRecordMutation(
        { id: draftId, ...body, confirm: true },
        { onSuccess, onError: handleError }
      );
      return;
    }

    postGiftRecordMutation(body, { onSuccess, onError: handleError });
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
            isDraft={draftId !== null}
            onSubModalToggle={setIsSubModalOpen}
            onSubmit={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default RecordModalContent;
