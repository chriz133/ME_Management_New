@echo off
REM MSSQL Dev Server Quick Start Script for Windows
REM This script helps you manage the local MSSQL development server

setlocal enabledelayedexpansion

set COMPOSE_FILE=docker-compose.dev.yml
set CONTAINER_NAME=memanagement-mssql-dev

if "%1"=="" goto :help
if "%1"=="help" goto :help
if "%1"=="--help" goto :help
if "%1"=="/?" goto :help
if "%1"=="start" goto :start
if "%1"=="stop" goto :stop
if "%1"=="restart" goto :restart
if "%1"=="status" goto :status
if "%1"=="logs" goto :logs
if "%1"=="reset" goto :reset
if "%1"=="connect" goto :connect

echo Unknown command: %1
echo.
goto :help

:help
echo MSSQL Development Server Management Script
echo.
echo Usage: %0 [command]
echo.
echo Commands:
echo   start       - Start the MSSQL server
echo   stop        - Stop the MSSQL server
echo   restart     - Restart the MSSQL server
echo   status      - Check server status
echo   logs        - View server logs
echo   reset       - Remove and recreate the server (deletes all data!)
echo   connect     - Connect to the database using sqlcmd
echo   help        - Show this help message
echo.
goto :eof

:check_docker
where docker >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Docker is not installed or not in PATH
    exit /b 1
)
docker info >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo Error: Docker is not running
    exit /b 1
)
goto :eof

:start
call :check_docker
if %ERRORLEVEL% neq 0 exit /b 1

echo Starting MSSQL development server...
docker-compose -f %COMPOSE_FILE% up -d
echo.
echo Server is starting. This may take a minute...
echo Connection details:
echo   Server: localhost,1433
echo   Database: firmaDB
echo   Username: sa
echo   Password: YourStrong!Passw0rd
echo.
echo Run '%0 logs' to view initialization progress
echo Run '%0 status' to check if the server is ready
goto :eof

:stop
call :check_docker
if %ERRORLEVEL% neq 0 exit /b 1

echo Stopping MSSQL development server...
docker-compose -f %COMPOSE_FILE% stop
echo Server stopped
goto :eof

:restart
call :check_docker
if %ERRORLEVEL% neq 0 exit /b 1

echo Restarting MSSQL development server...
docker-compose -f %COMPOSE_FILE% restart
echo Server restarted
goto :eof

:status
call :check_docker
if %ERRORLEVEL% neq 0 exit /b 1

echo MSSQL Development Server Status:
echo ================================
docker-compose -f %COMPOSE_FILE% ps
echo.

docker ps --filter "name=%CONTAINER_NAME%" --filter "status=running" | find "%CONTAINER_NAME%" >nul
if %ERRORLEVEL% equ 0 (
    echo [OK] Server is running
) else (
    echo [X] Server is not running
)
goto :eof

:logs
call :check_docker
if %ERRORLEVEL% neq 0 exit /b 1

echo Showing MSSQL server logs (press Ctrl+C to exit)...
echo ==================================================
docker-compose -f %COMPOSE_FILE% logs -f mssql
goto :eof

:reset
call :check_docker
if %ERRORLEVEL% neq 0 exit /b 1

echo WARNING: This will delete all database data!
set /p CONFIRM="Are you sure you want to reset the server? (yes/no): "
if /i not "%CONFIRM%"=="yes" (
    echo Reset cancelled
    goto :eof
)

echo Removing MSSQL server and data...
docker-compose -f %COMPOSE_FILE% down -v
echo Server removed
echo.
echo Starting fresh server...
goto :start

:connect
call :check_docker
if %ERRORLEVEL% neq 0 exit /b 1

docker ps --filter "name=%CONTAINER_NAME%" --filter "status=running" | find "%CONTAINER_NAME%" >nul
if %ERRORLEVEL% neq 0 (
    echo Error: Server is not running. Start it with: %0 start
    exit /b 1
)

echo Connecting to database...
echo Connecting to firmaDB as sa...
echo (Type 'exit' or press Ctrl+D to quit)
docker exec -it %CONTAINER_NAME% /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P "YourStrong!Passw0rd" -d firmaDB
goto :eof
