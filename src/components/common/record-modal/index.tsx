'use client';

import { useAppUi } from '@/hooks/useAppUi';

import RecordModalContent from './RecordModalContent';

/** 열릴 때마다 새로 마운트해 단계·입력값이 초기화되도록 한다. */
function RecordModal() {
  const { isRecordModalOpen } = useAppUi();

  if (!isRecordModalOpen) return null;

  return <RecordModalContent />;
}

export default RecordModal;
