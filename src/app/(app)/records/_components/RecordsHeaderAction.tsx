'use client';

import { Plus } from 'lucide-react';

import Button from '@/components/common/button';
import { useAppUi } from '@/hooks/useAppUi';

function RecordsHeaderAction() {
  const { openRecordModal } = useAppUi();

  return (
    // Button 의 cva base 인 inline-flex 가 hidden 을 이기므로 래퍼로 감춘다.
    <div className="hidden lg:block">
      <Button onClick={openRecordModal}>
        <Plus size={17} /> 기록하기
      </Button>
    </div>
  );
}

export default RecordsHeaderAction;
