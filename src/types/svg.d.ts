/** SVGR(next.config.ts 의 turbopack.rules)이 .svg 를 React 컴포넌트로 바꿔 준다. */
declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
}