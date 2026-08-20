'use client';

/** 입력값에서 숫자만 남긴다 — 한글·기호가 섞이면 서버가 엉뚱하게 읽는다. */
const toDigits = (value: string) => value.replace(/[^\d]/g, '');

const withComma = (digits: string) => (digits ? Number(digits).toLocaleString('ko-KR') : '');

type AmountInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className: string;
};

/** 금액 입력. 치는 대로 콤마가 붙고, 단위는 칸 안에 고정으로 둔다. */
function AmountInput({ value, onChange, placeholder, className }: AmountInputProps) {
  return (
    <span className="relative block">
      <input
        value={withComma(toDigits(value))}
        onChange={event => onChange(withComma(toDigits(event.target.value)))}
        inputMode="numeric"
        placeholder={placeholder}
        aria-label="금액"
        className={`${className} w-full pr-7 text-right`}
      />
      <span className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-[11px] text-subtle">
        원
      </span>
    </span>
  );
}

export default AmountInput;
