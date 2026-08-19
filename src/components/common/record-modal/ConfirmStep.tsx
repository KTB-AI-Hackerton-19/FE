'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Heart } from 'lucide-react';
import { useForm } from 'react-hook-form';

import Button from '@/components/common/button';
import { CATEGORIES } from '@/consts/record';

import { recordFormSchema } from './recordModal.const';
import type { RecordFormT } from './recordModal.const';

const fieldClass =
  'rounded-[10px] border border-line bg-white p-2.5 text-[11px] outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]';
const labelClass = 'flex flex-col gap-[5px]';
const labelTextClass = 'text-[10px] font-bold text-[#817b74]';

type ConfirmStepProps = {
  defaultValues: RecordFormT;
  isPending: boolean;
  onBack: () => void;
  onSubmit: (values: RecordFormT) => void;
};

function ConfirmStep({ defaultValues, isPending, onBack, onSubmit }: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RecordFormT>({
    resolver: zodResolver(recordFormSchema),
    defaultValues,
  });

  const firstError = Object.values(errors)[0]?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto grid size-12 place-items-center rounded-[15px] bg-[#eaf4ee] text-[#648673]">
        <Check />
      </div>
      <h2 className="mt-3.5 mb-1.5 text-center font-serif text-[23px]">이렇게 기록하면 될까요?</h2>
      <p className="mb-[19px] text-center text-[11px] leading-[1.7] text-[#8e8880]">
        금액과 카테고리, 알림일을 확인해주세요.
      </p>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        <label className={labelClass}>
          <span className={labelTextClass}>보낸 사람</span>
          <input className={fieldClass} {...register('person')} />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>관계</span>
          <input className={fieldClass} {...register('relation')} />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>받은 날짜</span>
          <input type="date" className={fieldClass} {...register('date')} />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>받은 이유</span>
          <input className={fieldClass} {...register('occasion')} />
        </label>
        <label className={`${labelClass} col-span-2`}>
          <span className={labelTextClass}>선물</span>
          <input className={fieldClass} {...register('gift')} />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>금액</span>
          <input className={fieldClass} {...register('price')} />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>선물 카테고리</span>
          <select className={fieldClass} {...register('category')}>
            {CATEGORIES.map(category => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <label className={`${labelClass} col-span-2`}>
          <span className={labelTextClass}>답례 알림일</span>
          <input type="date" className={fieldClass} {...register('reminderDate')} />
        </label>
      </div>

      {firstError ? <p className="mt-3 text-[10px] text-coral-dark">{firstError}</p> : null}

      <div className="sticky -bottom-[30px] mt-5 flex justify-end gap-2 bg-[#fffdfa] pt-3">
        <Button variant="ghost" onClick={onBack} className="flex-1 sm:flex-none">
          다시 입력
        </Button>
        <Button type="submit" disabled={isPending} className="flex-1 sm:flex-none">
          <Heart size={17} /> 마음 기록하기
        </Button>
      </div>
    </form>
  );
}

export default ConfirmStep;
