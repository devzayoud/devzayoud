# LEOIPTV - Professional Android TV IPTV Application

A complete React Native IPTV application designed specifically for Android TV devices, featuring a modern interface optimized for TV remote control navigation.

## Features

### Core Functionality
- **Live TV Streaming**: Support for HLS and MPEG-TS streams
- **VOD (Video on Demand)**: Movies and series streaming
- **Catch-up TV**: Watch previously aired content
- **Electronic Program Guide (EPG)**: TV schedule and program information
- **Multi-language Support**: 15+ languages with RTL support
- **Parental Controls**: PIN-protected content filtering

### IPTV Integration
- **M3U8 Playlist Support**: Import standard IPTV playlists
- **Xtreme Code API**: Direct integration with Xtreme Code panels
- **Multiple Playlist Management**: Organize and manage multiple sources
- **Auto-refresh**: Automatic playlist updates

### Android TV Optimized
- **Remote Control Navigation**: Optimized for D-pad navigation
- **Landscape Interface**: Designed for TV screens
- **Focus Management**: Clear visual focus indicators
- **Large UI Elements**: Easy to see from across the room

### Advanced Features
- **Multiple Players**: Default, VLC, and MX Player support
- **Subtitle Support**: Customizable subtitles with multiple languages
- **Favorites System**: Mark and organize favorite channels
- **Search Functionality**: Global search across all content
- **Settings Management**: Comprehensive configuration options

## Installation

### Prerequisites
- Node.js 16 or higher
- React Native development environment
- Android Studio with Android TV emulator or physical Android TV device

### Setup
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. For Android TV development:
   ```bash
   npx react-native run-android
   ```

### Building APK
```bash
# Debug APK
npm run build-debug

# Release APK
npm run build-apk
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── screens/            # Main application screens
├── context/            # React Context for state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and constants
└── hooks/              # Custom React hooks
```

## Key Screens

- **SplashScreen**: Application startup screen
- **MainScreen**: Dashboard with favorites and navigation
- **LiveTVScreen**: Live channel browsing and playback
- **MoviesScreen**: VOD movie catalog
- **SeriesScreen**: TV series catalog
- **PlayerScreen**: Video playback with controls
- **SettingsScreen**: Application configuration
- **PlaylistManagerScreen**: IPTV playlist management
- **ParentalControlScreen**: Content filtering controls

## Configuration

### IPTV Setup
1. Navigate to Settings > Manage Playlists
2. Add M3U8 playlist URL or use Xtreme Code login
3. Playlists will be automatically imported and channels populated

### Parental Controls
1. Go to Settings > Parental Control
2. Enable protection and set a 4-digit PIN
3. Select categories to lock/unlock

### Language Settings
1. Access Settings > Change Language
2. Choose from 15+ supported languages
3. Interface updates immediately

## Android TV Specific Features

### Remote Control Support
- **D-pad Navigation**: Full support for directional navigation
- **Back Button**: Proper back navigation handling
- **Menu Button**: Quick access to options
- **Play/Pause**: Media control integration

### TV Interface Design
- **10-foot UI**: Optimized for viewing from distance
- **High Contrast**: Clear visibility on TV screens
- **Large Touch Targets**: Easy navigation with remote
- **Focus Indicators**: Clear visual feedback

### Performance Optimizations
- **Hardware Acceleration**: Enabled for smooth video playback
- **Memory Management**: Optimized for TV hardware constraints
- **Network Handling**: Robust streaming with error recovery

## Technical Details

### Video Playback
- **React Native Video**: Primary video component
- **Multiple Formats**: HLS, MPEG-TS, MP4 support
- **Adaptive Streaming**: Automatic quality adjustment
- **Subtitle Rendering**: Built-in subtitle support

### State Management
- **React Context**: Centralized application state
- **AsyncStorage**: Persistent data storage
- **Real-time Updates**: Live data synchronization

### Network Features
- **M3U8 Parsing**: Complete playlist parsing
- **Xtreme Code API**: Full API integration
- **Error Handling**: Robust network error management
- **Offline Support**: Cached data for offline browsing

## Development

### Adding New Features
1. Create components in `src/components/`
2. Add screens to `src/screens/`
3. Update navigation in `App.tsx`
4. Add types to `src/types/index.ts`

### Customization
- **Colors**: Modify `src/utils/constants.ts`
- **Translations**: Update `src/utils/translations.ts`
- **Settings**: Extend `AppSettings` interface

## Building for Production

### Release Configuration
1. Update version in `package.json`
2. Configure signing in `android/app/build.gradle`
3. Build release APK:
   ```bash
   npm run build-apk
   ```

### Android TV Store
- Ensure `android.software.leanback` is required
- Add TV banner icon
- Test on multiple TV devices
- Follow Android TV design guidelines

## Support

### Supported Formats
- **Video**: HLS, MPEG-TS, MP4, WebM
- **Audio**: AAC, MP3, PCM
- **Subtitles**: SRT, VTT, ASS

### Supported Devices
- Android TV boxes
- Smart TVs with Android TV
- Fire TV devices
- Android tablets (landscape mode)

## License

Professional IPTV Solution for Android TV
Copyright (c) 2024 LEOIPTV

## Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## Changelog

### Version 1.0.0
- Initial release
- Complete Android TV interface
- M3U8 and Xtreme Code support
- Multi-language interface
- Parental controls
- Advanced player settings