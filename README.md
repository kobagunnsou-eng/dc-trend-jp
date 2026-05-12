# DCトレンド研究 (dc-trend-jp)

データセンター専門メディア「DCトレンド研究」のAstroベースWebサイトです。

## 技術スタック

- **フレームワーク**: Astro v5（静的サイト生成）
- **スタイリング**: Tailwind CSS（ダークモード対応）
- **デプロイ先**: Cloudflare Pages
- **コンテンツ管理**: Markdown (MDX)

## セットアップ

```bash
# 依存パッケージのインストール
npm install

# 開発サーバー起動（http://localhost:4321）
npm run dev

# 本番ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## ディレクトリ構成

```
src/
├── config/
│   └── site.ts           # サイト名・カテゴリ・ナビゲーション定義
├── content/
│   ├── config.ts          # コンテンツコレクション定義
│   ├── articles/          # 記事（.md / .mdx）
│   └── glossary/          # 用語解説（.md / .mdx）
├── layouts/
│   ├── BaseLayout.astro   # 全ページ共通レイアウト（OGP・JSON-LD含む）
│   └── ArticleLayout.astro# 記事・用語解説用レイアウト
├── components/
│   ├── Header.astro       # ヘッダー・ナビゲーション
│   ├── Footer.astro       # フッター
│   └── ArticleCard.astro  # 記事カード（一覧表示用）
├── pages/
│   ├── index.astro        # トップページ
│   ├── about.astro        # このサイトについて
│   ├── rss.xml.ts         # RSSフィード
│   ├── articles/[slug].astro  # 記事詳細
│   ├── category/[slug].astro  # カテゴリ一覧
│   └── glossary/
│       ├── index.astro    # 用語解説インデックス
│       └── [slug].astro   # 用語解説詳細
└── styles/
    └── global.css         # グローバルスタイル

public/
├── robots.txt
├── favicon.svg
└── images/
    └── og-default.svg     # OGPデフォルト画像（本番前にPNGに変換）
```

## 記事の追加方法

### 通常記事（src/content/articles/）

```markdown
---
title: "記事タイトル"
slug: "article-slug-in-english"
category: "AI・HPCインフラ"
tags: ["タグ1", "タグ2"]
published_at: "2026-05-12"
summary: "記事の要約（OGP・一覧ページ用）"
---

本文をここに書く...
```

**使えるカテゴリ（category）:**
- `AI・HPCインフラ`
- `電力・冷却技術`
- `国内DC動向`
- `海外DC動向`
- `用語解説`
- `市場データ・統計`

### 用語解説（src/content/glossary/）

```markdown
---
title: "用語名"
slug: "term-slug"
reading: "よみがな（五十音索引用）"
tags: ["タグ1"]
published_at: "2026-05-12"
summary: "一行説明"
related_articles: ["関連記事のslug"]
related_terms: ["関連用語のslug"]
---

本文...
```

## Cloudflare Pagesへのデプロイ

### 前提条件
- GitHubリポジトリへのプッシュ
- Cloudflareアカウント

### 手順

1. **GitHubにプッシュ**
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/dc-trend-jp.git
   git push -u origin main
   ```

2. **Cloudflare Pagesで新規プロジェクト作成**
   - Cloudflare Dashboard → Pages → 「プロジェクトを作成」
   - GitHubリポジトリを接続
   - ビルド設定:
     - **フレームワークプリセット**: Astro
     - **ビルドコマンド**: `npm run build`
     - **ビルド出力ディレクトリ**: `dist`

3. **カスタムドメイン設定**
   - Cloudflare DNS で `dc-trend-jp.com` を設定
   - Pages のカスタムドメインに追加

4. **Google Search Console 登録**
   - `https://dc-trend-jp.com/sitemap-index.xml` を登録

## 今後の追加予定

- [ ] Google AdSense 広告枠の設置（記事20本達成後）
- [ ] Cloudflare D1 を使ったページビュー計測
- [ ] 検索機能（Cloudflare Workers + KV）
- [ ] OGP画像の動的生成（Cloudflare Workers + Canvas API）
- [ ] メールマガジン登録フォーム
