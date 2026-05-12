@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo === wrangler.toml fix push ===
git config user.email "kobagunnsou@gmail.com"
git config user.name "kobagunnsou-eng"
git add wrangler.toml
git commit -m "fix: fix wrangler.toml pages_build_output_dir format"
git push origin main
echo === Done ===
pause
