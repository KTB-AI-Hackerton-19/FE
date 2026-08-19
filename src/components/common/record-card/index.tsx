import { CircleUserRound } from 'lucide-react';

import ThankedBadge from '@/components/common/thanked-badge';
import type { GiftRecordT } from '@/types/record';
import { formatDate } from '@/utils/formatDate';

import { recordEmojiStyles } from './recordCard.style';

type RecordCardProps = {
  record: GiftRecordT;
};

function RecordCard({ record }: RecordCardProps) {
  return (
    <article className="relative flex min-w-0 gap-[13px] rounded-[15px] border border-line bg-white p-4">
      <div className={recordEmojiStyles({ accent: record.color })}>{record.emoji}</div>

      <div className="min-w-0 flex-1">
        <div className="flex justify-between gap-[7px] text-[9px] text-subtle">
          <span className="font-bold text-[#dc725f]">{record.occasion}</span>
          <time dateTime={record.date}>{formatDate(record.date)}</time>
        </div>
        <h3 className="mt-[5px] mb-[3px] text-sm">{record.person}님에게 받은 마음</h3>
        <p className="truncate text-[10px] text-[#77726b]">
          {record.gift} · {record.price}
        </p>
        {record.relation ? (
          <div className="mt-[9px] inline-flex items-center gap-1 rounded-lg bg-[#f6f4f0] px-[7px] py-1 text-[9px] text-[#8f8a82]">
            <CircleUserRound size={14} />
            {record.relation}
          </div>
        ) : null}
      </div>

      <div className="absolute right-2.5 bottom-2.5">
        <ThankedBadge id={record.id} thanked={record.thanked} />
      </div>
    </article>
  );
}

export default RecordCard;
