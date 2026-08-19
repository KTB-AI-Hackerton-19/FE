'use client';

import { Check } from 'lucide-react';
import { useEffect } from 'react';

import { useAppUi } from '@/hooks/useAppUi';

function Toast() {
  const { toast, hideToast } = useAppUi();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(hideToast, 2600);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  return (
    <output className="fixed bottom-[92px] left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-xl bg-[#2f4b40] px-[18px] py-3 text-xs whitespace-nowrap text-white shadow-[0_12px_35px_#1e302a4d] lg:bottom-[26px]">
      <Check size={18} />
      {toast}
    </output>
  );
}

export default Toast;
