@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo === Add GA4 and Search Console tags ===
git config user.email "kobagunnsou@gmail.com"
git config user.name "kobagunnsou-eng"
git add src/layouts/BaseLayout.astro
git add push-analytics.bat
git commit -m "feat: add Google Analytics 4 and Search Console verification"
git push origin main
echo === Done ===
pause
