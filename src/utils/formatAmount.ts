const EOK = 100_000_000;
const MAN = 10_000;
const CHEON = 1_000;

/**
 * 금액을 한글 단위로 끊어 읽는다. 35000 → '3만 5천원', 6250000 → '625만원'
 *
 * 반올림하지 않는다 — 장부라 실제 금액과 달라 보이면 안 된다.
 * 표시용 문자열(price)이 아니라 계산용 숫자(amount)를 받는다.
 */
export const formatAmount = (amount: number) => {
  if (!Number.isFinite(amount) || amount === 0) return '0원';

  const sign = amount < 0 ? '-' : '';
  const value = Math.abs(Math.trunc(amount));

  const eok = Math.floor(value / EOK);
  const man = Math.floor((value % EOK) / MAN);
  const rest = value % MAN;

  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString('ko-KR')}억`);
  if (man > 0) parts.push(`${man.toLocaleString('ko-KR')}만`);

  // 1천 단위로 딱 떨어지면 '5천', 아니면 남은 숫자를 그대로 적는다.
  if (rest > 0) parts.push(rest % CHEON === 0 ? `${rest / CHEON}천` : `${rest}`);

  return `${sign}${parts.join(' ')}원`;
};