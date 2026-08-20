'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Heart, Lock } from 'lucide-react';
import { useForm, useWatch } from 'react-hook-form';

import Button from '@/components/common/button';
import DatePicker from '@/components/common/date-picker';
import RelationPicker from '@/components/common/relation-picker';
import { useGetCategories } from '@/hooks/useGetCategories';
import type { PersonT } from '@/types/person';
import type { GiftRecordT, RecordTypeT } from '@/types/record';
import { formatAmount } from '@/utils/formatAmount';

import AmountInput from './AmountInput';
import CategoryPicker from './CategoryPicker';
import EventFields from './EventFields';
import GuestPicker from './GuestPicker';
import PersonPicker from './PersonPicker';
import {
  EVENT_GIFT_DEFAULTS,
  GIFT_CATEGORY_ADD,
  KIND_TABS,
  emptyRecordForm,
  recordFormSchema,
} from './recordModal.const';
import type { RecordFormT } from './recordModal.const';

const fieldClass =
  'h-9 rounded-[10px] border border-line bg-white px-2.5 text-[11px] outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]';
const labelClass = 'flex flex-col gap-[5px]';
const labelTextClass = 'text-[10px] font-bold text-[#817b74]';

type ConfirmStepProps = {
  defaultValues: RecordFormT;
  isPending: boolean;
  isDraft: boolean;
  /** 사진에서 여러 명이 나온 경우의 DRAFT 들. 사람별 칸 대신 목록으로 보여준다 */
  manyRecords?: GiftRecordT[];
  /** 사람 등록·카테고리 추가 모달이 열려 있는 동안 기록 모달을 감춘다 */
  onSubModalToggle: (isOpen: boolean) => void;
  onSubmit: (values: RecordFormT) => void;
};

function ConfirmStep({
  defaultValues,
  isPending,
  isDraft,
  manyRecords,
  onSubModalToggle,
  onSubmit,
}: ConfirmStepProps) {
  const { categoriesData: giftCategories } = useGetCategories();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    control,
    formState: { errors },
  } = useForm<RecordFormT>({
    resolver: zodResolver(recordFormSchema),
    defaultValues,
  });

  const recordType = useWatch({ control, name: 'recordType' });
  const personName = useWatch({ control, name: 'personName' });
  const category = useWatch({ control, name: 'category' });
  const relation = useWatch({ control, name: 'relation' });
  const eventCategory = useWatch({ control, name: 'eventCategory' });
  const eventDate = useWatch({ control, name: 'eventDate' });
  const guests = useWatch({ control, name: 'guests' });
  const price = useWatch({ control, name: 'price' });
  const date = useWatch({ control, name: 'date' });
  const reminderDate = useWatch({ control, name: 'reminderDate' });

  // AI 초안이 경조사로 왔다면 그 탭에서 시작한다 — 서버가 recordType 을 내려준다.
  const tab = KIND_TABS.find(item => item.key === recordType) ?? KIND_TABS[0];

  /** 자동으로 채워 둔 값인지 — 직접 적은 값은 건드리지 않기 위해 구분한다. */
  const isAutoFilledGift = () =>
    Object.values(EVENT_GIFT_DEFAULTS).some(item => item === getValues('gift').trim());

  const fillEventGift = (nextKind: keyof typeof EVENT_GIFT_DEFAULTS) => {
    if (!getValues('gift').trim() || isAutoFilledGift()) {
      setValue('gift', EVENT_GIFT_DEFAULTS[nextKind]);
    }
  };

  /**
   * 탭을 바꾸면 적어 둔 값과 오류 문구를 모두 비운다.
   * 두 탭은 저장하는 항목이 달라, 남은 값이 안 보이는 채로 저장되면 안 된다.
   */
  const handlePickKind = (next: RecordTypeT) => {
    if (next === recordType) return;

    reset({ ...emptyRecordForm(defaultValues.date), recordType: next });
    if (next === 'EVENT') fillEventGift(getValues('eventGroup'));
  };

  // 등록된 사람을 고르면 관계까지 채우고, 이후 요청은 personId 로 보낸다.
  const handlePickPerson = (person: PersonT) => {
    setValue('personName', person.name);
    setValue('personId', person.id);
    if (person.relation) setValue('relation', person.relation);
  };

  /** 사진 한 장에 여러 명이 있으면 이름·금액은 AI 값을 그대로 두고 목록으로만 보여준다. */
  const isMany = (manyRecords?.length ?? 0) > 1;

  const getTitle = () => {
    if (isMany) return `${manyRecords?.length}명의 마음을 찾았어요`;
    return isDraft ? '이렇게 기록하면 될까요?' : '마음을 기록할게요';
  };

  const firstError = Object.values(errors)[0]?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mx-auto grid size-12 place-items-center rounded-[15px] bg-coral-soft text-coral-deep">
        <Heart size={22} fill="currentColor" />
      </div>
      <h2 className="mt-3.5 mb-1.5 text-center font-title font-bold text-[23px]">{getTitle()}</h2>
      <p className="mb-[15px] text-center text-[11px] leading-[1.7] text-[#8e8880]">
        {tab.description}
      </p>

      {/* AI 가 이미 선물·경조사를 정해 오므로 탭은 직접 입력일 때만 보여준다. */}
      {isDraft ? null : (
        <div className="mb-[15px] flex justify-center">
          <div className="inline-flex gap-1 rounded-[12px] bg-[#f1ede8] p-1">
            {KIND_TABS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => handlePickKind(key)}
                aria-pressed={recordType === key}
                className={`cursor-pointer rounded-[9px] px-4 py-1.5 text-[11px] font-bold transition ${
                  recordType === key
                    ? 'bg-coral text-white shadow-[0_2px_6px_#ed7b6930]'
                    : 'text-[#8b857e] hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* 경조사는 한 행사에 여러 명을 기록하므로 행사를 맨 먼저 정한다. */}
        {tab.isEvent ? (
          <EventFields
            categoryValue={eventCategory}
            onPick={picked => {
              setValue('eventCategory', picked.label);
              setValue('eventGroup', picked.group);
              fillEventGift(picked.group);
            }}
            dateValue={eventDate}
            onDateChange={next => setValue('eventDate', next)}
            labelClass={labelClass}
            labelTextClass={labelTextClass}
            fieldClass={fieldClass}
          />
        ) : null}
        {isMany ? (
          <div className={`${labelClass} col-span-2`}>
            <div className="flex items-center justify-between gap-2">
              <span className={labelTextClass}>보낸 사람 · 금액</span>
              {/* AI 가 읽은 값이라 여기서는 손대지 않는다. */}
              <span className="flex items-center gap-1 text-[9px] text-subtle">
                <Lock size={10} /> 여기서는 수정할 수 없어요
              </span>
            </div>
            {/* 줄 높이(36px)의 배수로 잘라 둔다 — 어중간하면 마지막 줄이 반만 보인다. */}
            <ul className="max-h-[180px] overflow-auto rounded-[12px] border border-line bg-white">
              {manyRecords?.map((record, index) => (
                <li
                  key={record.id}
                  className={`flex h-9 items-center gap-2 px-3 text-[11px] ${
                    index > 0 ? 'border-t border-line' : ''
                  }`}
                >
                  <span className="min-w-0 flex-1 truncate">
                    {record.person || record.extractedSenderName || '이름 없음'}
                  </span>
                  <b className="shrink-0">
                    {record.amount === null ? '금액 미상' : formatAmount(record.amount)}
                  </b>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {/* 경조사는 한 행사에 여러 명이 오므로 보낸 사람을 여러 명 고른다. */}
        {isMany ? null : (
          // 경조사는 관계 칸이 빠지고 칩이 아래로 늘어나므로 한 줄을 다 쓴다.
          <div className={tab.isEvent ? `${labelClass} col-span-2` : labelClass}>
            <span className={labelTextClass}>보낸 사람</span>
            {tab.isEvent ? (
              <GuestPicker
                guests={guests}
                onChange={next => setValue('guests', next)}
                onSubModalToggle={onSubModalToggle}
                className={fieldClass}
              />
            ) : (
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
            )}
          </div>
        )}
        {/* 경조사는 사람마다 관계가 달라 공통 칸을 두지 않는다 — 칩에 각자의 관계가 붙는다. */}
        {isMany || tab.isEvent ? null : (
          <div className={labelClass}>
            <span className={labelTextClass}>관계</span>
            <RelationPicker
              value={relation}
              onChange={next => setValue('relation', next)}
              onSubModalToggle={onSubModalToggle}
              className={fieldClass}
            />
          </div>
        )}
        {isMany ? null : (
          <div className={tab.showOccasion ? labelClass : `${labelClass} col-span-2`}>
            <span className={labelTextClass}>받은 날짜</span>
            <DatePicker
              value={date}
              onChange={next => setValue('date', next)}
              className={fieldClass}
            />
          </div>
        )}
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
        {isMany ? null : (
          <div className={labelClass}>
            <span className={labelTextClass}>금액</span>
            <AmountInput
              value={price}
              onChange={next => setValue('price', next)}
              placeholder={tab.pricePlaceholder}
              className={fieldClass}
            />
          </div>
        )}
        {tab.isEvent ? null : (
          <div className={`${labelClass} col-span-2`}>
            <span className={labelTextClass}>{tab.categoryLabel}</span>
            <CategoryPicker
              value={category}
              categories={giftCategories}
              onChange={name => setValue('category', name)}
              addTitle={GIFT_CATEGORY_ADD.title}
              addNameLabel={GIFT_CATEGORY_ADD.nameLabel}
              addPlaceholder={GIFT_CATEGORY_ADD.placeholder}
              onSubModalToggle={onSubModalToggle}
              className={fieldClass}
            />
          </div>
        )}
        {/* 여러 명일 땐 금액 칸이 빠져 자리가 남는다 — 받은 마음과 한 줄에 둔다. */}
        <div className={isMany ? labelClass : `${labelClass} col-span-2`}>
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
        <Button type="submit" full disabled={isPending}>
          <Heart size={17} /> {isPending ? '저장 중…' : '마음 기록하기'}
        </Button>
      </div>
    </form>
  );
}

export default ConfirmStep;
