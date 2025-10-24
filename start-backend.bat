@echo off
echo =====================================
echo ME Management - Starting Backend
echo =====================================
echo.

cd "%~dp0server\Server.Api"

echo Building backend...
dotnet build

if %errorlevel% equ 0 (
    echo.
    echo Backend build successful!
    echo.
    echo Applying database migrations...
    dotnet ef database update
    
    if %errorlevel% equ 0 (
        echo.
        echo Database migrations applied successfully!
        echo Starting API on http://localhost:5000
        echo.
        echo Default credentials:
        echo   Username: admin
        echo   Password: admin
        echo.
        echo Swagger documentation: http://localhost:5000/swagger
        echo.
        echo Press Ctrl+C to stop the server
        echo =====================================
        echo.
        
        dotnet run --no-build
    ) else (
        echo.
        echo Migration failed! Make sure SQL Server is running.
        echo You can update the connection string in appsettings.json
        pause
        exit /b 1
    )
) else (
    echo.
    echo Build failed! Please check the errors above.
    pause
    exit /b 1
)
