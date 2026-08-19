'use client';

import { X } from 'lucide-react';
import { useState } from 'react';

import { useAppUi } from '@/hooks/useAppUi';
import { usePostRecord } from '@/hooks/usePostRecord';

import ConfirmStep from './ConfirmStep';
import LoadingStep from './LoadingStep';
import UploadStep from './UploadStep';
import { AI_EXTRACTED_DEFAULT } from './recordModal.const';
import type { ModalStepT, RecordFormT } from './recordModal.const';

function RecordModalContent() {
  const { closeRecordModal, showToast } = useAppUi();
  const { postRecordMutation, isPostRecordPending } = usePostRecord();

  const [step, setStep] = useState<ModalStepT>('upload');
  const [extracted, setExtracted] = useState<RecordFormT>(AI_EXTRACTED_DEFAULT);

  const handleAnalyze = (memo: string) => {
    setStep('loading');
    setExtracted(memo ? { ...AI_EXTRACTED_DEFAULT, gift: memo } : AI_EXTRACTED_DEFAULT);
    setTimeout(() => setStep('confirm'), 1250);
  };

  const handleSave = (values: RecordFormT) => {
    postRecordMutation(values, {
      onSuccess: () => {
        closeRecordModal();
        showToast('새로운 마음을 기록했어요');
      },
    });
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

        {step === 'upload' && <UploadStep onAnalyze={handleAnalyze} />}
        {step === 'loading' && <LoadingStep />}
        {step === 'confirm' && (
          <ConfirmStep
            defaultValues={extracted}
            isPending={isPostRecordPending}
            onBack={() => setStep('upload')}
            onSubmit={handleSave}
          />
        )}
      </div>
    </div>
  );
}

export default RecordModalContent;
