'use client';

import SadGiftIcon from '@/assets/icons/sad-gift.svg';
import Button from '@/components/common/button';

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

/** 목록이 비었을 때. 시무룩한 선물상자로 빈 화면을 부드럽게 만든다. */
function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="px-6 py-12 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-[20px] bg-coral-soft text-coral-deep">
        <SadGiftIcon width={38} height={38} />
      </div>

      <p className="mt-4 text-[13px] font-bold">{title}</p>
      {description ? <p className="mt-1.5 text-[11px] text-muted">{description}</p> : null}

      {actionLabel && onAction ? (
        <Button size="sm" onClick={onAction} className="mt-4">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export default EmptyState;
