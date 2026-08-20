export type RelationshipT = {
  /** 요청에 그대로 넣는 값 (= 한글 라벨) */
  value: string;
  label: string;
  /** enum 이름. 아이콘 매핑처럼 코드가 필요할 때만 쓴다. 직접 만든 관계에는 없다 */
  code: string | null;
};
