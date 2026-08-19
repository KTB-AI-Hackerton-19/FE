import AppShell from '@/components/common/app-shell';
import AuthGuard from '@/components/common/auth-guard';

type AppLayoutProps = {
  children: React.ReactNode;
};

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <AuthGuard>
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
