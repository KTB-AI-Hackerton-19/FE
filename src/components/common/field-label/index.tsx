type FieldLabelProps = {
  children: React.ReactNode;
  /** 서버가 필수로 막는 칸. 별표로 표시한다 */
  required?: boolean;
  className: string;
};

/** 입력 칸 위 이름표. 필수인 칸은 별표를 붙여 미리 알린다. */
function FieldLabel({ children, required = false, className }: FieldLabelProps) {
  return (
    <span className={className}>
      {children}
      {required ? (
        <b aria-label="필수" className="ml-0.5 text-coral">
          *
        </b>
      ) : null}
    </span>
  );
}

export default FieldLabel;
