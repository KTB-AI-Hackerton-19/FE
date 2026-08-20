'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { postRelationship } from '@/apis/relationships';
import { QUERY_KEY } from '@/consts/api';

export const usePostRelationship = () => {
  const queryClient = useQueryClient();

  const { mutate: postRelationshipMutation, isPending: isPostRelationshipPending } = useMutation({
    mutationFn: postRelationship,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY.RELATIONSHIPS }),
  });

  return { postRelationshipMutation, isPostRelationshipPending };
};
