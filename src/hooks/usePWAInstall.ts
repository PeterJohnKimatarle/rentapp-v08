import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      if (typeof window !== 'undefined') {
        // Check for standalone mode (iOS Safari) or display-mode media query
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
        const isIOSStandalone = (window.navigator as any).standalone === true;

        const installed = isStandalone || isIOSStandalone;
        console.log('PWA Install Debug:', {
          isStandalone,
          isIOSStandalone,
          isInstalled: installed,
          userAgent: navigator.userAgent
        });

        setIsInstalled(installed);
      }
    };

    checkIfInstalled();

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('PWA Install Debug: beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log('PWA Install Debug: appinstalled event fired');
      // Hide the install button
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for the appinstalled event
    window.addEventListener('appinstalled', handleAppInstalled);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const installPWA = async () => {
    if (!deferredPrompt) {
      console.log('Install prompt not available');
      return false;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setIsInstallable(false);

    // Log the result
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      return true;
    } else {
      console.log('User dismissed the install prompt');
      return false;
    }
  };

  return {
    isInstallable,
    isInstalled,
    installPWA,
  };
}
