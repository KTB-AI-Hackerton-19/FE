'use client';

import { X } from 'lucide-react';
import { createPortal } from 'react-dom';

import { useLockBodyScroll } from '@/hooks/useLockBodyScroll';

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  /** 패널 최대 너비 (기본 480px) */
  size?: 'sm' | 'md';
  /** 닫기 버튼이 따로 있는 경우(확인 다이얼로그 등) 우상단 X 를 숨긴다. */
  hideClose?: boolean;
  /** 이 모달 위에 다른 모달이 떠 있는 동안 감춘다. 언마운트하면 입력값이 날아간다 */
  hidden?: boolean;
};

/**
 * 모바일에서는 바텀시트, 데스크톱에서는 가운데 팝업으로 뜬다.
 * body 에 포털로 붙는다 — 모달 위에 모달을 열 때 아래 모달을 감춰도 같이 사라지지 않아야 한다.
 */
function Modal({ onClose, children, size = 'md', hideClose = false, hidden = false }: ModalProps) {
  useLockBodyScroll();

  // 항상 상태로 열리므로 서버 렌더에는 등장하지 않는다.
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      className={`fixed inset-0 z-30 grid place-items-end bg-[#211c19]/50 backdrop-blur-[5px] sm:place-items-center sm:p-5 ${
        hidden ? 'invisible' : ''
      }`}
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <div
        className={`relative max-h-[92vh] w-full overflow-auto rounded-t-[23px] bg-[#fffdfa] px-[19px] pt-[27px] pb-[30px] shadow-[0_25px_70px_#1b171345] sm:rounded-[22px] sm:p-[34px] ${
          size === 'sm' ? 'sm:max-w-[400px]' : 'sm:max-w-[480px]'
        }`}
      >
        {hideClose ? null : (
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-[18px] right-[18px] grid size-8 cursor-pointer place-items-center rounded-full bg-[#f2efeb] text-[#77716a]"
          >
            <X size={17} />
          </button>
        )}
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
