@echo off
echo Starting Hexagon Game Frontend Server...
cd /d %~dp0frontend
echo Frontend server starting on http://localhost:3000
npm run dev