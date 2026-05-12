@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo === Force push articles/[slug].astro fix ===
git config user.email "kobagunnsou@gmail.com"
git config user.name "kobagunnsou-eng"
git add -f "src/pages/articles/[slug].astro"
git add push-fix5.bat
git commit -m "fix: inline id.replace in articles getStaticPaths to fix scope error"
git push origin main
echo === Done ===
pause
