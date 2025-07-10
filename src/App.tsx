import React, { useState } from 'react';
import { PWAInstallPrompt } from './components/PWAInstallPrompt';
import { SplashScreen } from './components/SplashScreen';
import { MainInterface } from './components/MainInterface';
import { LiveTV } from './components/LiveTV';
import { Movies } from './components/Movies';
import { Series } from './components/Series';
import { Catchup } from './components/Catchup';
import { Search } from './components/Search';
import { TVGuide } from './components/TVGuide';
import { SettingsPage } from './components/SettingsPage';
import { useIPTVPlayer } from './hooks/useIPTVPlayer';

type ActiveView = 'main' | 'live' | 'movies' | 'series' | 'catchup' | 'search' | 'tvguide' | 'settings';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [activeView, setActiveView] = useState<ActiveView>('main');
  
  const {
    channels,
    playlists,
    currentChannel,
    favorites,
    searchQuery,
    selectedCategory,
    settings,
    isPlaying,
    volume,
    currentTime,
    duration,
    filteredChannels,
    categories,
    isParentalUnlocked,
    verifyParentalPin,
    userInfo,
    updateUserInfo,
    isRefreshing,
    refreshData,
    exitApplication,
    setSearchQuery,
    setSelectedCategory,
    toggleFavorite,
    importPlaylist,
    playChannel,
    togglePlay,
    seekTo,
    changeVolume,
    updateSettings,
    setCurrentTime,
    setDuration
  } = useIPTVPlayer();

  const renderView = () => {
    switch (activeView) {
      case 'live':
        return (
          <LiveTV
            channels={channels}
            favorites={favorites}
            currentChannel={currentChannel}
            isParentalUnlocked={isParentalUnlocked}
            onVerifyPin={verifyParentalPin}
            onChannelSelect={playChannel}
            onToggleFavorite={toggleFavorite}
            onBack={() => setActiveView('main')}
          />
        );
      case 'movies':
        return <Movies onBack={() => setActiveView('main')} />;
      case 'series':
        return <Series onBack={() => setActiveView('main')} />;
      case 'catchup':
        return <Catchup onBack={() => setActiveView('main')} />;
      case 'search':
        return (
          <Search
            channels={channels}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onChannelSelect={playChannel}
            onBack={() => setActiveView('main')}
          />
        );
      case 'tvguide':
        return (
          <TVGuide
            channels={channels}
            currentChannel={currentChannel}
            onChannelSelect={playChannel}
            onBack={() => setActiveView('main')}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            onBack={() => setActiveView('main')}
          />
        );
      default:
        return (
          <MainInterface
            currentChannel={currentChannel}
            isPlaying={isPlaying}
            volume={volume}
            currentTime={currentTime}
            duration={duration}
            channels={channels}
            favorites={favorites}
            onTogglePlay={togglePlay}
            onVolumeChange={changeVolume}
            onSeek={seekTo}
            onChannelSelect={playChannel}
            onToggleFavorite={toggleFavorite}
            onNavigate={setActiveView}
            userInfo={userInfo}
            onUpdateUserInfo={updateUserInfo}
            isRefreshing={isRefreshing}
            onRefreshData={refreshData}
            onExit={exitApplication}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <PWAInstallPrompt />
      {showSplash ? (
        <SplashScreen onComplete={() => setShowSplash(false)} />
      ) : (
        renderView()
      )}
    </div>
  );
}

export default App;