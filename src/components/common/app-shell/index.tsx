import BottomNav from '@/components/common/bottom-nav';
import RecordModal from '@/components/common/record-modal';
import Sidebar from '@/components/common/sidebar';
import Toast from '@/components/common/toast';
import Topbar from '@/components/common/topbar';

type AppShellProps = {
  children: React.ReactNode;
};

function AppShell({ children }: AppShellProps) {
  return (
    <div className="mx-auto flex min-h-screen max-w-[560px] flex-col bg-cream shadow-[0_0_50px_#30251e16] lg:max-w-none lg:shadow-none">
      <Sidebar />
      <div className="flex w-full flex-1 flex-col lg:ml-[244px] lg:w-[calc(100%-244px)]">
        <Topbar />
        {children}
      </div>
      <BottomNav />
      <RecordModal />
      <Toast />
    </div>
  );
}

export default AppShell;
