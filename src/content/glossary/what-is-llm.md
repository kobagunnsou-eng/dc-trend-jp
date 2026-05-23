---
title: "LLM（大規模言語モデル）とは——ChatGPTを生んだAI技術の基礎"
slug: "what-is-llm"
reading: "えるえるえむ"
tags: ["LLM", "大規模言語モデル", "生成AI", "ChatGPT", "GPU", "AIインフラ"]
published_at: "2026-05-24"
summary: "LLM（Large Language Model：大規模言語モデル）はChatGPTなど生成AIの根幹をなす技術です。データセンターとの関係——膨大な電力・GPU・冷却インフラを必要とする理由を解説します。"
related_articles: ["nvidia-blackwell-ai-infrastructure", "ai-datacenter-power-crisis-2026", "japan-dc-market-2026"]
related_terms: ["what-is-gpu", "what-is-hpc", "what-is-dlc", "what-is-hyperscaler"]
draft: false
---

## LLMとは

LLM（Large Language Model：大規模言語モデル）とは、膨大なテキストデータを学習し、人間の言語を理解・生成できるAIモデルです。

ChatGPT（OpenAI）、Gemini（Google）、Claude（Anthropic）、Llama（Meta）などが代表的なLLMであり、文章生成・要約・翻訳・コード生成・質問応答など幅広いタスクをこなします。

「大規模（Large）」という名の通り、数十億〜数兆個のパラメータ（モデルの重み）を持ち、学習に必要な計算量は従来のAIモデルとは桁違いに大きいことが特徴です。

---

## なぜLLMがDCに大きな影響を与えるか

LLMのトレーニング（学習）と推論（利用）には、従来のシステムとは比較にならないほどの計算リソースが必要です。

### トレーニング（学習）

大規模LLMの一回のトレーニングには、数千〜数万枚のGPUを数週間〜数ヶ月間連続稼働させる必要があります。消費電力は数MW〜数十MWに達することもあり、一般的なDCでは対応できません。

主要モデルのトレーニング電力消費（推定）：

| モデル | 推定消費電力（GWh換算） |
|------|-------------------|
| GPT-3（2020） | 約1.3 GWh |
| GPT-4（2023） | 推定数十 GWh |
| 最新世代大規模モデル（2025〜） | 推定数百 GWh |

### 推論（サービス提供）

ユーザーがChatGPTに問い合わせるたびに、GPUで計算が走ります。月間数億〜数十億の問い合わせを処理するためのGPU基盤は、巨大な電力・冷却インフラを必要とします。

---

## LLMとデータセンター設計の変化

LLMの普及はDCの設計に根本的な変化をもたらしています。

### GPU特化ラックの登場

従来の汎用サーバーラック（5〜15kW）ではGPUの熱を処理できません。LLMトレーニング・推論向けDCは、120kW超/ラックに対応した高電力密度設計と液冷インフラが必要です。

### ネットワーク構成の変化

LLMトレーニングでは数千枚のGPUが常に大量のデータを交換します。NVIDIAのNVLink（GPU間）やInfiniBand（サーバー間）などの超高速ネットワークが必要で、通常のEthernetでは帯域が不足します。

### 電力容量の爆発的増大

1つのLLMトレーニングクラスターで数十MW〜100MW級の電力が必要になることもあり、DC全体の電力設計・電力会社との接続容量確保が最大のボトルネックになっています。

---

## 国内のLLM動向

日本でもLLM開発・運用への投資が急拡大しています。

主な動向：
- NTT：独自LLM「tsuzumi」を開発・提供
- 富士通：業務特化型LLMの開発
- NEC：コトバンクLLMなど日本語特化モデル
- さくらインターネット：国内GPU基盤での国産LLM支援

ハイパースケーラー（Microsoft Azure・Google Cloud・AWS）は、海外で開発されたLLMを国内リージョンで提供するAPIサービスを展開しています。

---

## DX担当者が知っておくべきこと

LLMを業務利用する際の実務ポイントです。

クラウドAPIで利用する場合（最も一般的）は、データの所在（国内・海外）・プライバシーポリシー・コンプライアンス要件を確認しましょう。機密情報の入力には注意が必要です。

オンプレミス・コロケーションで自社LLMを動かす場合は、推論に必要なGPUの台数・電力密度・液冷対応可否をDC事業者と詳細に確認する必要があります。

---

## まとめ

LLMはAI活用の中心的技術であり、そのトレーニング・推論インフラがデータセンター業界の設備投資・電力消費・立地戦略を大きく動かしています。「なぜDCへの投資が急増しているのか」を理解するうえで、LLMの仕組みと需要規模の把握は欠かせません。

---

## 関連記事・用語

- [NVIDIA Blackwell（GB200）が変えるAIインフラの常識](/articles/nvidia-blackwell-ai-infrastructure)
- [AIデータセンターの電力危機——2026年、何が変わったのか](/articles/ai-datacenter-power-crisis-2026)
- [国内データセンター市場2026年最新動向](/articles/japan-dc-market-2026)
- [用語：GPUとは](/glossary/what-is-gpu)
- [用語：HPC（高性能計算）とは](/glossary/what-is-hpc)
- [用語：ハイパースケーラーとは](/glossary/what-is-hyperscaler)
