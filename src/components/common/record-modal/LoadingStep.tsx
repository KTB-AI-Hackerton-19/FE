import { Heart } from 'lucide-react';

function LoadingStep() {
  return (
    <div className="py-11 text-center">
      <div className="mx-auto grid size-[65px] animate-pulse place-items-center rounded-[22px] bg-coral-soft text-coral">
        <Heart size={28} fill="currentColor" />
      </div>
      <h2 className="mt-[22px] font-title font-bold text-[23px]">마음 속 정보를 살펴보고 있어요</h2>
      <p className="text-[11px] text-[#938d85]">보낸 사람과 선물, 날짜를 정리하는 중이에요.</p>
      {/* 실제로 10초 안팎이 걸린다. 얼마나 기다려야 하는지 미리 알려 준다. */}
      <p className="mt-1.5 text-[10px] text-subtle">10초쯤 걸려요. 잠시만 기다려주세요.</p>
      <div className="mt-6 flex justify-center gap-[5px]">
        {[0, 1, 2].map(index => (
          <i
            key={index}
            className="size-[7px] animate-bounce rounded-full bg-[#e28a7b]"
            style={{ animationDelay: `${index * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
}

export default LoadingStep;
