@echo off
echo Stopping Hexagon City Builder development environment...

REM Stop the PostgreSQL database
echo Stopping PostgreSQL database...
docker-compose -f docker/docker-compose.yml down

REM Kill any running Node processes (backend and frontend)
echo Stopping Node processes...
taskkill /f /im node.exe 2>nul

REM Kill any running npm processes
echo Stopping npm processes...
taskkill /f /im npm-cli.js 2>nul

echo Development environment stopped successfully!
echo.
echo Press any key to exit...
pause >nul