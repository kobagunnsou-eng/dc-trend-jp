@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo === Fix PUE formula display (plain bold text) ===
git config user.email "kobagunnsou@gmail.com"
git config user.name "kobagunnsou-eng"
git add "src/content/glossary/what-is-pue.md"
git add push-fix7.bat
git commit -m "fix: change PUE formula to plain bold text for visibility"
git push origin main
echo === Done ===
pause
