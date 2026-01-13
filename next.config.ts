import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Cloudflare Pages用の静的エクスポート設定
  output: 'export',

  // 静的エクスポート時は画像最適化を無効化
  images: {
    unoptimized: true,
  },

  // トレーリングスラッシュを追加（Cloudflare Pages推奨）
  trailingSlash: true,
};

export default nextConfig;
