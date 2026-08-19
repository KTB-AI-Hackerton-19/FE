type SectionHeadingProps = {
  title: string;
  description?: string;
  label?: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
};

function SectionHeading({ title, description, label, action, id }: SectionHeadingProps) {
  return (
    <div
      id={id}
      className="mt-[34px] mb-4 flex scroll-mt-[90px] items-end justify-between lg:mt-[42px]"
    >
      <div>
        {label}
        <h2 className="mb-[5px] font-title font-bold text-[22px] tracking-[-0.03em]">{title}</h2>
        {description ? <p className="text-[11px] text-[#948f87]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default SectionHeading;
