import { API } from '@/consts/api';
import type { PresignedUrlT } from '@/types/upload';

import { apiClient } from './apiClient';

export type PostPresignedUrlRequestT = {
  fileName: string;
  contentType: string;
  /** 저장 경로가 갈린다. 생략하면 GIFT */
  purpose?: 'GIFT' | 'PROFILE';
};

export const postPresignedUrl = (body: PostPresignedUrlRequestT) =>
  apiClient.post<PresignedUrlT>(API.PRESIGNED_URL, body);

/**
 * 발급받은 presigned URL로 S3에 직접 PUT 한다.
 * 백엔드를 경유하지 않으므로 인증 헤더를 붙이면 안 된다.
 */
export const putImageToS3 = async ({
  uploadUrl,
  file,
}: {
  uploadUrl: string;
  file: File;
}): Promise<void> => {
  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  if (!response.ok) throw new Error('이미지 업로드에 실패했어요.');
};

/** presigned URL 발급 → S3 업로드까지 한 번에 처리하고 imageKey를 돌려준다. */
const uploadImage = async (file: File, purpose: PostPresignedUrlRequestT['purpose']) => {
  const { imageKey, uploadUrl } = await postPresignedUrl({
    fileName: file.name,
    contentType: file.type,
    purpose,
  });

  await putImageToS3({ uploadUrl, file });
  return imageKey;
};

export const uploadGiftImage = (file: File) => uploadImage(file, 'GIFT');

export const uploadProfileImage = (file: File) => uploadImage(file, 'PROFILE');
