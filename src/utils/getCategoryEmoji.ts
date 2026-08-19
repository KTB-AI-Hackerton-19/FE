import { CATEGORY_ACCENT, CATEGORY_EMOJI } from '@/consts/record';
import type { AccentT, CategoryT } from '@/types/record';

export const getCategoryEmoji = (category: CategoryT): string =>
  CATEGORY_EMOJI[category] ?? CATEGORY_EMOJI['기타'];

export const getCategoryAccent = (category: CategoryT): AccentT =>
  CATEGORY_ACCENT[category] ?? 'gold';
