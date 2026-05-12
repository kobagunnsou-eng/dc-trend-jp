Set-Location -Path $PSScriptRoot

Write-Host "--- npm install ---"
npm install

Write-Host "--- git init ---"
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

Write-Host "--- git add & commit ---"
git add .
git commit -m "feat: initial commit dc-trend-jp"

Write-Host "--- git push ---"
git remote remove origin 2>$null
git remote add origin "https://github.com/kobagunnsou-eng/dc-trend-jp.git"
git push -u origin main

Write-Host "--- done ---"
Read-Host "Enter to close"
