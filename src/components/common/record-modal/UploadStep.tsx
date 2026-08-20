'use client';

import { ImagePlus, PenLine, Sparkles } from 'lucide-react';
import { useRef, useState } from 'react';

import Button from '@/components/common/button';

type UploadStepProps = {
  onAnalyze: (file: File) => void;
  onSkip: () => void;
};

type PickedT = { file: File; previewUrl: string };

function UploadStep({ onAnalyze, onSkip }: UploadStepProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [picked, setPicked] = useState<PickedT | null>(null);

  const handlePick = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 이전 미리보기 URL 은 여기서 정리한다 — effect 없이 교체 시점에 회수.
    if (picked) URL.revokeObjectURL(picked.previewUrl);
    setPicked({ file, previewUrl: URL.createObjectURL(file) });
  };

  const handleAnalyze = () => {
    if (picked) onAnalyze(picked.file);
  };

  return (
    <>
      <div className="mx-auto grid size-12 place-items-center rounded-[15px] bg-coral-soft text-coral-deep">
        <ImagePlus />
      </div>
      <h2 className="mt-3.5 mb-1.5 text-center font-title font-bold text-[23px]">
        어떤 마음을 받으셨나요?
      </h2>
      <p className="mb-[19px] text-center text-[11px] leading-[1.7] text-[#8e8880]">
        메시지 캡처나 선물 사진을 올리면
        <br />
        AI가 필요한 내용을 대신 정리해드려요.
      </p>

      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/heic"
        hidden
        onChange={handlePick}
      />
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="relative flex h-[150px] w-full cursor-pointer flex-col items-center justify-center gap-[5px] overflow-hidden rounded-[14px] border-[1.5px] border-dashed border-[#d8cfc5] bg-[#faf7f3] text-[#d57967]"
      >
        {picked ? (
          <>
            {/* 15분 만료 presigned URL 이 아니라 방금 고른 로컬 파일이라 next/image 를 쓰지 않는다. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={picked.previewUrl}
              alt="올린 사진 미리보기"
              className="absolute inset-0 size-full object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 bg-[#211c19]/60 py-1.5 text-[10px] text-white">
              다시 고르려면 눌러주세요
            </span>
          </>
        ) : (
          <>
            <ImagePlus size={28} />
            <b className="text-xs text-[#625c55]">사진 또는 캡처 올리기</b>
            <span className="text-[9px] text-[#a19a92]">JPG, PNG, HEIC</span>
          </>
        )}
      </button>

      <Button full onClick={handleAnalyze} disabled={!picked} className="mt-3">
        <Sparkles size={18} /> AI로 마음 정리하기
      </Button>

      <div className="my-3.5 flex items-center gap-2.5 text-[9px] text-[#aaa49d]">
        <span className="h-px flex-1 bg-line" />
        또는
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button variant="ghost" full onClick={onSkip}>
        <PenLine size={17} /> 사진 없이 직접 입력하기
      </Button>
    </>
  );
}

export default UploadStep;
