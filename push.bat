@echo off
chcp 65001 > nul
title DCトレンド研究 — git push
cd /d "%~dp0"

echo.
echo === DCトレンド研究 git push ===
echo.

echo [1/4] npm install 中...
call npm install
if %ERRORLEVEL% neq 0 ( echo ERROR: npm install 失敗 & pause & exit /b 1 )
echo OK: npm install 完了
echo.

echo [2/4] git 初期化...
if not exist ".git" ( git init && git branch -M main )
echo.

echo [3/4] git add + commit...
git add .
git commit -m "feat: DCトレンド研究サイト 初期コミット (Astro v5 + Cloudflare Pages)"
echo.

echo [4/4] GitHub へ push...
git remote remove origin 2>nul
git remote add origin "https://github.com/kobagunnsou-eng/dc-trend-jp.git"
git push -u origin main

if %ERRORLEVEL% equ 0 (
    echo.
    echo === 完了！push 成功 ===
    echo https://github.com/kobagunnsou-eng/dc-trend-jp
) else (
    echo.
    echo push 失敗。GitHubへの認証が必要かもしれません。
)
echo.
pause
