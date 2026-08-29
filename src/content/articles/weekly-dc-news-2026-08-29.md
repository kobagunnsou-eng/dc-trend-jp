---
title: "【週間まとめ】データセンター業界ニュース 8/22〜8/29——NVIDIA決算週、国内は箕面ハイパースケールと印西「第3の訴訟」"
slug: "weekly-dc-news-2026-08-29"
category: "市場データ・統計"
tags: ["週間まとめ", "ニュース", "統計", "NVIDIA", "関西電力", "印西", "2026年"]
published_at: "2026-08-29"
summary: "直近1週間のデータセンター業界ニュース159件を収集・分類。NVIDIA決算、関電サイラスワンの箕面ハイパースケールDC、印西の新たな住民訴訟、スペインの再エネ80%義務化など、注目トピックを現役DCエンジニア視点で整理します。"
thumbnail: "/images/articles/weekly-dc-news-2026-08-29.jpg"
author: "DCトレンド研究編集部（現役DCエンジニア監修）"
draft: false
---

## 今週のキーワードトレンド

当サイトの自動収集ツールで直近7日間に収集したDC関連ニュース**159件**から、キーワードの出現回数を集計しました。

| 順位 | キーワード | 出現数(全体) | うちDC専門メディア |
|------|-----------|------|------|
| 1 | 電力 | 60 | 14 |
| 2 | 投資 | 34 | 2 |
| 3 | NVIDIA | 30 | 10 |
| 4 | 液冷 | 21 | 6 |
| 5 | GPU | 9 | 2 |
| 6 | 原子力 | 6 | 0 |
| 7 | 再エネ | 5 | 2 |
| 8 | 買収 | 4 | 3 |
| 9 | 新設 | 4 | 1 |
| 10 | 液浸 | 3 | 1 |

※出現数は当サイトの収集条件（検索キーワード・購読フィード）に依存する参考値です。「DC専門メディア」はデータセンターカフェ・Data Center Dynamics・Data Center Knowledge・週刊データセンターWatchの記事のみでの集計で、検索起因の偏りを受けにくい数字です。

今週は「NVIDIA」が専門メディア集計で首位級に浮上しました。四半期決算の発表週で、業界全体がその数字を電力・設備投資の先行指標として読んだ一週間です。定番の「電力」は今週も全体首位で、規制（スペイン）・系統（米PJM）・電源（国内の電力会社系DC）と、切り口を変えながら業界の最重要テーマであり続けています。

## AI・HPCインフラ

### NVIDIA決算、DC部門は四半期890億ドル——「AIバブル」議論に実需で回答

NVIDIAの第2四半期売上高は962億ドル（前四半期比18%増）で[前年比ほぼ倍増](https://cafe-dc.com/research/nvidia-revenue-doubles-over-last-year-as-company-forecasts-record-growth/)、うちデータセンター部門は[890億ドル](https://www.datacenterknowledge.com/data-center-chips/-out-of-hyperbole-nvidia-s-ai-boom-tests-data-center-infrastructure-limits)に達しました。AWSが200万基規模のGPU追加配備を計画するなど、需要はなお供給を上回っています。GPUの売上はそのまま数年後の電力・冷却需要になります。[Blackwell解説記事](/articles/nvidia-blackwell-ai-infrastructure)で述べた「1ラック100kW時代」が、決算数字の裏でさらに拡大している構図です。

### SKテレコム、AI DCインフラ新会社「SK Horizon」設立——KKRなどが22億ドル出資

SKテレコムはSK Broadbandからインフラ部門を分社化し、KKR・IMM Investmentの出資を受けた[AI DC専業の新会社を設立](https://cafe-dc.com/hpc/sk-telecom-launches-new-ai-dc-infrastructure-focused-company-split-from-sk-broadband/)しました。通信キャリアがDC資産を切り出して外部資本で成長を加速させる手法は、国内キャリアのDC戦略にも示唆があります。

## 電力・冷却技術

### スペイン、DCに「電力の80%を新規再エネで」義務付けへ

スペイン政府が、容量1MW以上のDCに対し消費電力の80%以上を新設再エネで賄うことを義務付ける[規則案を策定](https://cafe-dc.com/sustainable/spain-drafts-rules-requiring-data-centers-to-source-80-of-power/)しました。「DCの電力は新しい脱炭素電源で」という追加性の要求は欧州で強まる流れです。日本の[GX戦略地域によるDC誘導](/articles/gx-strategy-area-datacenter-cluster-2026)は補助金型ですが、規制型へ転じる国が出てきたことは、国内事業者も中期的に織り込むべき変化です。

### 米DOE、760MWの老朽火力を延命——PJMのDC負荷急増で

米エネルギー省は、PJM管内の需給逼迫を理由に[Eddystone発電所（760MW）の運転継続を指示](https://www.datacenterknowledge.com/energy-power-supply/doe-extends-eddystone-as-pjm-faces-data-center-power-surge)しました。DC需要が老朽電源の延命を招く事態は、[PJMの負荷急減イベントの解説記事](/articles/pjm-3800mw-load-drop-datacenter-grid-cost-2026)で触れた「DCと系統の相互依存」の裏面です。

### Molex、液冷ベンチャーCAEPlusに出資

コネクタ大手Molexが[チップ直結型液冷のCAEPlusに出資](https://cafe-dc.com/energy/molex-invests-in-liquid-cooling-vendor-caeplus/)。部品メーカーによる液冷サプライチェーンへの投資が続いています。[液冷・液浸の基礎解説](/articles/datacenter-liquid-cooling-dlc-immersion-2026)も併せてどうぞ。

## 国内DC動向

### 関電サイラスワン、大阪・箕面にハイパースケールDC——10月着工・2029年7月完成へ

関西電力と米CyrusOneの合弁「関西電力サイラスワン」が、大阪府箕面市に延床約3万㎡・鉄骨4階建てのハイパースケールDCを新設すると[報じられました](https://www.nikkei.com/article/DGXZQOUF260DM0W6A820C2000000/)。2027年度稼働予定の京都・精華町に続く2拠点目で、同社は10年で1兆円超を投じ受電容量90万kW以上を目指します。電力会社がDC事業の主要プレーヤーになる流れは、[原子力フィジカルPPAの記事](/articles/kepco-nuclear-physical-ppa-datacenter-2026)で解説した「電源とDCの垂直統合」の延長線上にあります。

### NTTドコモビジネス×東電PG、「コンテナDCパーク」を大田区に

NTTドコモビジネスと東京電力パワーグリッドが、GPUサーバー対応の[コンテナ型DCパーク展開を発表](https://cafe-dc.com/japan/ntt-docomo-business-and-tepco-power-grid-announce-rollout-of-container-dc-park-supporting-next-generation-gpu-servers/)。第一弾は東京都大田区です。変電所隣接地などの電力会社アセットを使い、建屋建設を省いて速度で勝負するモデルで、こちらも「電力×DC」の組み合わせです。

### 印西で「第3の法廷闘争」——住民7人が今度は市を提訴

千葉・印西の駅前DC計画を巡り、住民7人が印西市を相手取る訴訟を起こしたと[報じられました](https://news.google.com/rss/articles/CBMiU0FVX3lxTE42RVczUlhTUEpaVTFRQmt2ZGNpUzdSYnY5MTUzNDdOT19OMmt0NmdoQkE4NDc2OEt3aG5ybmZIbHUyaWExSFYtT0NGdUpONUFnTUc0?oc=5)（東京新聞）。3月の建築確認取消訴訟、5月の[住民120人による監査請求](https://www.tokyo-np.co.jp/article/491638)に続く動きで、原告は「法制度の不備に一石を投じたい」としています。争点は一貫して[「DCは工場か事務所か」という法的定義の空白](https://www.tokyo-np.co.jp/article/490396)です。[迷惑施設化するDCと社会的受容性の解説](/articles/dc-nuisance-facility-resident-lawsuit-2026)で書いた通り、定義問題を放置するコストは業界全体に跳ね返ります。

### 【読み物】「ようやく加速し始めた日本のAIデータセンター」

Impress Watchが[日本のAI DC整備の現在地を総括する記事](https://www.watch.impress.co.jp/docs/watchplus/2135519.html)を公開。Noetraの140MW計画や[秋田の300〜500MW級AI DC構想](/articles/akita-uae-500mw-ai-datacenter-2026)に触れつつ、1.5GW超が動く米国との規模差を指摘しています。国内の立ち位置を俯瞰するのに好適な一本です。

## 海外DC動向

### OpenAI、エネルギー計画をDC組織に内製化

OpenAIが[エネルギー技術職をDC部門内に新設](https://www.datacenterknowledge.com/data-center-construction/openai-moves-energy-planning-inside-data-center-organization)し、柔軟負荷・自家発電・蓄電の戦略を内製化します。ハイパースケーラーが「電力会社化」していく象徴的な動きです。

### Infineon、インドの電力システム企業C2iを買収

独InfineonがAI DC向け電力システムを手掛ける[C2i Semiconductorsを買収](https://cafe-dc.com/ma/infineon-acquires-indian-power-systems-firm-c2i-semiconductors/)（年内完了見込み）。GPUだけでなく、給電・電力半導体のレイヤーでもM&Aが活発化しています。

## 市場データ・統計

### APACのDC資産価値、2030年に1兆ドルへ——C&W予測

Cushman & Wakefieldは、APACのDC資産価値が[2030年までに約1兆ドルに達する](https://cafe-dc.com/research/apac-data-center-asset-values-could-reach-1-trillion-by-2030-cushman-wakefield/)可能性があると予測。実現には2,800億ドルの設備投資が必要としています。日本はAPAC投資の主要な受け皿の一つであり、[国内DC市場の概観記事](/articles/japan-dc-market-2026)の数字と併せて読むと解像度が上がります。

---

今週も最後までお読みいただきありがとうございました。DCトレンド研究では、毎週のニュースを現役DCエンジニアの視点で整理してお届けします。

