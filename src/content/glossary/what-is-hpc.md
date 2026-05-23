---
title: "HPC（High Performance Computing）とは——スーパーコンピュータからAI基盤まで"
slug: "what-is-hpc"
reading: "えいちぴーしー"
tags: ["HPC", "スーパーコンピュータ", "GPU", "AI", "科学技術計算", "富岳"]
published_at: "2026-05-24"
summary: "HPC（高性能計算）は科学技術シミュレーションやAI学習など、超大規模な計算を行うための仕組みです。スパコンとの関係、AIとの融合、データセンター設計への影響を解説します。"
related_articles: ["nvidia-blackwell-ai-infrastructure", "ai-datacenter-power-crisis-2026", "japan-dc-market-2026"]
related_terms: ["what-is-gpu", "what-is-dlc", "what-is-liquid-cooling", "what-is-pue"]
draft: false
---

## HPCとは

HPC（High Performance Computing：高性能計算）とは、通常のコンピューターでは処理しきれない超大規模な計算を、多数のプロセッサや計算機を連携させて高速に実行する技術・システムの総称です。

スーパーコンピュータ（スパコン）はHPCの代表例ですが、現在はGPUクラスターを使ったAIトレーニング基盤も「HPCインフラ」と呼ばれることが一般的です。

---

## HPCが使われる場面

### 従来型HPC（科学技術計算）
- 気象予報・気候変動シミュレーション
- 創薬（タンパク質構造解析・分子動力学）
- 航空宇宙・自動車の流体シミュレーション（CFD）
- 核融合・素粒子物理シミュレーション
- 地震波解析・地下資源探査

### AI時代のHPC（AI/ML計算）
- 大規模言語モデル（LLM）のトレーニング
- 画像認識・音声認識モデルの学習
- 自動運転向けAIの学習・評価
- 創薬AI（AlphaFoldなど）

かつてはスパコンと企業のAI基盤は別物でしたが、現在は技術的にほぼ同じGPUクラスターを使っており、境界が曖昧になっています。

---

## HPCとスーパーコンピュータ

日本を代表するスパコン「富岳」（理化学研究所）はHPCの最高峰の例です。富岳はCPUベースですが、現在建設・計画中の次世代スパコンはGPU（NVIDIAのBlackwell等）を中心とした構成になっています。

世界のスパコン性能ランキング「TOP500」では、上位システムのほとんどがGPUを大量搭載した構成になっており、従来の専用CPUとの差は縮まっています。

---

## データセンター設計への影響

HPCワークロードはデータセンターに特殊な要求をします。

### 超高電力密度

HPCシステム（特にGPUクラスター）は、1ラックあたり数十〜120kW以上という極めて高い電力密度を要求します。通常のDCでは対応できないケースが多く、専用設計のHPC向けDCが必要です。

### 高速ネットワーク

HPC/AI学習では、多数のGPUが常に大量のデータをやり取りします。NVIDIAのNVLink（GPU間接続）やInfiniBand（サーバー間接続）などの高速相互接続ネットワークが必要で、通常の汎用DCでは構築できません。

### 液冷の必須化

高電力密度に対応するため、直接液冷（DLC）や液浸冷却が事実上の必須要件になっています。

---

## 国内のHPC動向

理化学研究所（理研）・産業技術総合研究所（産総研）・各大学スパコンセンターでは、次世代AIスパコンへの更新計画が進んでいます。

民間では、さくらインターネットが国立研究開発法人向けにGPUクラスターを提供するほか、大手クラウド（AWS・Azure・Google Cloud）が国内リージョンでGPU/HPC向けインスタンスを拡充しています。

---

## まとめ

HPCはかつての「スパコン＝研究機関のもの」という位置付けから、「AI学習基盤＝企業にとっても身近なもの」へと急速に変化しています。GPU・液冷・高速ネットワークという3つのキーワードがHPCとDCを結ぶ接点です。AI投資を検討する企業にとって、HPCインフラの理解は不可欠です。

---

## 関連記事・用語

- [NVIDIA Blackwell（GB200）が変えるAIインフラの常識](/articles/nvidia-blackwell-ai-infrastructure)
- [AIデータセンターの電力危機——2026年、何が変わったのか](/articles/ai-datacenter-power-crisis-2026)
- [国内データセンター市場2026年最新動向](/articles/japan-dc-market-2026)
- [用語：GPUとは](/glossary/what-is-gpu)
- [用語：直接液冷（DLC）とは](/glossary/what-is-dlc)
- [用語：液浸冷却とは](/glossary/what-is-liquid-immersion-cooling)
