import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, Tv, Wifi, WifiOff } from 'lucide-react';
import { usePWA } from '../hooks/usePWA';

export const PWAInstallPrompt: React.FC = () => {
  const { isInstallable, isInstalled, isOnline, installApp, registerServiceWorker } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Register service worker on component mount
    registerServiceWorker();
  }, [registerServiceWorker]);

  useEffect(() => {
    // Show install prompt after a delay if installable and not installed
    if (isInstallable && !isInstalled) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000); // Show after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isInstallable, isInstalled]);

  const handleInstall = async () => {
    setIsInstalling(true);
    const success = await installApp();
    setIsInstalling(false);
    
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for this session
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  // Don't show if already installed or dismissed this session
  if (isInstalled || sessionStorage.getItem('pwa-install-dismissed') || !showPrompt) {
    return (
      <>
        {/* Offline indicator */}
        {!isOnline && (
          <div className="fixed top-4 right-4 z-50 flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <WifiOff size={16} />
            <span className="text-sm font-medium">Offline Mode</span>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {/* Online/Offline indicator */}
      <div className={`fixed top-4 right-4 z-40 flex items-center space-x-2 px-4 py-2 rounded-lg shadow-lg ${
        isOnline ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
      }`}>
        {isOnline ? <Wifi size={16} /> : <WifiOff size={16} />}
        <span className="text-sm font-medium">
          {isOnline ? 'Online' : 'Offline'}
        </span>
      </div>

      {/* Install Prompt */}
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-800 rounded-2xl w-full max-w-md border-2 border-yellow-500 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-6 text-black">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img 
                  src="/golden-lion-with-crown-logo-vector-45981373.png" 
                  alt="LEOIPTV" 
                  className="w-12 h-12 object-contain"
                />
                <div>
                  <h2 className="text-xl font-bold">Install LEOIPTV</h2>
                  <p className="text-sm opacity-90">Get the full app experience</p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full hover:bg-black/20 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Tv className="text-yellow-500" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Perfect for Android TV</h3>
                  <p className="text-gray-400 text-sm">Optimized for big screen experience</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Smartphone className="text-yellow-500" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Works Offline</h3>
                  <p className="text-gray-400 text-sm">Access your playlists without internet</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                  <Download className="text-yellow-500" size={20} />
                </div>
                <div>
                  <h3 className="text-white font-semibold">No App Store Needed</h3>
                  <p className="text-gray-400 text-sm">Install directly from your browser</p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-gray-900 rounded-lg p-4 mb-6">
              <h4 className="text-yellow-500 font-semibold mb-3">App Benefits:</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <span>Faster loading and better performance</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <span>Full-screen experience without browser UI</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <span>Home screen icon for quick access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1 h-1 bg-yellow-500 rounded-full"></div>
                  <span>Background updates for playlists</span>
                </li>
              </ul>
            </div>

            {/* Install Button */}
            <button
              onClick={handleInstall}
              disabled={isInstalling}
              className="w-full py-4 bg-yellow-500 text-black rounded-lg font-bold text-lg hover:bg-yellow-400 transition-colors disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <Download size={20} className={isInstalling ? 'animate-bounce' : ''} />
              <span>{isInstalling ? 'Installing...' : 'Install LEOIPTV App'}</span>
            </button>

            <p className="text-center text-xs text-gray-500 mt-4">
              Free • No registration required • Works on all devices
            </p>
          </div>
        </div>
      </div>
    </>
  );
};