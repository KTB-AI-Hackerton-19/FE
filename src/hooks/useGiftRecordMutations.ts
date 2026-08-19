'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchGiftRecord, postGiftRecord, postGiftRecordExtract } from '@/apis/giftRecord';
import { uploadGiftImage } from '@/apis/uploadImage';
import { QUERY_KEY } from '@/consts/api';

/** 기록이 바뀌면 이를 집계하는 화면들도 함께 무효화한다. */
const useInvalidateRecords = () => {
  const queryClient = useQueryClient();

  return () => {
    [
      QUERY_KEY.GIFT_RECORDS,
      QUERY_KEY.DASHBOARD,
      QUERY_KEY.PEOPLE,
      QUERY_KEY.CATEGORIES,
      QUERY_KEY.RECOMMENDATIONS,
      ['calendar'],
    ].forEach(queryKey => queryClient.invalidateQueries({ queryKey }));
  };
};

export const usePostGiftRecord = () => {
  const invalidate = useInvalidateRecords();

  const { mutate: postGiftRecordMutation, isPending: isPostGiftRecordPending } = useMutation({
    mutationFn: postGiftRecord,
    onSuccess: invalidate,
  });

  return { postGiftRecordMutation, isPostGiftRecordPending };
};

export const usePatchGiftRecord = () => {
  const invalidate = useInvalidateRecords();

  const { mutate: patchGiftRecordMutation, isPending: isPatchGiftRecordPending } = useMutation({
    mutationFn: patchGiftRecord,
    onSuccess: invalidate,
  });

  return { patchGiftRecordMutation, isPatchGiftRecordPending };
};

/** 이미지 업로드(S3 직접 PUT) → AI 분석 → DRAFT 기록 생성까지 한 흐름으로 묶는다. */
export const usePostGiftRecordExtract = () => {
  const { mutate: postGiftRecordExtractMutation, isPending: isPostGiftRecordExtractPending } =
    useMutation({
      mutationFn: async (file: File) => {
        const imageKey = await uploadGiftImage(file);
        return postGiftRecordExtract({ imageKey });
      },
    });

  return { postGiftRecordExtractMutation, isPostGiftRecordExtractPending };
};
