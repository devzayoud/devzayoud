import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    // Check if app is already installed
    const checkInstalled = () => {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isFullscreen = window.matchMedia('(display-mode: fullscreen)').matches;
      const isMinimalUI = window.matchMedia('(display-mode: minimal-ui)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      
      setIsInstalled(isStandalone || isFullscreen || isMinimalUI || isInWebAppiOS);
    };

    checkInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('PWA: App installed successfully');
    };

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const installApp = async () => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('PWA: User accepted the install prompt');
        setIsInstallable(false);
        setDeferredPrompt(null);
        return true;
      } else {
        console.log('PWA: User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.warn('PWA: Service Worker registration failed:', error);
      // Don't throw the error, just log it as a warning since PWA features are optional
    }
  };

  const registerServiceWorker = async () => {
    // Check if we're in an environment that supports Service Workers
    if (!('serviceWorker' in navigator)) {
      console.warn('PWA: Service Workers are not supported in this environment');
      return;
    }

    // Check if we're in StackBlitz or similar environment that doesn't support SW
    if (window.location.hostname === 'localhost' && window.location.port === '5173') {
      console.warn('PWA: Service Workers are not supported in this development environment');
      return;
    }

    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('PWA: Service Worker registered successfully:', registration);
        
        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('PWA: New content available, please refresh');
                // You can show a notification to the user here
              }
            });
          }
        });

        return registration;
      } catch (error) {
        console.error('PWA: Service Worker registration failed:', error);
        return null;
      }
    }
    return null;
  };

  const requestPersistentStorage = async () => {
    if ('storage' in navigator && 'persist' in navigator.storage) {
      try {
        const persistent = await navigator.storage.persist();
        console.log('PWA: Persistent storage:', persistent);
        return persistent;
      } catch (error) {
        console.error('PWA: Error requesting persistent storage:', error);
        return false;
      }
    }
    return false;
  };

  const getStorageEstimate = async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        console.log('PWA: Storage estimate:', estimate);
        return estimate;
      } catch (error) {
        console.error('PWA: Error getting storage estimate:', error);
        return null;
      }
    }
    return null;
  };

  return {
    isInstallable,
    isInstalled,
    isOnline,
    installApp,
    registerServiceWorker,
    requestPersistentStorage,
    getStorageEstimate
  };
};