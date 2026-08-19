import { Check, CircleUserRound, Clock3 } from 'lucide-react';

import type { RecordT } from '@/types/record';
import { formatDate } from '@/utils/formatDate';
import { getCategoryEmoji } from '@/utils/getCategoryEmoji';

import { recordEmojiStyles } from './recordCard.style';

type RecordCardProps = {
  record: RecordT;
};

function RecordCard({ record }: RecordCardProps) {
  return (
    <article className="relative flex min-w-0 gap-[13px] rounded-[15px] border border-line bg-white p-4">
      <div className={recordEmojiStyles({ accent: record.accent })}>
        {getCategoryEmoji(record.category)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-[7px] text-[9px] text-subtle">
          <span className="font-bold text-[#dc725f]">{record.occasion}</span>
          <time dateTime={record.date}>{formatDate(record.date)}</time>
        </div>
        <h3 className="mt-[5px] mb-[3px] text-sm">{record.person}님에게 받은 마음</h3>
        <p className="truncate text-[10px] text-[#77726b]">
          {record.gift} · {record.price}
        </p>
        <div className="mt-[9px] inline-flex items-center gap-1 rounded-lg bg-[#f6f4f0] px-[7px] py-1 text-[9px] text-[#8f8a82]">
          <CircleUserRound size={14} />
          {record.relation}
        </div>
      </div>

      <div
        className={`absolute right-3.5 bottom-3.5 flex items-center gap-[3px] text-[9px] ${
          record.thanked ? 'text-[#6b917b]' : 'text-[#b27b48]'
        }`}
      >
        {record.thanked ? (
          <>
            <Check size={14} /> 감사 완료
          </>
        ) : (
          <>
            <Clock3 size={14} /> 확인 필요
          </>
        )}
      </div>
    </article>
  );
}

export default RecordCard;
