'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, Heart } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/button';
import { useGetCategories } from '@/hooks/useGetCategories';

import { KIND_TABS, recordFormSchema } from './recordModal.const';
import type { KindTabT, RecordFormT } from './recordModal.const';

const fieldClass =
  'rounded-[10px] border border-line bg-white p-2.5 text-[11px] outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]';
const labelClass = 'flex flex-col gap-[5px]';
const labelTextClass = 'text-[10px] font-bold text-[#817b74]';

type ConfirmStepProps = {
  defaultValues: RecordFormT;
  isPending: boolean;
  isDraft: boolean;
  onSubmit: (values: RecordFormT) => void;
};

function ConfirmStep({ defaultValues, isPending, isDraft, onSubmit }: ConfirmStepProps) {
  const { categoriesData: giftCategories } = useGetCategories({ kind: 'GIFT' });
  const { categoriesData: eventCategories } = useGetCategories({ kind: 'EVENT' });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<RecordFormT>({
    resolver: zodResolver(recordFormSchema),
    defaultValues,
  });

  const [pickedKind, setPickedKind] = useState<KindTabT | null>(null);

  // AI 초안이 경조사 카테고리를 골라 왔다면 그 탭에서 시작한다.
  // 목록이 늦게 도착해도 effect 없이 계산으로 따라가도록 파생값으로 둔다.
  const isDefaultEvent = eventCategories.some(item => item.name === defaultValues.category);
  const kind: KindTabT = pickedKind ?? (isDefaultEvent ? 'EVENT' : 'GIFT');

  const tab = KIND_TABS.find(item => item.key === kind) ?? KIND_TABS[0];
  const categories = kind === 'EVENT' ? eventCategories : giftCategories;

  const handlePickKind = (next: KindTabT) => {
    setPickedKind(next);

    // 다른 탭에는 없는 카테고리가 남아 있으면 비운다.
    const nextCategories = next === 'EVENT' ? eventCategories : giftCategories;
    if (!nextCategories.some(item => item.name === getValues('category'))) {
      setValue('category', '');
    }

    // 경조사 탭에는 '받은 이유' 칸이 없으니, 안 보이는 값이 몰래 저장되지 않도록 비운다.
    if (next === 'EVENT') setValue('occasion', '');
  };

  const firstError = Object.values(errors)[0]?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto grid size-12 place-items-center rounded-[15px] bg-coral-soft text-coral-deep">
        <Heart size={22} fill="currentColor" />
      </div>
      <h2 className="mt-3.5 mb-1.5 text-center font-title font-bold text-[23px]">
        {isDraft ? '이렇게 기록하면 될까요?' : '마음을 기록할게요'}
      </h2>
      <p className="mb-[15px] text-center text-[11px] leading-[1.7] text-[#8e8880]">
        금액과 카테고리, 알림일을 확인해주세요.
      </p>

      <div className="mb-[15px] flex justify-center">
        <div className="inline-flex gap-1 rounded-[12px] bg-[#f1ede8] p-1">
          {KIND_TABS.map(({ key, label }) => (
            <button
              key={key}
              type="button"
              onClick={() => handlePickKind(key)}
              aria-pressed={kind === key}
              className={`cursor-pointer rounded-[9px] px-4 py-1.5 text-[11px] font-bold transition ${
                kind === key ? 'bg-white text-ink shadow-[0_2px_6px_#4b3a320f]' : 'text-[#8b857e]'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <label className={labelClass}>
          <span className={labelTextClass}>보낸 사람</span>
          <input className={fieldClass} {...register('personName')} />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>관계</span>
          <input className={fieldClass} {...register('relation')} />
        </label>
        <label className={tab.showOccasion ? labelClass : `${labelClass} col-span-2`}>
          <span className={labelTextClass}>받은 날짜</span>
          <input type="date" className={fieldClass} {...register('date')} />
        </label>
        {tab.showOccasion ? (
          <label className={labelClass}>
            <span className={labelTextClass}>받은 이유</span>
            <input className={fieldClass} {...register('occasion')} />
          </label>
        ) : null}
        <label className={`${labelClass} col-span-2`}>
          <span className={labelTextClass}>{tab.giftLabel}</span>
          <input className={fieldClass} placeholder={tab.giftPlaceholder} {...register('gift')} />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>금액</span>
          <input className={fieldClass} placeholder={tab.pricePlaceholder} {...register('price')} />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>{tab.categoryLabel}</span>
          {/* 기본 화살표는 오른쪽 끝에 붙어 있어 감추고 안쪽에 직접 그린다. */}
          <span className="relative block">
            <select
              className={`${fieldClass} w-full appearance-none pr-8`}
              {...register('category')}
            >
              <option value="">선택</option>
              {categories.map(category => (
                <option key={category.id} value={category.name}>
                  {category.emoji} {category.name}
                </option>
              ))}
            </select>
            <ChevronDown
              size={14}
              className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-subtle"
            />
          </span>
        </label>
        <label className={`${labelClass} col-span-2`}>
          <span className={labelTextClass}>답례 알림일</span>
          <input type="date" className={fieldClass} {...register('reminderDate')} />
        </label>
      </div>

      {firstError ? <p className="mt-3 text-[10px] text-coral-dark">{firstError}</p> : null}

      <div className="sticky -bottom-[30px] mt-5 bg-[#fffdfa] pt-3">
        <Button type="submit" full disabled={isPending}>
          <Heart size={17} /> {isPending ? '저장 중…' : '마음 기록하기'}
        </Button>
      </div>
    </form>
  );
}

export default ConfirmStep;
