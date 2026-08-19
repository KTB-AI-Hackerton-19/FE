'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { patchCategory, postCategory } from '@/apis/categories';
import { QUERY_KEY } from '@/consts/api';

const useInvalidateCategories = () => {
  const queryClient = useQueryClient();

  return () => {
    [QUERY_KEY.CATEGORIES, QUERY_KEY.GIFT_RECORDS, QUERY_KEY.DASHBOARD].forEach(queryKey =>
      queryClient.invalidateQueries({ queryKey })
    );
  };
};

export const usePostCategory = () => {
  const invalidate = useInvalidateCategories();

  const { mutate: postCategoryMutation, isPending: isPostCategoryPending } = useMutation({
    mutationFn: postCategory,
    onSuccess: invalidate,
  });

  return { postCategoryMutation, isPostCategoryPending };
};

export const usePatchCategory = () => {
  const invalidate = useInvalidateCategories();

  const { mutate: patchCategoryMutation, isPending: isPatchCategoryPending } = useMutation({
    mutationFn: patchCategory,
    onSuccess: invalidate,
  });

  return { patchCategoryMutation, isPatchCategoryPending };
};
