@echo off
title LEO IPTV Flutter App Runner

echo LEO IPTV Flutter App Runner
echo ==========================

REM Check if Flutter is installed
where flutter >nul 2>&1
if %errorlevel% neq 0 (
    echo Flutter is not installed. Please install Flutter first.
    pause
    exit /b 1
)

REM Get Flutter status
echo Checking Flutter status...
flutter doctor

REM Get project dependencies
echo Getting project dependencies...
flutter pub get

REM Show available devices
echo Available devices:
flutter devices

echo.
echo Select an option to run the app:
echo 1. Run on default device
echo 2. Run on Android
echo 3. Run on Chrome (Web)
echo 4. Run on Windows
echo 5. Exit

set /p choice=Enter your choice (1-5): 

if "%choice%"=="1" (
    echo Running on default device...
    flutter run
) else if "%choice%"=="2" (
    echo Running on Android...
    flutter run -d android
) else if "%choice%"=="3" (
    echo Running on Chrome...
    flutter run -d chrome
) else if "%choice%"=="4" (
    echo Running on Windows...
    flutter run -d windows
) else if "%choice%"=="5" (
    echo Exiting...
    exit /b 0
) else (
    echo Invalid option. Running on default device...
    flutter run
)

pause