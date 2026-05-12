// コンテンツコレクション定義
// 記事（articles）と用語解説（glossary）の2コレクション

import { defineCollection, z } from 'astro:content';

// カテゴリの定義（6種）
const CATEGORIES = [
  'AI・HPCインフラ',
  '電力・冷却技術',
  '国内DC動向',
  '海外DC動向',
  '用語解説',
  '市場データ・統計',
] as const;

// 記事コレクション
const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // slug は Astro v5 の予約フィールドのためスキーマ定義不要（entry.id から取得）
    category: z.enum(CATEGORIES),
    tags: z.array(z.string()).default([]),
    published_at: z.string(), // "YYYY-MM-DD" 形式
    summary: z.string(),
    // サムネイル画像（オプション）
    thumbnail: z.string().optional(),
    // 著者（省略時はサイト名）
    author: z.string().default('DCトレンド研究編集部'),
    // 更新日（オプション）
    updated_at: z.string().optional(),
    // 下書きフラグ（trueの場合は本番に表示しない）
    draft: z.boolean().default(false),
  }),
});

// 用語解説コレクション
const glossary = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    // slug は Astro v5 の予約フィールドのためスキーマ定義不要（entry.id から取得）
    // 読み仮名（索引用）
    reading: z.string(),
    // 関連タグ
    tags: z.array(z.string()).default([]),
    published_at: z.string(),
    summary: z.string(),
    // 関連記事スラッグ（内部リンク用）
    related_articles: z.array(z.string()).default([]),
    // 関連用語スラッグ
    related_terms: z.array(z.string()).default([]),
    updated_at: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, glossary };
