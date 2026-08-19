'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type AppUiValueT = {
  isRecordModalOpen: boolean;
  openRecordModal: () => void;
  closeRecordModal: () => void;
  toast: string;
  showToast: (message: string) => void;
  hideToast: () => void;
};

const AppUiContext = createContext<AppUiValueT | null>(null);

type AppUiProviderProps = {
  children: React.ReactNode;
};

function AppUiProvider({ children }: AppUiProviderProps) {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  const openRecordModal = useCallback(() => setIsRecordModalOpen(true), []);
  const closeRecordModal = useCallback(() => setIsRecordModalOpen(false), []);
  const showToast = useCallback((message: string) => setToast(message), []);
  const hideToast = useCallback(() => setToast(''), []);

  const value = useMemo(
    () => ({
      isRecordModalOpen,
      openRecordModal,
      closeRecordModal,
      toast,
      showToast,
      hideToast,
    }),
    [isRecordModalOpen, openRecordModal, closeRecordModal, toast, showToast, hideToast]
  );

  return <AppUiContext.Provider value={value}>{children}</AppUiContext.Provider>;
}

export const useAppUi = () => {
  const context = useContext(AppUiContext);
  if (!context) throw new Error('useAppUi 는 AppUiProvider 안에서만 사용할 수 있어요.');
  return context;
};

export default AppUiProvider;
