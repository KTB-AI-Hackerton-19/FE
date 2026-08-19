type PageContainerProps = {
  children: React.ReactNode;
  /** 서브 페이지는 상단 여백을 조금 더 준다. */
  subpage?: boolean;
  narrow?: boolean;
};

function PageContainer({ children, subpage = false, narrow = false }: PageContainerProps) {
  return (
    <main
      className={[
        'mx-auto w-full px-[15px] pb-[103px] sm:px-[18px] lg:px-[5.2vw] lg:pb-20',
        narrow ? 'max-w-[920px]' : 'max-w-[1180px]',
        subpage ? 'pt-7 lg:pt-12' : 'pt-[18px] sm:pt-6 lg:pt-[45px]',
      ].join(' ')}
    >
      {children}
    </main>
  );
}

export default PageContainer;
