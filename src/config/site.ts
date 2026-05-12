// サイト全体の設定定数
// ここを変更するとヘッダー・フッター・OGP等に反映される

export const SITE_CONFIG = {
  name: 'DCトレンド研究',
  description: 'データセンターのトレンドをニュース×解説でお届けする専門メディア',
  url: 'https://dc-trend-jp.com',
  // OGP用デフォルト画像（本番前にPNG/JPGに変換して差し替えること）
  ogImage: '/images/og-default.svg',
  // Twitter/X アカウント（設定後に記入）
  twitterHandle: '',
  // 著者名
  author: 'DCトレンド研究編集部',
} as const;

// カテゴリ定義（スラッグ・表示名・説明）
export const CATEGORIES = [
  {
    slug: 'ai-hpc',
    name: 'AI・HPCインフラ',
    description: 'AI学習・推論基盤、GPUクラスタ、HPC（高性能計算）インフラに関する最新動向',
  },
  {
    slug: 'power-cooling',
    name: '電力・冷却技術',
    description: '液浸冷却・空冷・PUE・電力調達など、データセンターの省エネ・冷却技術の解説',
  },
  {
    slug: 'japan-dc',
    name: '国内DC動向',
    description: '国内大手（NTT・KDDI・さくら等）の新設・拡張・M&A情報と市場動向',
  },
  {
    slug: 'global-dc',
    name: '海外DC動向',
    description: 'AWS・Azure・Googleなどハイパースケーラーや海外M&A・投資情報',
  },
  {
    slug: 'glossary',
    name: '用語解説',
    description: 'データセンター業界の専門用語をわかりやすく解説するSEO向け常設コンテンツ',
  },
  {
    slug: 'market-data',
    name: '市場データ・統計',
    description: '国内外のデータセンター市場規模・投資額・電力消費量などのデータ解説',
  },
] as const;

// カテゴリ名からスラッグを取得するヘルパー
export function getCategorySlug(name: string): string {
  const cat = CATEGORIES.find(c => c.name === name);
  return cat?.slug ?? 'uncategorized';
}

// スラッグからカテゴリ情報を取得するヘルパー
export function getCategoryBySlug(slug: string) {
  return CATEGORIES.find(c => c.slug === slug);
}

// ナビゲーションリンク
export const NAV_LINKS = [
  { href: '/', label: 'トップ' },
  { href: '/category/ai-hpc', label: 'AI・HPC' },
  { href: '/category/power-cooling', label: '電力・冷却' },
  { href: '/category/japan-dc', label: '国内DC' },
  { href: '/category/global-dc', label: '海外DC' },
  { href: '/glossary', label: '用語解説' },
  { href: '/category/market-data', label: '市場データ' },
  { href: '/about', label: 'このサイトについて' },
] as const;
