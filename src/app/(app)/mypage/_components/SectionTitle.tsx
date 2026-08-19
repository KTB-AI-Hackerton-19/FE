type SectionTitleProps = {
  children: React.ReactNode;
};

function SectionTitle({ children }: SectionTitleProps) {
  return (
    <h2 className="mt-7 mb-2.5 font-title font-bold text-[15px] first-of-type:mt-0">{children}</h2>
  );
}

export default SectionTitle;
