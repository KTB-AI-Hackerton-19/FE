type SadGiftIconProps = {
  size?: number;
};

/**
 * 시무룩한 표정의 선물상자. 탈퇴처럼 아쉬움을 전하는 자리에 쓴다.
 * 얼굴은 mask 로 뚫어서 어떤 배경 위에서도 배경색이 그대로 비친다.
 */
function SadGiftIcon({ size = 32 }: SadGiftIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <mask id="sad-gift-face">
        <rect width="24" height="24" fill="white" />
        <g stroke="black" strokeLinecap="round" fill="none">
          {/* 안쪽이 올라간 처진 눈썹 */}
          <g strokeWidth="1.05">
            <path d="M7.9 13.95Q9.4 14 10.65 12.8" />
            <path d="M16.1 13.95Q14.6 14 13.35 12.8" />
          </g>
          {/* 뾰로통한 입 */}
          <path d="M10.7 19.3h2.6" strokeWidth="1.4" />
        </g>
        <circle cx="9.7" cy="16.1" r="1.1" fill="black" />
        <circle cx="14.3" cy="16.1" r="1.1" fill="black" />
      </mask>

      <g mask="url(#sad-gift-face)" fill="currentColor">
        {/* 리본 — 매듭으로 두 고리를 이어 준다 */}
        <ellipse cx="9.5" cy="4.2" rx="2.4" ry="1.8" />
        <ellipse cx="14.5" cy="4.2" rx="2.4" ry="1.8" />
        <rect x="10.8" y="3.2" width="2.4" height="3.4" rx="1" />
        {/* 뚜껑 */}
        <rect x="2.4" y="5.7" width="19.2" height="4.4" rx="1.4" />
        {/* 몸통 */}
        <path d="M3.4 11.1h17.2l-1.15 8.35A3.2 3.2 0 0 1 16.3 22.4H7.7a3.2 3.2 0 0 1-3.15-2.95L3.4 11.1Z" />
      </g>
    </svg>
  );
}

export default SadGiftIcon;