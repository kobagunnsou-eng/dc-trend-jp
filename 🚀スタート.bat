@echo off
chcp 65001 > nul
title DCトレンド研究 — GitHub セットアップ

echo.
echo ================================================
echo  DCトレンド研究 — GitHub セットアップ
echo ================================================
echo.

:: このバッチファイルのあるフォルダに移動
cd /d "%~dp0"

echo [Step 1] GitHub のリポジトリ作成ページを開きます...
start "" "https://github.com/new"
echo.
echo  ↑ ブラウザが開いたら以下の設定でリポジトリを作成してください:
echo    ・Repository name: dc-trend-jp
echo    ・Description: データセンター専門メディア「DCトレンド研究」
echo    ・Visibility: Public（または Private）
echo    ・README/gitignoreは追加しない（チェックなし）
echo    ・[Create repository] をクリック
echo.
echo  作成後に表示される「...or push an existing repository」の
echo  HTTPS URLをコピーしておいてください。
echo.
pause

:: PowerShellでセットアップスクリプトを実行
echo.
echo [Step 2] セットアップを開始します...
echo.
powershell -ExecutionPolicy Bypass -File "%~dp0setup-github.ps1"

echo.
echo 完了しました！
pause
