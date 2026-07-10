# DCニュース収集(日次) — 📰ニュース収集・日次.bat から呼ばれる
Write-Host "===== DCニュース収集(日次) =====" -ForegroundColor Cyan
Write-Host ""

npm run news
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "収集でエラーが発生しました。上のメッセージを確認してください。" -ForegroundColor Red
    exit 1
}

# 最新のダイジェストを開く(名前昇順 = 日付順の末尾が最新)
$digest = Get-ChildItem "tools\news-collector\data\digest\digest-*.md" -ErrorAction SilentlyContinue |
    Sort-Object Name | Select-Object -Last 1
if ($digest) {
    try { Invoke-Item $digest.FullName }
    catch { explorer "/select,`"$($digest.FullName)`"" }
}

Write-Host ""
Write-Host "完了。ダイジェストを開きました。スコア順に並んでいるので記事ネタ探しにどうぞ。" -ForegroundColor Green
Write-Host "(⚠旧聞マークは古い記事です)"
