'use client';

import { Plus } from 'lucide-react';

import Button from '@/components/common/button';
import { useAppUi } from '@/hooks/useAppUi';

function RecordsHeaderAction() {
  const { openRecordModal } = useAppUi();

  return (
    <Button onClick={openRecordModal} className="hidden lg:inline-flex">
      <Plus size={17} /> 기록하기
    </Button>
  );
}

export default RecordsHeaderAction;
