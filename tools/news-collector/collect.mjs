#!/usr/bin/env node
/**
 * DCトレンド研究 ニュース収集ツール
 *
 * RSS/Google Newsからデータセンター関連ニュースを収集し、
 *   1. サイトのカテゴリに自動分類したデータアーカイブ (data/archive/)
 *   2. 記事ネタ選定用のダイジェストMarkdown (data/digest/)
 *   3. キーワード出現数の時系列トレンド (data/trends.csv)
 * を生成する。--draft で「今週のDCニュースまとめ」記事ドラフトも出力。
 *
 * 使い方:
 *   node tools/news-collector/collect.mjs           # 収集 + ダイジェスト生成
 *   node tools/news-collector/collect.mjs --draft   # 直近7日分から週間まとめ記事ドラフト生成
 *   node tools/news-collector/collect.mjs --days 14 --draft
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(TOOL_DIR, "data");
const ARCHIVE_DIR = path.join(DATA_DIR, "archive");
const DIGEST_DIR = path.join(DATA_DIR, "digest");
const DRAFT_DIR = path.join(DATA_DIR, "drafts");
const SEEN_FILE = path.join(DATA_DIR, "seen.json");
const TRENDS_FILE = path.join(DATA_DIR, "trends.csv");

// ---- サイトのカテゴリに対応した分類キーワード --------------------------------
// score: そのキーワードが出た時の加点。カテゴリ判定は合計点が最大のもの。
const CATEGORIES = {
  "AI・HPC インフラ": [
    "GPU", "NVIDIA", "エヌビディア", "Blackwell", "HBM", "生成AI", "LLM",
    "AIデータセンター", "AI DC", "スーパーコンピュータ", "HPC", "推論", "学習基盤",
    "AI infrastructure", "AI factory", "GB200", "TPU",
  ],
  "電力・冷却技術": [
    "液冷", "液浸", "冷却", "PUE", "電力", "再エネ", "再生可能エネルギー",
    "SMR", "原子力", "原発", "蓄電", "PPA", "送電", "系統", "変電",
    "liquid cooling", "immersion", "nuclear", "grid", "power", "megawatt", "GW",
  ],
  "国内DC動向": [
    "NTT", "KDDI", "ソフトバンク", "さくらインターネット", "IIJ", "楽天",
    "石狩", "印西", "千葉", "北海道", "大阪", "東京", "九州", "国内",
    "日本", "Japan", "総務省", "経産省", "経済産業省", "ガバメントクラウド",
  ],
  "海外DC動向": [
    "M&A", "買収", "Microsoft", "AWS", "Amazon", "Google", "Meta", "OpenAI",
    "Oracle", "Equinix", "Digital Realty", "Blackstone", "ブラックストーン",
    "米国", "欧州", "中国", "インド", "シンガポール", "hyperscale", "ハイパースケール",
    "billion", "acquisition", "data center campus",
    "Stargate", "CoreWeave", "xAI", "Anthropic", "Nebius",
    "Texas", "Virginia", "Ohio", "Ireland", "テキサス", "バージニア",
    "lawmakers", "governor", "moratorium", "zoning", "utility",
  ],
  "市場データ・統計": [
    "市場規模", "調査", "予測", "レポート", "統計", "シェア", "成長率",
    "IDC", "ガートナー", "Gartner", "富士キメラ", "矢野経済", "forecast", "market",
  ],
};

// 全記事共通の関連度キーワード(Google Newsのノイズ除去用)
const RELEVANCE_KEYWORDS = [
  "データセンター", "DC", "サーバ", "クラウド", "GPU", "AI", "液冷", "液浸",
  "電力", "冷却", "ラック", "コロケーション", "ハイパースケール",
  "data center", "datacenter", "cloud", "colocation", "server",
];

// trends.csv に記録する追跡キーワード(記事の統計ネタになる)
// 英語メディア(DCD・DCK)もカウントできるよう、各ラベルに英語シノニムを持たせる
const TREND_KEYWORDS = [
  { label: "液冷", patterns: ["液冷", "liquid cooling", "direct-to-chip"] },
  { label: "液浸", patterns: ["液浸", "immersion"] },
  { label: "GPU", patterns: ["GPU"] },
  { label: "NVIDIA", patterns: ["NVIDIA", "エヌビディア"] },
  { label: "生成AI", patterns: ["生成AI", "generative AI"] },
  { label: "電力", patterns: ["電力", "electricity", "megawatt", "gigawatt", "MW", "GW"] },
  { label: "再エネ", patterns: ["再エネ", "再生可能エネルギー", "renewable"] },
  { label: "SMR", patterns: ["SMR"] },
  { label: "原子力", patterns: ["原子力", "原発", "nuclear"] },
  { label: "M&A", patterns: ["M&A", "merger"] },
  { label: "買収", patterns: ["買収", "acquisition", "acquires"] },
  { label: "投資", patterns: ["投資", "investment", "invests"] },
  { label: "新設", patterns: ["新設", "new campus", "new facility"] },
  { label: "着工", patterns: ["着工", "groundbreaking", "breaks ground"] },
  { label: "PUE", patterns: ["PUE"] },
  { label: "ハイパースケール", patterns: ["ハイパースケール", "hyperscale"] },
  { label: "国産クラウド", patterns: ["国産クラウド", "ソブリンクラウド", "sovereign cloud"] },
  { label: "ガバメントクラウド", patterns: ["ガバメントクラウド"] },
  { label: "蓄電", patterns: ["蓄電", "battery storage", "BESS"] },
  { label: "PPA", patterns: ["PPA"] },
];

const countTrend = (text, patterns) =>
  patterns.reduce((sum, p) => sum + countHits(text, p), 0);

const MIN_SCORE = 2; // これ未満の記事はノイズとして除外

// ---- ユーティリティ -----------------------------------------------------------

function decodeEntities(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

function stripTags(s) {
  return decodeEntities(s).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function pickTag(block, names) {
  for (const name of names) {
    const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, "i"));
    if (m) return m[1].trim();
  }
  return "";
}

/** RSS 2.0 / RSS 1.0 (RDF) / Atom の <item>/<entry> をざっくりパースする */
function parseFeed(xml) {
  const items = [];
  const blocks = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/gi) ?? [];
  for (const block of blocks) {
    const title = stripTags(pickTag(block, ["title"]));
    // Atomは <link href="..."/>、RSSは <link>...</link>
    let link = pickTag(block, ["link"]);
    if (!link) {
      const m = block.match(/<link[^>]*href="([^"]+)"/i);
      link = m ? m[1] : "";
    }
    link = decodeEntities(link).trim();
    const dateRaw = pickTag(block, ["pubDate", "dc:date", "published", "updated"]);
    const date = dateRaw ? new Date(dateRaw) : null;
    const description = stripTags(
      pickTag(block, ["description", "summary", "content"])
    ).slice(0, 300);
    if (title && link) {
      items.push({
        title,
        link,
        date: date && !isNaN(date) ? date.toISOString() : null,
        description,
      });
    }
  }
  return items;
}

/** Google Newsのタイトル末尾 " - 媒体名" を除いた正規化キー(横断重複排除用) */
function normTitle(title) {
  return title
    .replace(/投稿日時[：:].*$/, "")
    .replace(/\[適時開示\]/g, "")
    .replace(/\s+[-–|]\s+[^-–|]{1,40}$/, "")
    .toLowerCase()
    .replace(/[\s　、。・:：,\.\-–—「」『』()（）]/g, "");
}

/** 減点ワード(レポート販売・セミナー告知等のPRスパム対策)を適用 */
function applyPenalties(text, penalties) {
  let total = 0;
  const hits = [];
  const lower = text.toLowerCase();
  for (const p of penalties) {
    if (lower.includes(p.pattern.toLowerCase())) {
      total += p.score;
      hits.push(p.pattern);
    }
  }
  return { total, hits };
}

function countHits(text, keyword) {
  const esc = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // 英字キーワードは単語境界を要求(DC が "abcdcef" に誤マッチしないように)
  const pattern = /^[\x00-\x7F]+$/.test(keyword) ? `\\b${esc}\\b` : esc;
  return (text.match(new RegExp(pattern, "gi")) ?? []).length;
}

function classify(item, baseScore) {
  const text = `${item.title} ${item.description}`;
  let best = { category: "未分類", score: 0 };
  let total = 0;
  const matched = new Set();
  for (const [category, keywords] of Object.entries(CATEGORIES)) {
    let score = 0;
    for (const kw of keywords) {
      const hits = countHits(text, kw);
      if (hits > 0) {
        score += Math.min(hits, 3); // 同一語の連呼は3回まで加点
        matched.add(kw);
      }
    }
    total += score;
    if (score > best.score) best = { category, score };
  }
  const relevant = RELEVANCE_KEYWORDS.some((kw) => countHits(text, kw) > 0);
  return {
    category: best.category,
    score: baseScore + total + (relevant ? 1 : 0),
    keywords: [...matched],
  };
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": "dc-trend-jp news-collector/1.0" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

async function loadJson(file, fallback) {
  try {
    return JSON.parse(await readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}

const jstDate = (d = new Date()) =>
  new Date(d.getTime() + 9 * 3600 * 1000).toISOString().slice(0, 10);

// ---- 収集 ----------------------------------------------------------------------

async function collect() {
  const { sources, penalties = [] } = JSON.parse(
    await readFile(path.join(TOOL_DIR, "sources.json"), "utf8")
  );
  const seen = await loadJson(SEEN_FILE, { keys: [] });
  const seenSet = new Set(seen.keys);
  const today = jstDate();

  const collected = [];
  const errors = [];

  await Promise.all(
    sources.map(async (src) => {
      try {
        const xml = await fetchText(src.url);
        const items = parseFeed(xml);
        for (const item of items) {
          // Google News等の説明文はタイトルの複製が大半。表示の冗長化と
          // キーワード二重カウントを防ぐため、複製なら収集時点で捨てる
          if (item.description && item.description.slice(0, 30) === item.title.slice(0, 30)) {
            item.description = "";
          }
          const { category, score, keywords } = classify(item, src.baseScore);
          const pen = applyPenalties(`${item.title} ${item.description}`, penalties);
          const finalScore = score + pen.total;
          // 未分類(DCカテゴリのキーワードに1つも該当しない)は高スコアのみ通す
          if (finalScore < MIN_SCORE || (category === "未分類" && finalScore < 4)) continue;
          collected.push({
            ...item, source: src.name, lang: src.lang,
            // 英語DC専門メディア発で未分類なら海外DC動向として扱う
            category: category === "未分類" && src.lang === "en" ? "海外DC動向" : category,
            score: finalScore, keywords,
            ...(pen.total !== 0 ? { penalty: pen.total, penaltyHits: pen.hits } : {}),
          });
        }
        console.log(`✔ ${src.name}: ${items.length}件取得`);
      } catch (e) {
        errors.push(`${src.name}: ${e.message}`);
        console.error(`✖ ${src.name}: ${e.message}`);
      }
    })
  );

  // 重複排除(過去に収集済み or 今回の別ソースと同一タイトル)
  const fresh = [];
  const batchKeys = new Set();
  for (const item of collected.sort((a, b) => b.score - a.score)) {
    const key = normTitle(item.title);
    if (seenSet.has(key) || batchKeys.has(key)) continue;
    batchKeys.add(key);
    fresh.push(item);
  }

  fresh.sort((a, b) => b.score - a.score);

  // アーカイブ保存(同日再実行は追記マージ)
  await mkdir(ARCHIVE_DIR, { recursive: true });
  const archiveFile = path.join(ARCHIVE_DIR, `items-${today}.json`);
  const existing = await loadJson(archiveFile, []);
  const dayItems = [...existing, ...fresh];
  await writeFile(archiveFile, JSON.stringify(dayItems, null, 2), "utf8");

  // seen更新(直近5000キーのみ保持)
  const newKeys = [...seen.keys, ...batchKeys];
  await writeFile(
    SEEN_FILE,
    JSON.stringify({ updated: today, keys: newKeys.slice(-5000) }, null, 2),
    "utf8"
  );

  // トレンドCSV追記(同日再実行も考慮し、当日アーカイブ全体から集計)
  // count: 収集記事全体 / curated: 検索クエリ由来を除いたDC専門メディアのみ
  // (検索クエリは「液冷」等のキーワードで取得しているため、全体の数字には収集バイアスがある)
  const searchSources = new Set(sources.filter((s) => s.search).map((s) => s.name));
  const trendText = dayItems.map((i) => `${i.title} ${i.description}`).join("\n");
  const curatedText = dayItems
    .filter((i) => !searchSources.has(i.source))
    .map((i) => `${i.title} ${i.description}`)
    .join("\n");
  const rows = TREND_KEYWORDS.map(
    (kw) =>
      `${today},${kw.label},${countTrend(trendText, kw.patterns)},${countTrend(curatedText, kw.patterns)}`
  );
  const HEADER = "date,keyword,count,curated";
  let kept = [];
  if (existsSync(TRENDS_FILE)) {
    // 旧形式(3列)の行は curated 空欄でパディングして引き継ぐ。同日行は差し替え
    kept = (await readFile(TRENDS_FILE, "utf8"))
      .split("\n")
      .filter((l) => l && !l.startsWith("date,") && !l.startsWith(`${today},`))
      .map((l) => (l.split(",").length < 4 ? `${l},` : l));
  }
  await writeFile(TRENDS_FILE, [HEADER, ...kept, ...rows].join("\n") + "\n", "utf8");

  // ダイジェスト生成
  await mkdir(DIGEST_DIR, { recursive: true });
  const digestFile = path.join(DIGEST_DIR, `digest-${today}.md`);
  await writeFile(digestFile, buildDigest(fresh, today, errors), "utf8");

  console.log(`\n新着 ${fresh.length}件(重複除外後)`);
  console.log(`アーカイブ: ${path.relative(process.cwd(), archiveFile)}`);
  console.log(`ダイジェスト: ${path.relative(process.cwd(), digestFile)}`);
  return fresh;
}

function buildDigest(items, today, errors) {
  // 減点付き(PR・宣伝系)はダイジェストに載せない(アーカイブには残る)
  const skipped = items.filter((i) => i.penalty).length;
  items = items.filter((i) => !i.penalty);
  const byCat = groupBy(items, (i) => i.category);
  let md = `# DCニュースダイジェスト ${today}\n\n新着 ${items.length}件。スコア順。記事ネタの選定用。`;
  if (skipped) md += `(PR・宣伝系${skipped}件はアーカイブのみ)`;
  md += `\n`;
  if (errors.length) md += `\n> ⚠ 取得失敗: ${errors.join(" / ")}\n`;
  for (const [cat, list] of Object.entries(byCat)) {
    md += `\n## ${cat}(${list.length}件)\n\n`;
    const oldCutoff = new Date(Date.now() - 14 * 86400 * 1000).toISOString();
    for (const i of list.slice(0, 15)) {
      let d = i.date ? i.date.slice(0, 10) : "日付不明";
      if (i.date && i.date < oldCutoff) d += "⚠旧聞"; // Google Newsは過去記事も返す
      md += `- **[${i.title}](${i.link})**\n  - ${d} | ${i.source} | スコア${i.score} | ${i.keywords.slice(0, 6).join(", ")}\n`;
      if (i.description) md += `  - ${i.description.slice(0, 120)}\n`;
    }
  }
  md += `\n---\n*生成: news-collector | 記事化する場合は必ず一次ソースを確認すること*\n`;
  return md;
}

function groupBy(arr, fn) {
  const out = {};
  for (const x of arr) (out[fn(x)] ??= []).push(x);
  return out;
}

// ---- 週間まとめ記事ドラフト生成 --------------------------------------------------

async function buildDraft(days) {
  const today = jstDate();
  const since = jstDate(new Date(Date.now() - days * 86400 * 1000));

  // 期間内のアーカイブを読み込み
  const files = existsSync(ARCHIVE_DIR) ? await readdir(ARCHIVE_DIR) : [];
  let items = [];
  for (const f of files) {
    const m = f.match(/^items-(\d{4}-\d{2}-\d{2})\.json$/);
    if (m && m[1] >= since && m[1] <= today) {
      items = items.concat(await loadJson(path.join(ARCHIVE_DIR, f), []));
    }
  }
  if (items.length === 0) {
    console.error(`直近${days}日分のアーカイブがありません。先に collect を実行してください。`);
    process.exitCode = 1;
    return;
  }

  // 期間外の古い記事(Google Newsが返す過去記事)・未分類ノイズ・
  // 減点付き(PR・宣伝系)を記事候補から除外
  items = items.filter(
    (i) =>
      (!i.date || i.date.slice(0, 10) >= since) &&
      !(i.category === "未分類" && i.score < 4) &&
      !i.penalty
  );

  // タイトル重複除去 + スコア順
  const seen = new Set();
  items = items
    .filter((i) => {
      const k = normTitle(i.title);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .sort((a, b) => b.score - a.score);

  // 期間内キーワードトレンド集計(全体 + 専門メディアのみ)
  const csv = existsSync(TRENDS_FILE) ? await readFile(TRENDS_FILE, "utf8") : "";
  const trendTotals = {};
  for (const line of csv.split("\n").slice(1)) {
    const [date, kw, count, curated] = line.split(",");
    if (date >= since && date <= today && Number(count) > 0) {
      const t = (trendTotals[kw] ??= { all: 0, curated: 0 });
      t.all += Number(count);
      t.curated += Number(curated) || 0;
    }
  }
  const topTrends = Object.entries(trendTotals)
    .sort((a, b) => b[1].all - a[1].all)
    .slice(0, 10);

  const byCat = groupBy(items, (i) => i.category);
  const slug = `weekly-dc-news-${today}`;
  const catOrder = ["AI・HPC インフラ", "電力・冷却技術", "国内DC動向", "海外DC動向", "市場データ・統計", "未分類"];

  let body = `---
title: "【週間まとめ】データセンター業界ニュース ${since}〜${today}——注目トピックと統計"
slug: "${slug}"
category: "市場データ・統計"
tags: ["週間まとめ", "ニュース", "統計", "${today.slice(0, 4)}年"]
published_at: "${today}"
summary: "直近${days}日間のデータセンター業界ニュース${items.length}件を収集・分類。キーワード出現トレンドと注目トピックを現役DCエンジニア視点で整理します。"
thumbnail: "/images/articles/${slug}.png"
author: "DCトレンド研究編集部(現役DCエンジニア監修)"
draft: true
---

## 今週のキーワードトレンド

当サイトの自動収集ツールで直近${days}日間に収集したDC関連ニュース**${items.length}件**から、キーワードの出現回数を集計しました。

| 順位 | キーワード | 出現数(全体) | うちDC専門メディア |
|------|-----------|------|------|
${topTrends.map(([kw, t], i) => `| ${i + 1} | ${kw} | ${t.all} | ${t.curated} |`).join("\n")}

※出現数は当サイトの収集条件(検索キーワード・購読フィード)に依存する参考値です。「DC専門メディア」はデータセンターカフェ・Data Center Dynamics・Data Center Knowledge・週刊データセンターWatchの記事のみでの集計で、検索起因の偏りを受けにくい数字です。

<!-- TODO: トレンドから読み取れる所感を現役エンジニア視点で2〜3段落書く -->

`;

  for (const cat of catOrder) {
    const list = byCat[cat];
    if (!list?.length) continue;
    body += `## ${cat}\n\n`;
    for (const i of list.slice(0, 5)) {
      const d = i.date ? i.date.slice(0, 10) : "";
      body += `### [${i.title}](${i.link})\n\n`;
      body += `(${d} / ${i.source})${i.description ? ` ${i.description.slice(0, 100)}…` : ""}\n\n`;
      body += `<!-- TODO: 背景・解説を1〜2段落。一次ソース確認必須 -->\n\n`;
    }
  }

  body += `---

## アイキャッチ画像(作成用メモ・公開前に削除)

### Midjourneyプロンプト
\`\`\`
A wide-angle photorealistic shot of a modern data center corridor with rows of glowing server racks, cool blue and white LED lighting, shallow depth of field, cinematic lighting, editorial photography style, no text, no watermarks, 16:9 aspect ratio
\`\`\`

### Canvaレイアウト構成案
| 要素 | 内容 |
|------|------|
| 背景写真 | 上記Midjourney画像 |
| カテゴリバッジ | 左上・グレー・「市場データ・統計」 |
| アクセントバー | 左端縦線・青 |
| キッカー | 「週間まとめ」+ 期間(青・大) |
| メイン見出し | 白・太字・「データセンター業界ニュース ${since.slice(5)}〜${today.slice(5)}」 |
| サブタイトル | 薄グレー・「注目トピック&キーワード統計」 |
`;

  await mkdir(DRAFT_DIR, { recursive: true });
  const draftFile = path.join(DRAFT_DIR, `${slug}.md`);
  await writeFile(draftFile, body, "utf8");
  console.log(`記事ドラフト生成: ${path.relative(process.cwd(), draftFile)}`);
  console.log(`(draft: true 付き。加筆・一次ソース確認後に src/content/articles/ へ移動してください)`);
}

// ---- エントリポイント ------------------------------------------------------------

const args = process.argv.slice(2);
const daysIdx = args.indexOf("--days");
const days = daysIdx >= 0 ? Number(args[daysIdx + 1]) || 7 : 7;

if (args.includes("--draft")) {
  if (!args.includes("--no-collect")) await collect();
  await buildDraft(days);
} else {
  await collect();
}
