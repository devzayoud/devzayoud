# Running the LEO IPTV Flutter App

This document provides instructions for running the LEO IPTV Flutter application to verify fixes and test functionality.

## Prerequisites

Before running the app, ensure you have:

1. Flutter SDK installed (version 2.17.0 or higher)
2. Dart SDK (included with Flutter)
3. An IDE (Android Studio, VS Code, etc.)
4. Device emulators or physical devices for testing

## Getting Started

1. Navigate to the project directory:
   ```
   cd leoiptv_flutter
   ```

2. Install dependencies:
   ```
   flutter pub get
   ```

## Running the App

### For Android
```
flutter run -d android
```
Or to run on a specific Android device/emulator:
```
flutter run -d <device_name>
```

### For iOS
```
flutter run -d ios
```
Or to run on a specific iOS device/simulator:
```
flutter run -d <device_name>
```

### For Web
```
flutter run -d chrome
```

### For Windows
```
flutter run -d windows
```

### For macOS
```
flutter run -d macos
```

## Building Release Versions

### Android APK
```
flutter build apk
```

### Android App Bundle
```
flutter build appbundle
```

### iOS
```
flutter build ios
```

### Web
```
flutter build web
```

### Windows
```
flutter build windows
```

## Testing Different Screens

The app has several main screens that can be accessed through the bottom navigation:
- Live TV (/live-tv)
- Movies (/movies)
- Series (/series)
- Catchup (/catchup)
- Search (/search)

You can navigate directly to a specific screen during development using:
```
flutter run --route=/screen-name
```

## Debugging

To run in debug mode with verbose output:
```
flutter run --verbose
```

To check for potential issues:
```
flutter doctor
```

## Common Issues and Solutions

1. If you encounter build errors, try:
   ```
   flutter clean
   flutter pub get
   flutter run
   ```

2. If you have dependency issues:
   ```
   flutter pub cache repair
   flutter pub get
   ```

3. For iOS-specific issues:
   ```
   cd ios
   pod install
   cd ..
   flutter run
   ```

## Verifying Fixes

To verify specific fixes:

1. Run the app on your target platform
2. Navigate to the relevant section where the fix was applied
3. Test the functionality that was modified
4. Check for any visual or behavioral changes
5. Verify that no regressions were introduced

For example, if a fix was made to the player functionality:
1. Go to Live TV or Movies section
2. Play a video
3. Test the specific feature that was fixed
4. Check for any error messages in the console