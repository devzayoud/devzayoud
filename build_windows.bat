@echo off
echo Building Windows application...
cd /d "%~dp0"

echo Cleaning previous builds...
flutter clean
flutter pub get

echo Building Windows release...
flutter build windows --release

echo Build completed!
echo The executable can be found in build\windows\x64\runner\Release\
pause