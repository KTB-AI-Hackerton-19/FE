'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { ApiError } from '@/apis/apiClient';
import Button from '@/components/common/button';
import { usePostLogin, usePostSignup } from '@/hooks/useAuth';

import { loginFormSchema, signupFormSchema } from './loginForm.const';
import type { AuthModeT, LoginFormT } from './loginForm.const';

const fieldClass =
  'rounded-xl border border-line bg-white px-3.5 py-3 text-sm outline-0 focus:border-[#da897a] focus:shadow-[0_0_0_3px_#ed7b6912]';
const labelClass = 'flex flex-col gap-1.5';
const labelTextClass = 'text-[11px] font-bold text-[#817b74]';

function LoginForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthModeT>('login');
  const [serverError, setServerError] = useState('');

  const { postLoginMutation, isPostLoginPending } = usePostLogin();
  const { postSignupMutation, isPostSignupPending } = usePostSignup();

  const isSignup = mode === 'signup';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormT>({
    resolver: zodResolver(isSignup ? signupFormSchema : loginFormSchema),
    defaultValues: { username: '', password: '', name: '' },
  });

  const isPending = isPostLoginPending || isPostSignupPending;
  const message = serverError || Object.values(errors)[0]?.message;

  const handleError = (error: unknown) =>
    setServerError(error instanceof ApiError ? error.message : '잠시 후 다시 시도해주세요.');

  const onSubmit = ({ username, password, name }: LoginFormT) => {
    setServerError('');

    const login = () =>
      postLoginMutation(
        { username, password },
        { onSuccess: () => router.replace('/'), onError: handleError }
      );

    if (!isSignup) {
      login();
      return;
    }

    postSignupMutation(
      { username, password, name: name ?? '' },
      {
        // 가입 직후 같은 자격증명으로 바로 로그인시킨다 (이름은 로그인 응답으로 받는다).
        onSuccess: login,
        onError: handleError,
      }
    );
  };

  const handleToggleMode = () => {
    setMode(current => (current === 'login' ? 'signup' : 'login'));
    setServerError('');
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col justify-center px-6 py-16">
      <div className="mb-8 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-[18px_18px_18px_6px] bg-coral text-white shadow-[0_10px_24px_#ed7b6940]">
          <Heart size={26} fill="currentColor" />
        </div>
        <h1 className="font-logo mt-4 text-[32px] font-extrabold tracking-[-0.01em]">Giftie</h1>
        <p className="mt-1 text-xs text-muted">받은 마음을 잊지 않도록, 기록부터 답례까지</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
        {isSignup ? (
          <label className={labelClass}>
            <span className={labelTextClass}>이름</span>
            <input
              className={fieldClass}
              placeholder="박소영"
              autoComplete="name"
              {...register('name')}
            />
          </label>
        ) : null}

        <label className={labelClass}>
          <span className={labelTextClass}>아이디</span>
          <input className={fieldClass} autoComplete="username" {...register('username')} />
        </label>

        <label className={labelClass}>
          <span className={labelTextClass}>비밀번호</span>
          <input
            type="password"
            className={fieldClass}
            autoComplete={isSignup ? 'new-password' : 'current-password'}
            {...register('password')}
          />
        </label>

        {message ? <p className="text-[11px] text-coral-dark">{message}</p> : null}

        <Button type="submit" full disabled={isPending} className="mt-2">
          {isSignup ? '회원가입하고 시작하기' : '로그인'}
        </Button>
      </form>

      <button
        type="button"
        onClick={handleToggleMode}
        className="mt-5 cursor-pointer text-center text-[11px] text-muted underline underline-offset-4"
      >
        {isSignup ? '이미 계정이 있다면 로그인' : '계정이 없다면 회원가입'}
      </button>
    </main>
  );
}

export default LoginForm;
