// Astro設定ファイル — DCトレンド研究
// Cloudflare Pages + サイトマップ + MDX + Tailwind CSS + RSS

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // 本番ドメイン（Cloudflare Pages設定と合わせること）
  site: 'https://dc-trend-jp.com',

  // 出力モード: static（Cloudflare Pages に最適）
  // Cloudflareアダプターは不要（static モードは CDN で配信するため）
  output: 'static',

  // URLは末尾スラッシュありに統一する
  // Cloudflare Pages は /articles/foo/index.html を配信するため、
  // スラッシュなしのURLは 301 で /articles/foo/ にリダイレクトされる。
  // canonical・sitemap・内部リンクをすべてスラッシュありに揃えないと、
  // Search Console で「ページにリダイレクトがあります」として除外される。
  trailingSlash: 'always',

  integrations: [
    // MDX対応（記事内でコンポーネント使用可能）
    mdx(),
    // サイトマップ自動生成（Google Search Console向け）
    sitemap({
      // 日本語サイトのデフォルト言語
      i18n: {
        defaultLocale: 'ja',
        locales: { ja: 'ja-JP' },
      },
    }),
    // Tailwind CSS
    tailwind({
      applyBaseStyles: false,
    }),
  ],

  // Markdownの設定
  markdown: {
    // シンタックスハイライト
    syntaxHighlight: 'prism',
  },
});
