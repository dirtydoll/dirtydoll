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
echo To start the servers:
echo   1. Run "run-backend.bat" in a new terminal to start the backend server on port 5000
echo   2. Run "run-frontend.bat" in another terminal to start the frontend server on port 3000
echo.
echo Alternatively, run these commands separately:
echo   - From the backend folder: npm run dev
echo   - From the frontend folder: npm run dev
echo.
echo The game will be available at http://localhost:3000
echo.
echo Press any key to exit...
pause >nul