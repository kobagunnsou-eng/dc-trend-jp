@echo off
chcp 65001 > nul
cd /d "%~dp0"
echo === Fix slug schema for Astro v5 ===
git config user.email "kobagunnsou@gmail.com"
git config user.name "kobagunnsou-eng"
git add src/content/config.ts
git add src/pages/articles/[slug].astro
git add src/pages/glossary/[slug].astro
git add src/pages/index.astro
git add src/pages/glossary/index.astro
git add push-fix3.bat
git commit -m "fix: remove slug from schema, use entry.id for Astro v5 compatibility"
git push origin main
echo === Done ===
pause
