import BrandPanel from './_components/BrandPanel';
import LoginForm from './_components/LoginForm';

export default function LoginPage() {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <BrandPanel />
      <LoginForm />
    </main>
  );
}
