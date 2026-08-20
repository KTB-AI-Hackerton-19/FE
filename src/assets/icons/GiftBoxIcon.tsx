type GiftBoxIconProps = {
  size?: number;
  className?: string;
};

/** 표정 없는 선물상자. SadGiftIcon 과 같은 형태이고 배경 장식으로 쓴다. */
function GiftBoxIcon({ size = 24, className }: GiftBoxIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      {/* 리본 — 매듭으로 두 고리를 이어 준다 */}
      <ellipse cx="9.5" cy="4.2" rx="2.4" ry="1.8" />
      <ellipse cx="14.5" cy="4.2" rx="2.4" ry="1.8" />
      <rect x="10.8" y="3.2" width="2.4" height="3.4" rx="1" />
      {/* 뚜껑 */}
      <rect x="2.4" y="5.7" width="19.2" height="4.4" rx="1.4" />
      {/* 몸통 */}
      <path d="M3.4 11.1h17.2l-1.15 8.35A3.2 3.2 0 0 1 16.3 22.4H7.7a3.2 3.2 0 0 1-3.15-2.95L3.4 11.1Z" />
    </svg>
  );
}

export default GiftBoxIcon;
