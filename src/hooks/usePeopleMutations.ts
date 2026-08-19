'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { deletePeople, patchPerson, postPerson } from '@/apis/people';
import { QUERY_KEY } from '@/consts/api';

/** 사람이 바뀌면 이를 집계하는 화면들도 함께 무효화한다. */
const useInvalidatePeople = () => {
  const queryClient = useQueryClient();

  return () => {
    [QUERY_KEY.PEOPLE, QUERY_KEY.DASHBOARD, QUERY_KEY.GIFT_RECORDS, ['calendar']].forEach(
      queryKey => queryClient.invalidateQueries({ queryKey })
    );
  };
};

export const usePostPerson = () => {
  const invalidate = useInvalidatePeople();

  const { mutate: postPersonMutation, isPending: isPostPersonPending } = useMutation({
    mutationFn: postPerson,
    onSuccess: invalidate,
  });

  return { postPersonMutation, isPostPersonPending };
};

export const usePatchPerson = () => {
  const invalidate = useInvalidatePeople();
  const queryClient = useQueryClient();

  const { mutate: patchPersonMutation, isPending: isPatchPersonPending } = useMutation({
    mutationFn: patchPerson,
    onSuccess: (_data, variables) => {
      invalidate();
      queryClient.invalidateQueries({ queryKey: QUERY_KEY.PERSON(variables.id) });
    },
  });

  return { patchPersonMutation, isPatchPersonPending };
};

export const useDeletePeople = () => {
  const invalidate = useInvalidatePeople();

  const { mutate: deletePeopleMutation, isPending: isDeletePeoplePending } = useMutation({
    mutationFn: deletePeople,
    onSuccess: invalidate,
  });

  return { deletePeopleMutation, isDeletePeoplePending };
};
