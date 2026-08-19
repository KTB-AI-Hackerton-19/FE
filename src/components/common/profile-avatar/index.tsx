import type { VariantProps } from 'class-variance-authority';

import { profileAvatarStyles } from './profileAvatar.style';

type ProfileAvatarProps = VariantProps<typeof profileAvatarStyles> & {
  name: string | null;
  /** 없으면 이름 첫 글자로 대체한다 */
  imageUrl?: string | null;
  className?: string;
};

function ProfileAvatar({ name, imageUrl, size, className }: ProfileAvatarProps) {
  return (
    <span className={profileAvatarStyles({ size, className })}>
      {imageUrl ? (
        /* 15분 만료 presigned URL 이라 호스트가 고정되지 않고 최적화 캐시도 의미가 없어 next/image 를 쓰지 않는다. */
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt={`${name ?? '사용자'} 프로필 사진`}
          className="size-full object-cover"
        />
      ) : (
        (name?.[0] ?? '?')
      )}
    </span>
  );
}

export default ProfileAvatar;
