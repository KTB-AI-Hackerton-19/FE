import type { Metadata } from 'next';

import LoginForm from './_components/LoginForm';

export const metadata: Metadata = {
  title: '로그인 — 마음장부',
};

export default function LoginPage() {
  return <LoginForm />;
}
