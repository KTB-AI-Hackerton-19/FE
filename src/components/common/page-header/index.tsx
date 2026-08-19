type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
};

function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="mb-6 flex items-end justify-between lg:mb-[30px]">
      <div>
        <span className="text-[11px] font-bold text-[#db725f]">{eyebrow}</span>
        <h1 className="mt-[7px] mb-[5px] font-serif text-[27px] tracking-[-0.04em] lg:text-[30px]">
          {title}
        </h1>
        {description ? <p className="text-[11px] text-[#918b83]">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default PageHeader;
