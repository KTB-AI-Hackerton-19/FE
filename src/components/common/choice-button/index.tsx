'use client';

type ChoiceButtonProps = {
  children: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  /** 배치용 — 폭·높이는 쓰는 쪽에서 정한다 */
  className?: string;
};

/** 폼 안에서 몇 안 되는 값 중 하나를 고르는 버튼 (성별, 경사·조사). 고른 것은 브랜드 색으로 표시한다. */
function ChoiceButton({ children, selected, onClick, className = '' }: ChoiceButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`${className} cursor-pointer rounded-[10px] border text-[11px] font-bold transition ${
        selected
          ? 'border-coral-soft bg-coral-soft text-coral-deep'
          : 'border-line bg-white text-[#a5a09a] hover:border-[#d7c7bc] hover:text-[#7c7770]'
      }`}
    >
      {children}
    </button>
  );
}

export default ChoiceButton;
