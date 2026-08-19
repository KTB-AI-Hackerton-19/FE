'use client';

import { useGetDashboard } from '@/hooks/useGetDashboard';
import { formatFullKoreanDate } from '@/utils/formatDate';

function WelcomeSection() {
  const { dashboardData } = useGetDashboard();

  return (
    <section className="flex min-h-[145px] items-center justify-between lg:min-h-[180px]">
      <div>
        <span className="text-xs font-semibold tracking-[0.03em] text-[#96918a]">
          {dashboardData ? formatFullKoreanDate(dashboardData.today) : ' '}
        </span>
        <h1 className="mt-[9px] font-title font-bold text-[29px] leading-[1.42] tracking-[-0.04em] lg:text-[34px]">
          오늘도 소중한 마음을
          <br />
          <em className="text-coral-deep not-italic">잊지 않게 챙겨드릴게요.</em>
        </h1>
      </div>

      <div className="relative mr-[30px] hidden size-[170px] h-[140px] place-items-center rounded-[48%_52%_55%_45%] bg-[#f5e5df] lg:grid">
        <span className="rotate-[-7deg] text-[63px] drop-shadow-[0_10px_10px_#c4776630]">💌</span>
        <div className="absolute top-[18px] -right-1.5 grid size-8 place-items-center rounded-full bg-white text-coral shadow-[0_8px_20px_#6d4e4518]">
          ♥
        </div>
        <div className="absolute bottom-3.5 -left-[5px] grid size-8 place-items-center rounded-full bg-white text-[#789482] shadow-[0_8px_20px_#6d4e4518]">
          ✦
        </div>
      </div>
    </section>
  );
}

export default WelcomeSection;
