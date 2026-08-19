'use client';

import { AlertTriangle } from 'lucide-react';

import Button from '@/components/common/button';
import Modal from '@/components/common/modal';

type ConfirmDialogProps = {
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

function ConfirmDialog({
  title,
  description,
  confirmLabel = '삭제할래요',
  cancelLabel = '유지할래요',
  isPending = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <Modal onClose={onCancel} size="sm">
      <div className="mx-auto grid size-12 place-items-center rounded-[15px] bg-coral-soft text-coral-deep">
        <AlertTriangle size={22} />
      </div>
      <h2 className="mt-3.5 mb-1.5 text-center font-serif text-[21px]">{title}</h2>
      {description ? (
        <div className="mb-5 text-center text-[11px] leading-[1.8] text-[#8e8880]">
          {description}
        </div>
      ) : null}

      <div className="flex gap-2">
        <Button variant="ghost" full onClick={onCancel} disabled={isPending}>
          {cancelLabel}
        </Button>
        <Button full onClick={onConfirm} disabled={isPending}>
          {isPending ? '처리 중…' : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}

export default ConfirmDialog;
