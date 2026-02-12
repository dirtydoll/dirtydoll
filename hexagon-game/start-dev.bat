@echo off
echo Starting Hexagon City Builder development environment...

REM Start PostgreSQL database with Docker
echo Starting PostgreSQL database...
docker-compose -f docker/docker-compose.yml up -d

REM Wait a bit for the database to start
timeout /t 10 /nobreak >nul

REM Install backend dependencies if needed
echo Installing backend dependencies...
pushd backend
if exist node_modules (
    echo Skipping backend dependency installation - node_modules already exists
) else (
    npm install
)
popd

REM Run database migrations using Drizzle Kit
echo Running database migrations...
pushd backend
npx drizzle-kit push:pg
popd

REM Install frontend dependencies if needed
echo Installing frontend dependencies...
pushd frontend
if exist node_modules (
    echo Skipping frontend dependency installation - node_modules already exists
) else (
    npm install
)
popd

echo.
echo ===========================================
echo Development environment setup complete!
echo ===========================================
echo.
echo PostgreSQL is running on localhost:5432
echo.
echo Starting backend server on port 5000...
start "Hexagon Backend" cmd /k "cd /d %~dp0backend && npm run dev"

REM Wait a bit for the backend to start
timeout /t 3 /nobreak >nul

echo Starting frontend server on port 3001...
start "Hexagon Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo Both servers are starting in separate windows.
echo The game will be available at http://localhost:3001
echo.
echo Press any key to exit...
pause >nul