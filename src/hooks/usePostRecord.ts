'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postRecord } from '@/apis/postRecord';
import { QUERY_KEY } from '@/consts/api';

export const usePostRecord = () => {
  const queryClient = useQueryClient();

  const { mutate: postRecordMutation, isPending: isPostRecordPending } = useMutation({
    mutationFn: postRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.RECORDS });
    },
  });

  return { postRecordMutation, isPostRecordPending };
};
