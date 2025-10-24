@echo off
echo =====================================
echo ME Management - Starting Frontend
echo =====================================
echo.

cd "%~dp0client"

if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting Angular development server...
echo.
echo Application will be available at:
echo   http://localhost:4200
echo.
echo Default credentials:
echo   Username: admin
echo   Password: admin
echo.
echo Make sure the backend is running on http://localhost:5000
echo.
echo Press Ctrl+C to stop the server
echo =====================================
echo.

call npm start
