/** @type {import('next').NextConfig} */

// GitHub Pages 静态导出开关：NEXT_EXPORT=1 时启用（本地/Vercel 正常模式不受影响）
// 用法见 scripts/deploy-pages.sh；basePath 对应 https://newhgg.github.io/ai-campus/
const isExport = process.env.NEXT_EXPORT === "1";

const nextConfig = {
  ...(isExport
    ? {
        output: "export",
        basePath: "/ai-campus",
        assetPrefix: "/ai-campus",
        env: { NEXT_PUBLIC_BASE_PATH: "/ai-campus" },
      }
    : {}),
  images: { unoptimized: isExport },
};

export default nextConfig;
