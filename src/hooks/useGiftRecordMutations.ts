'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  deleteGiftRecord,
  deleteGiftRecords,
  patchGiftRecord,
  patchGiftRecordThanked,
  patchGiftRecordsBulk,
  postGiftRecord,
  postGiftRecordExtract,
  postGiftRecordsBulk,
} from '@/apis/giftRecord';
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

export const usePatchGiftRecordThanked = () => {
  const invalidate = useInvalidateRecords();

  const { mutate: patchGiftRecordThankedMutation, isPending: isPatchGiftRecordThankedPending } =
    useMutation({
      mutationFn: patchGiftRecordThanked,
      onSuccess: invalidate,
    });

  return { patchGiftRecordThankedMutation, isPatchGiftRecordThankedPending };
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

/** 한 행사에 여러 명을 한 번에 등록한다. */
export const usePostGiftRecordsBulk = () => {
  const invalidate = useInvalidateRecords();

  const { mutate: postGiftRecordsBulkMutation, isPending: isPostGiftRecordsBulkPending } =
    useMutation({ mutationFn: postGiftRecordsBulk, onSuccess: invalidate });

  return { postGiftRecordsBulkMutation, isPostGiftRecordsBulkPending };
};

/** AI 가 만든 DRAFT 여러 건을 한 번에 확정한다. */
export const usePatchGiftRecordsBulk = () => {
  const invalidate = useInvalidateRecords();

  const { mutate: patchGiftRecordsBulkMutation, isPending: isPatchGiftRecordsBulkPending } =
    useMutation({ mutationFn: patchGiftRecordsBulk, onSuccess: invalidate });

  return { patchGiftRecordsBulkMutation, isPatchGiftRecordsBulkPending };
};

export const useDeleteGiftRecord = () => {
  const invalidate = useInvalidateRecords();

  const { mutate: deleteGiftRecordMutation, isPending: isDeleteGiftRecordPending } = useMutation({
    mutationFn: deleteGiftRecord,
    onSuccess: invalidate,
  });

  return { deleteGiftRecordMutation, isDeleteGiftRecordPending };
};

export const useDeleteGiftRecords = () => {
  const invalidate = useInvalidateRecords();

  const { mutate: deleteGiftRecordsMutation, isPending: isDeleteGiftRecordsPending } = useMutation({
    mutationFn: deleteGiftRecords,
    onSuccess: invalidate,
  });

  return { deleteGiftRecordsMutation, isDeleteGiftRecordsPending };
};
