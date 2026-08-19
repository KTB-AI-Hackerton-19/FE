'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

import { ApiError } from '@/apis/apiClient';
import { useAppUi } from '@/hooks/useAppUi';
import { useGetDashboard } from '@/hooks/useGetDashboard';
import {
  usePatchGiftRecord,
  usePostGiftRecord,
  usePostGiftRecordExtract,
} from '@/hooks/useGiftRecordMutations';

import ConfirmStep from './ConfirmStep';
import LoadingStep from './LoadingStep';
import UploadStep from './UploadStep';
import { draftToForm, emptyRecordForm } from './recordModal.const';
import type { ModalStepT, RecordFormT } from './recordModal.const';

function RecordModalContent() {
  const { closeRecordModal, showToast } = useAppUi();
  const { dashboardData } = useGetDashboard();
  const today = dashboardData?.today ?? new Date().toISOString().slice(0, 10);

  const { postGiftRecordExtractMutation } = usePostGiftRecordExtract();
  const { postGiftRecordMutation, isPostGiftRecordPending } = usePostGiftRecord();
  const { patchGiftRecordMutation, isPatchGiftRecordPending } = usePatchGiftRecord();

  const [step, setStep] = useState<ModalStepT>('upload');
  const [form, setForm] = useState<RecordFormT>(() => emptyRecordForm(today));
  /** AI 분석으로 만들어진 DRAFT 기록 ID. 직접 입력이면 null */
  const [draftId, setDraftId] = useState<number | null>(null);

  const isSaving = isPostGiftRecordPending || isPatchGiftRecordPending;

  const handleError = (error: unknown) =>
    showToast(error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.');

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
    const body = {
      personName: values.personName,
      relation: values.relation || undefined,
      date: values.date,
      reminderDate: values.reminderDate || undefined,
      occasion: values.occasion || undefined,
      gift: values.gift,
      category: values.category,
      price: values.price || undefined,
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
      className="fixed inset-0 z-30 grid place-items-end bg-[#211c19]/50 backdrop-blur-[5px] sm:place-items-center sm:p-5"
      onMouseDown={event => event.target === event.currentTarget && closeRecordModal()}
    >
      <div className="relative max-h-[92vh] w-full overflow-auto rounded-t-[23px] bg-[#fffdfa] px-[19px] pt-[27px] pb-[30px] shadow-[0_25px_70px_#1b171345] sm:max-w-[480px] sm:rounded-[22px] sm:p-[34px]">
        <button
          type="button"
          onClick={closeRecordModal}
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
            onSubmit={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default RecordModalContent;
