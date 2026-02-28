#!/bin/bash

# Script to run the LEO IPTV Flutter app with common configurations

echo "LEO IPTV Flutter App Runner"
echo "=========================="

# Check if Flutter is installed
if ! command -v flutter &> /dev/null
then
    echo "Flutter is not installed. Please install Flutter first."
    exit 1
fi

# Get Flutter status
echo "Checking Flutter status..."
flutter doctor

# Get project dependencies
echo "Getting project dependencies..."
flutter pub get

# Show available devices
echo "Available devices:"
flutter devices

echo ""
echo "Select an option to run the app:"
echo "1. Run on default device"
echo "2. Run on Android"
echo "3. Run on iOS"
echo "4. Run on Chrome (Web)"
echo "5. Run on Windows"
echo "6. Run on macOS"
echo "7. Exit"

read -p "Enter your choice (1-7): " choice

case $choice in
    1)
        echo "Running on default device..."
        flutter run
        ;;
    2)
        echo "Running on Android..."
        flutter run -d android
        ;;
    3)
        echo "Running on iOS..."
        flutter run -d ios
        ;;
    4)
        echo "Running on Chrome..."
        flutter run -d chrome
        ;;
    5)
        echo "Running on Windows..."
        flutter run -d windows
        ;;
    6)
        echo "Running on macOS..."
        flutter run -d macos
        ;;
    7)
        echo "Exiting..."
        exit 0
        ;;
    *)
        echo "Invalid option. Running on default device..."
        flutter run
        ;;
esac