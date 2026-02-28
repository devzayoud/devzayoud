@echo off
title LEO IPTV Flutter App Build Test

echo LEO IPTV Flutter App Build Test
echo ==============================

REM Check if Flutter is installed
where flutter >nul 2>&1
if %errorlevel% neq 0 (
    echo Flutter is not installed. Please install Flutter first.
    pause
    exit /b 1
)

REM Get project dependencies
echo Getting project dependencies...
flutter pub get

REM Run Flutter analyze to check for code issues
echo Analyzing code...
flutter analyze

REM Run tests if they exist
echo Running tests...
flutter test

REM Try building for different platforms
echo Building for Android...
flutter build apk --debug

echo Build tests completed successfully!

pause