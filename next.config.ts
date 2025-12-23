import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  // 为 ffmpeg.wasm 添加外部化配置
  serverExternalPackages: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  // 允许跨域隔离（ffmpeg-mt 需要）
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
