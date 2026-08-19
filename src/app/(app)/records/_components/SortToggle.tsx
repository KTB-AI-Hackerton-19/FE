'use client';

export const SORT_OPTIONS = [
  { key: 'latest', label: '최신순' },
  { key: 'amount', label: '금액순' },
] as const;

export type SortKeyT = (typeof SORT_OPTIONS)[number]['key'];

type SortToggleProps = {
  value: SortKeyT;
  onChange: (value: SortKeyT) => void;
};

/** 선물·경조사 탭이 함께 쓰는 정렬 전환. */
function SortToggle({ value, onChange }: SortToggleProps) {
  return (
    // 선물·경조사 탭과 같은 세그먼트 모양. 여기는 줄 안에 들어가야 해서 한 단계 작게 쓴다.
    // 바깥 트랙 크기는 그대로 두고 안쪽 여백으로 흰 알약 크기를 잡는다.
    <div className="inline-flex shrink-0 gap-0.5 rounded-[10px] bg-[#f1ede8] p-[3px]">
      {SORT_OPTIONS.map(({ key, label }) => (
        <button
          key={key}
          type="button"
          onClick={() => onChange(key)}
          aria-pressed={value === key}
          className={`cursor-pointer rounded-[7px] px-2 py-[3px] text-[8.5px] font-bold whitespace-nowrap transition ${
            value === key ? 'bg-white text-ink shadow-[0_1px_3px_#4b3a3212]' : 'text-[#8b857e]'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default SortToggle;
