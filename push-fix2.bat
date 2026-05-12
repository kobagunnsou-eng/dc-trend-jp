@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo === Force push wrangler.toml fix ===
git config user.email "kobagunnsou@gmail.com"
git config user.name "kobagunnsou-eng"
echo --- git status ---
git status
echo --- git add ---
git add -f wrangler.toml
git add push-fix.bat push-fix2.bat
echo --- git commit ---
git commit -m "fix: correct wrangler.toml format for Cloudflare Pages"
echo --- git push ---
git push origin main
echo === Done ===
pause
