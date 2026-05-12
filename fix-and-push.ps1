Set-Location -Path $PSScriptRoot
$ErrorActionPreference = "Continue"

Write-Host "Step 1: git config"
git config user.email "kobagunnsou@gmail.com"
git config user.name "kobagunnsou-eng"

Write-Host "Step 2: reset index"
git rm -r --cached . --ignore-unmatch 2>&1 | Out-Null

Write-Host "Step 3: git add"
git add .

Write-Host "Step 4: git commit"
git commit -m "feat: initial commit dc-trend-jp"

Write-Host "Step 5: git push"
git remote remove origin 2>$null
git remote add origin "https://github.com/kobagunnsou-eng/dc-trend-jp.git"
git push -u origin main

Write-Host "Done."
Read-Host "Press Enter to close"
