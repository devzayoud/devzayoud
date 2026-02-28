# LEO IPTV Player

LEO IPTV Player is a cross-platform IPTV application built with Flutter that allows users to stream live TV channels and on-demand content.

## Features

- Stream live TV channels
- On-demand content playback
- Playlist management
- Favorites system
- Parental controls
- EPG (Electronic Program Guide) support

## Building the Application

### Prerequisites

- Flutter SDK (version 3.0 or higher)
- Android Studio or Xcode (for mobile builds)
- Visual Studio (for Windows builds)

### Building for Android

1. Navigate to the project directory:
   ```
   cd leoiptv_flutter
   ```

2. Clean previous builds:
   ```
   flutter clean
   ```

3. Get dependencies:
   ```
   flutter pub get
   ```

4. Build the APK:
   ```
   flutter build apk --release
   ```

5. The APK will be located at:
   ```
   build/app/outputs/flutter-apk/app-release.apk
   ```

### Building for Windows

1. Navigate to the project directory:
   ```
   cd leoiptv_flutter
   ```

2. Clean previous builds:
   ```
   flutter clean
   ```

3. Get dependencies:
   ```
   flutter pub get
   ```

4. Build the Windows executable:
   ```
   flutter build windows --release
   ```

5. The executable and related files will be located at:
   ```
   build/windows/x64/runner/Release/
   ```

## Troubleshooting

### Android Installation Issues

If the APK fails to install on an Android device:

1. Ensure the device meets the minimum requirements (Android 5.0+)
2. Check that the APK is signed properly
3. Try installing with ADB:
   ```
   adb install build/app/outputs/flutter-apk/app-release.apk
   ```

### Windows Installation Issues

If the Windows executable doesn't install properly:

1. Ensure all required DLLs are in the same directory as the executable
2. Run the executable as administrator if needed
3. Check Windows Defender or antivirus software for blocked files

## Application Structure

- `lib/main.dart` - Entry point of the application
- `lib/screens/` - UI screens
- `lib/widgets/` - Reusable UI components
- `lib/providers/` - State management providers
- `lib/models/` - Data models
- `lib/constants/` - Application constants

## Dependencies

- `provider` - State management
- `video_player` - Video playback
- `http` - Network requests
- `shared_preferences` - Local storage
- `connectivity_plus` - Network connectivity
- `path_provider` - File system access
- `url_launcher` - External links

## Version Information

Current version: 1.0.0
Build date: August 2025

## Support

For support, please contact the development team or check the documentation.
