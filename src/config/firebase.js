import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported, logEvent as analyticsLogEvent } from 'firebase/analytics';
import { firebaseKeys } from './firebase-keys';

// Your Firebase configuration for WEB APP
// Uses environment variables for sensitive data
const firebaseConfig = firebaseKeys;

// Initialize Firebase with error handling
let app = null;
let analytics = null;

try {
  app = initializeApp(firebaseConfig);
  
  // Initialize Analytics (only if supported and in browser environment)
  if (typeof window !== 'undefined') {
    isSupported().then(yes => {
      if (yes) {
        analytics = getAnalytics(app);
      }
    }).catch(error => {
      console.error('Firebase Analytics initialization error:', error);
    });
  }
} catch (error) {
  console.error('Firebase initialization error:', error);
}

// Export for use in other parts of the app
export { app, analytics };

// Helper function to log errors to console (Crashlytics will be handled by native Android)
export const logError = (error, context = {}) => {
  console.error('Error:', error, context);
  
  // In a native app, this would be sent to Crashlytics automatically
  // For web, we just log to console for now
  if (typeof window !== 'undefined' && window.Capacitor && window.Capacitor.isNativePlatform()) {
    // Native platform - Crashlytics will handle this automatically
    console.log('Native platform detected - Crashlytics will handle error reporting');
  }
};

// Helper function to log custom events
export const logEvent = (eventName, parameters = {}) => {
  if (analytics) {
    try {
      analyticsLogEvent(analytics, eventName, parameters);
    } catch (e) {
      console.error('Failed to log event to Analytics:', e);
    }
  }
}; 