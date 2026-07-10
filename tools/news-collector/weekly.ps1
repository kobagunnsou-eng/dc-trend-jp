# 週間まとめ記事ドラフト作成(週次) — 📝週間まとめ作成・週次.bat から呼ばれる
Write-Host "===== 週間まとめ記事ドラフト作成(週次) =====" -ForegroundColor Cyan
Write-Host ""

npm run news:draft
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "生成でエラーが発生しました。上のメッセージを確認してください。" -ForegroundColor Red
    exit 1
}

# 最新のドラフトを開く
$draft = Get-ChildItem "tools\news-collector\data\drafts\weekly-dc-news-*.md" -ErrorAction SilentlyContinue |
    Sort-Object Name | Select-Object -Last 1
if ($draft) {
    try { Invoke-Item $draft.FullName }
    catch { explorer "/select,`"$($draft.FullName)`"" }
}

Write-Host ""
Write-Host "完了。記事ドラフトを開きました。公開までの手順:" -ForegroundColor Green
Write-Host "  1. TODOコメント部分に解説を加筆"
Write-Host "  2. リンクを一次ソースに貼り替え"
Write-Host "  3. アイキャッチ画像を作成(末尾のメモ参照、メモは削除)"
Write-Host "  4. src\content\articles\ に移動して draft: false に変更"
