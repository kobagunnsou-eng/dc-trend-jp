# Production Port — dc-trend-jp Editorial Refresh

本番リポジトリ `kobagunnsou-eng/dc-trend-jp` に **そのままコミットできる形** のファイル群です。

## ファイル一覧と適用先

| このフォルダ内のパス | リポジトリ内のパス | 操作 |
|---|---|---|
| `tailwind.config.mjs` | `tailwind.config.mjs` | **置き換え** — `fontFamily.serif` と `fontFamily.mono` を追加 |
| `src/styles/global.css` | `src/styles/global.css` | **置き換え** — Noto Serif JP + JetBrains Mono の `@import` 追加、body line-height 微調整 |
| `src/components/Header.astro` | `src/components/Header.astro` | **置き換え** — 日付ストリップ・明朝体ワードマーク・ナビ下線アクセント |
| `src/components/ArticleCard.astro` | `src/components/ArticleCard.astro` | **置き換え** — variant プロップ追加 (`hero` / `feature` / `standard` / `list` / `compact`) |
| `src/components/Icon.astro` | `src/components/Icon.astro` | **新規** — Heroicons outline 24/2 をインライン化（絵文字の置き換え） |
| `src/components/Thumbnail.astro` | `src/components/Thumbnail.astro` | **新規** — カテゴリ別 SVG プレースホルダ |
| `src/components/SectionHeader.astro` | `src/components/SectionHeader.astro` | **新規** — 編集メディア風セクション見出し |
| `src/components/Sidebar.astro` | `src/components/Sidebar.astro` | **新規** — 右レール（人気記事 / 用語をひく / About strip） |
| `src/components/NewsTicker.astro` | `src/components/NewsTicker.astro` | **新規** — 最上部の "LATEST" ストリップ |
| `src/pages/index.astro` | `src/pages/index.astro` | **置き換え** — 編集メディア風レイアウト全面リライト |

**Footer.astro / ArticleLayout.astro / 他ページは未変更** です。本ポートは「ホームページ＋共通ヘッダー」のみを対象としています。次フェーズで `article detail` と `glossary` を仕上げる場合は別途生成します。

## ローカルへ適用する手順

```bash
# 1. dc-trend-jp リポジトリで作業ブランチを切る
cd /path/to/dc-trend-jp
git checkout -b design/editorial-refresh

# 2. このフォルダ（production-port/）の中身を、リポジトリのルートに上書きコピー
#    Macなら：
cp -r /path/to/production-port/* /path/to/dc-trend-jp/

#    Windowsなら（PowerShell）：
Copy-Item -Path "C:\path\to\production-port\*" -Destination "C:\path\to\dc-trend-jp\" -Recurse -Force

# 3. 動作確認
npm install      # 依存関係はそのまま — 新規パッケージ追加なし
npm run dev      # http://localhost:4321 でホームページを確認

# 4. コミット
git add .
git commit -m "design: editorial refresh — serif hero, ranking sidebar, themed thumbnails"
git push -u origin design/editorial-refresh

# 5. GitHub で PR を開く
#    → Cloudflare Pages の preview デプロイが自動で動きます
#    → 問題なければ main にマージ → 本番反映
```

## 動作確認チェックリスト

ブランチを切ってローカルで `npm run dev` を起動した後、以下を確認してください：

- [ ] ホームページ `/` でヘッダー上部に「2026年X月X日(X)」が表示される
- [ ] ワードマークが **明朝体** で表示される（`Noto Serif JP` が読み込まれているか）
- [ ] 右上に検索アイコン＋ダークモードトグル
- [ ] ナビ列下に **LATEST バー**（黒背景の薄いストライプ）
- [ ] ヒーロー記事が **明朝体の大見出し** で表示される
- [ ] サムネイルが各記事カテゴリ別の SVG モチーフ（rack/circuit/power 等）で表示
- [ ] 右側にランキングウィジェット「人気記事 WEEKLY」と「用語をひく GLOSSARY」が並ぶ
- [ ] ダークモードに切り替えても破綻しない
- [ ] モバイル表示（lg未満）で1カラムに折り畳まれる

## 既知の制限・注意

- **「人気記事」ランキングは現状ダミー** で、`all.slice(0, 5)` で直近5件を仮置きしています。本物のPVベースランキングが欲しい場合、Cloudflare D1 もしくは Plausible/GA4 APIとの連携が必要です。ロードマップにある `Cloudflare D1 を使ったページビュー計測` のタイミングで差し替えてください。
- **検索ボタンは no-op** です。ロードマップの `Cloudflare Workers + KV` 検索が実装されるまでプレースホルダのまま。
- **明朝体は新規導入** です。本番フォント読み込みが増えるため、Lighthouse の First Contentful Paint が若干（〜100ms程度）伸びます。気になる場合は `font-display: swap` がすでに効いているはずなので、表示は速い側です。
- **サムネイルは SVG プレースホルダ**。実写真を入れる場合、`Thumbnail.astro` を改修して `src` プロパティを受けて `<img>` をレンダリングする分岐を追加してください（記事 frontmatter にすでに `thumbnail?: string` フィールドが用意されています）。
- **記事詳細 / 用語解説 / カテゴリページ / About は未変更** です。今回のホームページと合わせるなら追加ポートが必要。

## 切り戻し

何か問題があったら、PR を閉じるかリバートコミットを打つだけです：

```bash
git checkout main
git branch -D design/editorial-refresh
```

不要なファイルが残ることはありません。すべて新規追加 or 既存ファイルの置き換えで、削除はなし。
