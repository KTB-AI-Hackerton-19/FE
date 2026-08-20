'use client';

import { Check } from 'lucide-react';

type CheckBoxProps = {
  checked: boolean;
};

/** 목록에서 항목을 고를 때 쓰는 네모 체크 표시. 클릭은 감싸는 쪽이 받는다. */
function CheckBox({ checked }: CheckBoxProps) {
  return (
    <span
      aria-hidden
      className={`grid size-[19px] shrink-0 place-items-center rounded-md border transition ${
        checked ? 'border-coral bg-coral text-white' : 'border-[#d7d1c8] bg-white'
      }`}
    >
      {checked ? <Check size={13} strokeWidth={3} /> : null}
    </span>
  );
}

export default CheckBox;
