@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo === Fix PUE formula display (code block to blockquote) ===
git config user.email "kobagunnsou@gmail.com"
git config user.name "kobagunnsou-eng"
git add "src/content/glossary/what-is-pue.md"
git add push-fix6.bat
git commit -m "fix: change PUE formula from code block to blockquote for visibility"
git push origin main
echo === Done ===
pause
