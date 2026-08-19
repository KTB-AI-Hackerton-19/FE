import type { NextConfig } from 'next';

/**
 * 브라우저 → Next 서버 → 백엔드로 프록시한다.
 * 백엔드가 인증 경로의 OPTIONS preflight 를 401 로 막고 있어 브라우저에서 직접 호출할 수 없기 때문이다.
 * (같은 오리진이 되므로 preflight 자체가 발생하지 않는다.)
 * 백엔드 CORS 가 정리되면 NEXT_PUBLIC_API_BASE_URL 에 백엔드 주소를 넣어 직접 호출로 전환하면 된다.
 */
const apiProxyTarget = process.env.API_PROXY_TARGET?.replace(/\/$/, '');

const nextConfig: NextConfig = {
  async rewrites() {
    if (!apiProxyTarget) return [];

    return [
      {
        source: '/api/:path*',
        destination: `${apiProxyTarget}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
