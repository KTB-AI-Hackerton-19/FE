type FieldMessageProps = {
  /** 서버가 짚어 준 문구. 없으면 아무것도 그리지 않는다 */
  message?: string;
};

/** 입력 칸 아래 안내 문구. 어느 칸이 잘못됐는지 서버가 알려준 그대로 띄운다. */
function FieldMessage({ message }: FieldMessageProps) {
  if (!message) return null;

  return <span className="text-[9px] text-coral-dark">{message}</span>;
}

export default FieldMessage;
