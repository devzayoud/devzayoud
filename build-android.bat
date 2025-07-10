@echo off
echo 🚀 Building LEOIPTV Android APK...

REM Step 1: Build the web app
echo 📦 Building web application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Failed to build web application
    pause
    exit /b 1
)

REM Step 2: Copy web assets to Android
echo 📱 Copying assets to Android...
call npx cap copy android
if %errorlevel% neq 0 (
    echo ❌ Failed to copy assets to Android
    pause
    exit /b 1
)

REM Step 3: Sync Capacitor
echo 🔄 Syncing Capacitor...
call npx cap sync android
if %errorlevel% neq 0 (
    echo ❌ Failed to sync Capacitor
    pause
    exit /b 1
)

REM Step 4: Build APK
echo 🔨 Building Android APK...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo ❌ Failed to build APK
    cd ..
    pause
    exit /b 1
)

echo ✅ APK built successfully!
echo 📍 APK location: android\app\build\outputs\apk\debug\app-debug.apk

REM Step 5: Copy APK to root directory for easy access
copy app\build\outputs\apk\debug\app-debug.apk ..\leoiptv-debug.apk
if %errorlevel% equ 0 (
    echo 📱 APK copied to: leoiptv-debug.apk
) else (
    echo ⚠️ Could not copy APK to root directory
)

cd ..

echo.
echo 🎉 Build complete! You can now install the APK on your Android device.
echo.
echo To install:
echo 1. Enable 'Unknown Sources' in Android Settings
echo 2. Transfer leoiptv-debug.apk to your device
echo 3. Tap the APK file to install
echo.
pause