# DCトレンド研究 — GitHub セットアップスクリプト
# このスクリプトをdc-trend-jpフォルダ内で実行してください

# スクリプトのあるフォルダに移動
Set-Location -Path $PSScriptRoot

Write-Host "=== DCトレンド研究 GitHub セットアップ ===" -ForegroundColor Cyan
Write-Host ""

# --- Step 1: npm install ---
Write-Host "[1/4] npm パッケージをインストール中..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install に失敗しました" -ForegroundColor Red
    exit 1
}
Write-Host "OK: npm install 完了" -ForegroundColor Green

# --- Step 2: ビルド確認 ---
Write-Host ""
Write-Host "[2/4] ビルド確認中 (npm run build)..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: ビルドに失敗しました。エラー内容を確認してください" -ForegroundColor Red
    exit 1
}
Write-Host "OK: ビルド成功" -ForegroundColor Green

# --- Step 3: git 初期化 ---
Write-Host ""
Write-Host "[3/4] git リポジトリを初期化中..." -ForegroundColor Yellow

if (Test-Path ".git") {
    Write-Host "既に git リポジトリが存在します。スキップします。"
} else {
    git init
    git branch -M main
}

# .gitignore 作成
@"
# 依存パッケージ（npm install で再生成できる）
node_modules/

# ビルド出力
dist/
.output/

# Astro キャッシュ
.astro/

# 環境変数（APIキー等を含む場合）
.env
.env.local
.env.production

# OS生成ファイル
.DS_Store
Thumbs.db

# エディタ設定
.vscode/
.idea/
"@ | Out-File -FilePath ".gitignore" -Encoding utf8

git add .
git commit -m "feat: DCトレンド研究サイト 初期コミット

- Astro v5 + Tailwind CSS + Cloudflare Pages 構成
- 日本語UI・カテゴリ6種・ダークモード対応
- OGP・JSON-LD・robots.txt・RSSフィード実装
- 用語解説ページ（/glossary）追加
- サンプル記事3本（PUE・液浸冷却・AIデータセンター電力問題）"

Write-Host "OK: git コミット完了" -ForegroundColor Green

# --- Step 4: リモート設定とプッシュ ---
Write-Host ""
Write-Host "[4/4] GitHub へプッシュ..." -ForegroundColor Yellow
Write-Host ""
Write-Host "GitHubリポジトリのURLを入力してください（例: https://github.com/yourname/dc-trend-jp.git）:" -ForegroundColor Cyan
$repoUrl = Read-Host "URL"

if ($repoUrl -ne "") {
    # 既存のoriginを削除して再設定
    git remote remove origin 2>$null
    git remote add origin $repoUrl
    git push -u origin main

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "=== 完了！ ===" -ForegroundColor Green
        Write-Host "GitHub へのプッシュが成功しました。" -ForegroundColor Green
        Write-Host "次のステップ: Cloudflare Pages でこのリポジトリを接続してください。" -ForegroundColor Cyan
    } else {
        Write-Host "ERROR: プッシュに失敗しました。GitHubへのログインを確認してください。" -ForegroundColor Red
    }
} else {
    Write-Host "URLが入力されなかったため、プッシュをスキップしました。" -ForegroundColor Yellow
    Write-Host "後で以下のコマンドを実行してください:" -ForegroundColor Cyan
    Write-Host "  git remote add origin https://github.com/yourname/dc-trend-jp.git" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "ローカル確認するには: npm run dev" -ForegroundColor Cyan
Read-Host "Enterキーで閉じる"
