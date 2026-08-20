import ThankedBadge from '@/components/common/thanked-badge';
import type { GiftRecordT } from '@/types/record';
import { formatDate } from '@/utils/formatDate';

import { recordEmojiStyles } from './recordCard.style';

type RecordCardProps = {
  record: GiftRecordT;
};

function RecordCard({ record }: RecordCardProps) {
  return (
    // 이모지가 글 첫 줄에 붙지 않도록 세로 가운데로 맞춘다
    <article className="flex min-w-0 items-center gap-[13px] rounded-[15px] border border-line bg-white p-4">
      <div className={recordEmojiStyles({ accent: record.color })}>{record.emoji}</div>

      <div className="min-w-0 flex-1">
        {/* 날짜·뱃지를 오른쪽 칸으로 빼면 글줄과 따로 놀아 어긋난다 — 같은 줄에 담는다 */}
        <div className="flex items-center justify-between gap-2 text-[9px] text-subtle">
          <span className="truncate font-bold text-[#dc725f]">{record.occasion}</span>
          <time dateTime={record.date} className="shrink-0">
            {formatDate(record.date)}
          </time>
        </div>
        <div className="mt-[5px] mb-[3px] flex min-w-0 items-center gap-1.5">
          <h3 className="min-w-0 truncate text-sm">{record.person}</h3>
          {record.relation ? (
            <span className="shrink-0 rounded-md bg-[#f6f4f0] px-1.5 py-0.5 text-[9px] text-[#8f8a82]">
              {record.relation}
            </span>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="min-w-0 truncate text-[10px] text-[#77726b]">
            {record.gift} · {record.price}
          </p>
          <div className="shrink-0">
            <ThankedBadge id={record.id} thanked={record.thanked} />
          </div>
        </div>
      </div>
    </article>
  );
}

export default RecordCard;
