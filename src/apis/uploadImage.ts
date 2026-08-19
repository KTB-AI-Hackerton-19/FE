import { API } from '@/consts/api';
import type { PresignedUrlT } from '@/types/upload';

import { apiClient } from './apiClient';

export type PostPresignedUrlRequestT = {
  fileName: string;
  contentType: string;
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
export const uploadGiftImage = async (file: File): Promise<string> => {
  const { imageKey, uploadUrl } = await postPresignedUrl({
    fileName: file.name,
    contentType: file.type,
  });

  await putImageToS3({ uploadUrl, file });
  return imageKey;
};
