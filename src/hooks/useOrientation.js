import { useState, useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const useOrientation = () => {
  const [isLandscape, setIsLandscape] = useState(false);
  const [isNativeApp, setIsNativeApp] = useState(false);

  useEffect(() => {
    // Check if we're in a native app
    const nativeApp = Capacitor.isNativePlatform();
    setIsNativeApp(nativeApp);

    // Function to determine orientation
    const checkOrientation = () => {
      // For native apps, use screen orientation API if available
      if (nativeApp && window.screen && window.screen.orientation) {
        const orientation = window.screen.orientation.type;
        const landscape = orientation.includes('landscape');
        setIsLandscape(landscape);
      } else {
        // Fallback to window dimensions
        const isLandscapeMode = window.innerWidth > window.innerHeight;
        setIsLandscape(isLandscapeMode);
      }
    };

    // Check orientation on mount
    checkOrientation();

    // Listen for orientation changes
    const handleOrientationChange = () => {
      // Add a small delay to ensure the orientation has fully changed
      setTimeout(checkOrientation, 100);
    };

    // Listen for window resize (for web and as fallback)
    const handleResize = () => {
      checkOrientation();
    };

    // Add event listeners
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isLandscape, isNativeApp };
};

export default useOrientation; 