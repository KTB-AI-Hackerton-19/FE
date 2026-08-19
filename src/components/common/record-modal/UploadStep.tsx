'use client';

import { ImagePlus, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';

import Button from '@/components/common/button';

type UploadStepProps = {
  onAnalyze: (memo: string) => void;
};

function UploadStep({ onAnalyze }: UploadStepProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');
  const [memo, setMemo] = useState('');

  const handleAnalyze = () => onAnalyze(memo);

  return (
    <>
      <div className="mx-auto grid size-12 place-items-center rounded-[15px] bg-coral-soft text-coral-deep">
        <ImagePlus />
      </div>
      <h2 className="mt-3.5 mb-1.5 text-center font-serif text-[23px]">어떤 마음을 받으셨나요?</h2>
      <p className="mb-[19px] text-center text-[11px] leading-[1.7] text-[#8e8880]">
        메시지 캡처나 선물 사진을 올리면
        <br />
        AI가 필요한 내용을 대신 정리해드려요.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={event => setFileName(event.target.files?.[0]?.name ?? '')}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex h-[120px] w-full cursor-pointer flex-col items-center justify-center gap-[5px] rounded-[14px] border-[1.5px] border-dashed border-[#d8cfc5] bg-[#faf7f3] text-[#d57967]"
      >
        <ImagePlus size={28} />
        <b className="text-xs text-[#625c55]">{fileName || '사진 또는 캡처 올리기'}</b>
        <span className="text-[9px] text-[#a19a92]">
          {fileName ? '분석할 준비가 되었어요' : 'JPG, PNG · 최대 10MB'}
        </span>
      </button>

      <div className="my-3.5 flex items-center gap-2.5 text-[9px] text-[#aaa49d]">
        <span className="h-px flex-1 bg-line" />
        또는
        <span className="h-px flex-1 bg-line" />
      </div>

      <textarea
        value={memo}
        onChange={event => setMemo(event.target.value)}
        placeholder="예: 민수가 생일에 스타벅스 케이크를 보내줬어요."
        className="h-[70px] w-full resize-none rounded-xl border border-line p-[11px] text-[11px] outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]"
      />

      <Button full onClick={handleAnalyze} className="mt-3">
        <Sparkles size={18} /> AI로 마음 정리하기
      </Button>
    </>
  );
}

export default UploadStep;
