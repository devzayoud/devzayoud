@echo off
echo Building Android application...
cd /d "%~dp0"

echo Cleaning previous builds...
flutter clean
flutter pub get

echo Building Android release...
flutter build apk --release

echo Build completed!
echo The APK can be found in build\app\outputs\flutter-apk\
pause