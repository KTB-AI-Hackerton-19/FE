'use client';

import { LogOut } from 'lucide-react';

import ConfirmDialog from '@/components/common/confirm-dialog';

type LogoutConfirmDialogProps = {
  isPending: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function LogoutConfirmDialog({ isPending, onConfirm, onCancel }: LogoutConfirmDialogProps) {
  return (
    <ConfirmDialog
      title="로그아웃 하시겠어요?"
      description="기록한 마음은 그대로 남아 있어요."
      icon={<LogOut size={22} />}
      confirmLabel="로그아웃"
      cancelLabel="유지하기"
      isPending={isPending}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export default LogoutConfirmDialog;