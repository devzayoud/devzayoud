@echo off
echo 🔧 Setting up Android development environment for LEOIPTV...

REM Check if Node.js is installed
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js is installed

REM Check if Java is installed
echo Checking Java installation...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Java is not installed. Please install JDK 11 or higher.
    echo Download from: https://adoptium.net/
    pause
    exit /b 1
)
echo ✅ Java is installed

REM Check if Android SDK is available
echo Checking Android SDK...
adb version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Android SDK is not properly configured.
    echo Please install Android Studio and set up environment variables:
    echo 1. Install Android Studio from https://developer.android.com/studio
    echo 2. Set ANDROID_HOME environment variable
    echo 3. Add Android SDK tools to PATH
    pause
    exit /b 1
)
echo ✅ Android SDK is configured

REM Install Capacitor if not already installed
echo Installing Capacitor...
call npm install @capacitor/core @capacitor/cli @capacitor/android
if %errorlevel% neq 0 (
    echo ❌ Failed to install Capacitor
    pause
    exit /b 1
)
echo ✅ Capacitor installed

REM Initialize Capacitor if not already done
if not exist "capacitor.config.ts" (
    echo Initializing Capacitor...
    call npx cap init "LEOIPTV" "com.leoiptv.app"
    if %errorlevel% neq 0 (
        echo ❌ Failed to initialize Capacitor
        pause
        exit /b 1
    )
    echo ✅ Capacitor initialized
) else (
    echo ✅ Capacitor already initialized
)

REM Add Android platform if not already added
if not exist "android" (
    echo Adding Android platform...
    call npx cap add android
    if %errorlevel% neq 0 (
        echo ❌ Failed to add Android platform
        pause
        exit /b 1
    )
    echo ✅ Android platform added
) else (
    echo ✅ Android platform already exists
)

echo.
echo 🎉 Android development environment setup complete!
echo.
echo Next steps:
echo 1. Run 'npm run build-android' to build the app
echo 2. Run 'npm run android-studio' to open in Android Studio
echo 3. Build APK from Android Studio or run 'npm run build-debug'
echo.
pause