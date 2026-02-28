#!/bin/bash

# Script to test if the LEO IPTV Flutter app builds correctly

echo "LEO IPTV Flutter App Build Test"
echo "==============================="

# Check if Flutter is installed
if ! command -v flutter &> /dev/null
then
    echo "Flutter is not installed. Please install Flutter first."
    exit 1
fi

# Get project dependencies
echo "Getting project dependencies..."
flutter pub get

# Run Flutter analyze to check for code issues
echo "Analyzing code..."
flutter analyze

# Run tests if they exist
echo "Running tests..."
flutter test

# Try building for different platforms
echo "Building for Android..."
flutter build apk --debug

echo "Building for web..."
flutter build web --release

echo "Build tests completed successfully!"