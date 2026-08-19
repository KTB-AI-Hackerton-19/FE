'use client';

import { X } from 'lucide-react';

type ModalProps = {
  onClose: () => void;
  children: React.ReactNode;
  /** 패널 최대 너비 (기본 480px) */
  size?: 'sm' | 'md';
};

/** 모바일에서는 바텀시트, 데스크톱에서는 가운데 팝업으로 뜬다. */
function Modal({ onClose, children, size = 'md' }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-30 grid place-items-end bg-[#211c19]/50 backdrop-blur-[5px] sm:place-items-center sm:p-5"
      onMouseDown={event => event.target === event.currentTarget && onClose()}
    >
      <div
        className={`relative max-h-[92vh] w-full overflow-auto rounded-t-[23px] bg-[#fffdfa] px-[19px] pt-[27px] pb-[30px] shadow-[0_25px_70px_#1b171345] sm:rounded-[22px] sm:p-[34px] ${
          size === 'sm' ? 'sm:max-w-[400px]' : 'sm:max-w-[480px]'
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="absolute top-[18px] right-[18px] grid size-8 cursor-pointer place-items-center rounded-full bg-[#f2efeb] text-[#77716a]"
        >
          <X size={17} />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
