@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo === Fix getSlug scope error in glossary/[slug].astro ===
git config user.email "kobagunnsou@gmail.com"
git config user.name "kobagunnsou-eng"
git add "src/pages/glossary/[slug].astro"
git add push-fix4.bat
git commit -m "fix: inline id.replace in glossary getStaticPaths to fix scope error"
git push origin main
echo === Done ===
pause
