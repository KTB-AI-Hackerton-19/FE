'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Heart } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import DatePicker from '@/components/common/date-picker';
import { useAppUi } from '@/hooks/useAppUi';
import { usePostCategory } from '@/hooks/useCategoryMutations';
import { useGetCategories } from '@/hooks/useGetCategories';
import type { PersonT } from '@/types/person';

import CategoryPicker from './CategoryPicker';
import EventFields from './EventFields';
import PersonPicker from './PersonPicker';
import { GIFT_CATEGORY_ADD, KIND_TABS, recordFormSchema } from './recordModal.const';
import type { KindTabT, RecordFormT } from './recordModal.const';

const fieldClass =
  'h-9 rounded-[10px] border border-line bg-white px-2.5 text-[11px] outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]';
const labelClass = 'flex flex-col gap-[5px]';
const labelTextClass = 'text-[10px] font-bold text-[#817b74]';

type ConfirmStepProps = {
  defaultValues: RecordFormT;
  isPending: boolean;
  isDraft: boolean;
  /** 사람 등록·카테고리 추가 모달이 열려 있는 동안 기록 모달을 감춘다 */
  onSubModalToggle: (isOpen: boolean) => void;
  onSubmit: (values: RecordFormT) => void;
};

function ConfirmStep({
  defaultValues,
  isPending,
  isDraft,
  onSubModalToggle,
  onSubmit,
}: ConfirmStepProps) {
  const { categoriesData: giftCategories } = useGetCategories({ kind: 'GIFT' });
  const { categoriesData: eventCategories } = useGetCategories({ kind: 'EVENT' });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<RecordFormT>({
    resolver: zodResolver(recordFormSchema),
    defaultValues,
  });

  const personName = useWatch({ control, name: 'personName' });
  const category = useWatch({ control, name: 'category' });
  const eventKind = useWatch({ control, name: 'eventKind' });
  const date = useWatch({ control, name: 'date' });
  const reminderDate = useWatch({ control, name: 'reminderDate' });

  const { showToast } = useAppUi();
  const { postCategoryMutation, isPostCategoryPending } = usePostCategory();

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

  // 등록된 사람을 고르면 관계까지 채우고, 이후 요청은 personId 로 보낸다.
  const handlePickPerson = (person: PersonT) => {
    setValue('personName', person.name);
    setValue('personId', person.id);
    if (person.relation) setValue('relation', person.relation);
  };

  /**
   * 경조사는 행사 이름을 직접 적으므로, 없는 이름이면 행사(카테고리)를 먼저 만들고 저장한다.
   * 서버는 모르는 카테고리 이름을 받으면 '기타'로 처리해 버린다.
   */
  const handleFormSubmit = (values: RecordFormT) => {
    if (!tab.isEvent) {
      onSubmit(values);
      return;
    }

    const name = values.category.trim();
    if (eventCategories.some(item => item.name === name)) {
      onSubmit({ ...values, category: name });
      return;
    }

    postCategoryMutation(
      {
        name,
        kind: values.eventKind,
        emoji: values.eventKind === 'CONDOLENCE' ? '🕊️' : '💒',
        color: values.eventKind === 'CONDOLENCE' ? 'blue' : 'gold',
      },
      {
        onSuccess: created => onSubmit({ ...values, category: created.name }),
        onError: error =>
          showToast(error instanceof ApiError ? error.message : '행사를 만들지 못했어요'),
      }
    );
  };

  const firstError = Object.values(errors)[0]?.message;

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)}>
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
                kind === key
                  ? 'bg-coral text-white shadow-[0_2px_6px_#ed7b6930]'
                  : 'text-[#8b857e] hover:text-ink'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* 경조사는 한 행사에 여러 명을 기록하므로 행사를 맨 먼저 정한다. */}
        {tab.isEvent ? (
          <EventFields
            kindValue={eventKind}
            onKindChange={next => setValue('eventKind', next)}
            nameValue={category}
            onNameChange={name => setValue('category', name)}
            events={eventCategories}
            onCreated={(picked, pickedDate) => {
              setValue('category', picked.name);
              if (picked.kind !== 'GIFT') setValue('eventKind', picked.kind);
              // 행사일을 모르는 행사면 이미 적어 둔 날짜를 건드리지 않는다.
              if (pickedDate) setValue('date', pickedDate);
            }}
            onSubModalToggle={onSubModalToggle}
            labelClass={labelClass}
            labelTextClass={labelTextClass}
            fieldClass={fieldClass}
          />
        ) : null}
        <div className={labelClass}>
          <span className={labelTextClass}>보낸 사람</span>
          <PersonPicker
            value={personName}
            onChange={name => {
              setValue('personName', name);
              // 이름을 직접 고치면 골라 둔 사람과 어긋나므로 연결을 끊는다.
              setValue('personId', undefined);
            }}
            onPick={handlePickPerson}
            onSubModalToggle={onSubModalToggle}
            className={fieldClass}
          />
        </div>
        <label className={labelClass}>
          <span className={labelTextClass}>관계</span>
          <input className={fieldClass} {...register('relation')} />
        </label>
        <div className={tab.showOccasion ? labelClass : `${labelClass} col-span-2`}>
          <span className={labelTextClass}>받은 날짜</span>
          <DatePicker
            value={date}
            onChange={next => setValue('date', next)}
            className={fieldClass}
          />
        </div>
        {tab.showOccasion ? (
          <label className={labelClass}>
            <span className={labelTextClass}>받은 이유</span>
            {/* 이 칸은 선물 탭에서만 보이므로 문구도 여기서 정한다. */}
            <input className={fieldClass} placeholder="내 생일" {...register('occasion')} />
          </label>
        ) : null}
        <label className={labelClass}>
          <span className={labelTextClass}>{tab.giftLabel}</span>
          <input className={fieldClass} placeholder={tab.giftPlaceholder} {...register('gift')} />
        </label>
        <label className={labelClass}>
          <span className={labelTextClass}>금액</span>
          <input className={fieldClass} placeholder={tab.pricePlaceholder} {...register('price')} />
        </label>
        {tab.isEvent ? null : (
          <div className={`${labelClass} col-span-2`}>
            <span className={labelTextClass}>{tab.categoryLabel}</span>
            <CategoryPicker
              value={category}
              categories={categories}
              onChange={name => setValue('category', name)}
              addKind={GIFT_CATEGORY_ADD.kind}
              addTitle={GIFT_CATEGORY_ADD.title}
              addNameLabel={GIFT_CATEGORY_ADD.nameLabel}
              addPlaceholder={GIFT_CATEGORY_ADD.placeholder}
              onSubModalToggle={onSubModalToggle}
              className={fieldClass}
            />
          </div>
        )}
        <div className={`${labelClass} col-span-2`}>
          <span className={labelTextClass}>답례 알림일</span>
          <DatePicker
            value={reminderDate}
            onChange={next => setValue('reminderDate', next)}
            placeholder="선택 안 함"
            clearable
            className={fieldClass}
          />
        </div>
      </div>

      {firstError ? <p className="mt-3 text-[10px] text-coral-dark">{firstError}</p> : null}

      <div className="sticky -bottom-[30px] mt-5 bg-[#fffdfa] pt-3">
        <Button type="submit" full disabled={isPending || isPostCategoryPending}>
          <Heart size={17} /> {isPending ? '저장 중…' : '마음 기록하기'}
        </Button>
      </div>
    </form>
  );
}

export default ConfirmStep;
