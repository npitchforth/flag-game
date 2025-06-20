import { Device } from '@capacitor/device';
import { Capacitor } from '@capacitor/core';

// Generate a UUID for web browsers
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get or create a device ID
async function getDeviceId() {
  try {
    // Check if we're on a mobile platform
    const isMobile = Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios';
    console.log('📱 Device ID - Platform:', Capacitor.getPlatform());
    console.log('📱 Device ID - Is mobile:', isMobile);
    
    if (isMobile) {
      // Use Capacitor Device plugin for mobile
      console.log('📱 Device ID - Using Capacitor Device plugin...');
      const deviceInfo = await Device.getId();
      console.log('📱 Device ID - Device.getId() result:', deviceInfo, JSON.stringify(deviceInfo));
      return deviceInfo.identifier;
    } else {
      // Use localStorage for web browsers
      console.log('🌐 Device ID - Using localStorage...');
      let deviceId = localStorage.getItem('deviceId');
      
      if (!deviceId) {
        deviceId = generateUUID();
        localStorage.setItem('deviceId', deviceId);
        console.log('🌐 Device ID - Generated new UUID:', deviceId);
      } else {
        console.log('🌐 Device ID - Found existing UUID:', deviceId);
      }
      
      return deviceId;
    }
  } catch (error) {
    console.error('❌ Device ID - Error getting device ID:', error);
    
    // Fallback to localStorage even on mobile if Device plugin fails
    console.log('🔄 Device ID - Falling back to localStorage...');
    let deviceId = localStorage.getItem('deviceId');
    
    if (!deviceId) {
      deviceId = generateUUID();
      localStorage.setItem('deviceId', deviceId);
      console.log('🔄 Device ID - Generated fallback UUID:', deviceId);
    } else {
      console.log('🔄 Device ID - Using existing fallback UUID:', deviceId);
    }
    
    return deviceId;
  }
}

// Get device info for debugging
async function getDeviceInfo() {
  try {
    const isMobile = Capacitor.getPlatform() === 'android' || Capacitor.getPlatform() === 'ios';
    console.log('📱 Device Info - Platform:', Capacitor.getPlatform());
    console.log('📱 Device Info - Is mobile:', isMobile);
    
    if (isMobile) {
      console.log('📱 Device Info - Getting mobile device info...');
      const info = await Device.getInfo();
      console.log('📱 Device Info - Device.getInfo() result:', info);
      return {
        platform: Capacitor.getPlatform(),
        isMobile: true,
        model: info.model,
        platform: info.platform,
        operatingSystem: info.operatingSystem,
        osVersion: info.osVersion,
        manufacturer: info.manufacturer,
        isVirtual: info.isVirtual,
        webViewVersion: info.webViewVersion
      };
    } else {
      console.log('🌐 Device Info - Getting web device info...');
      return {
        platform: 'web',
        isMobile: false,
        userAgent: navigator.userAgent
      };
    }
  } catch (error) {
    console.error('❌ Device Info - Error getting device info:', error);
    return {
      platform: 'unknown',
      isMobile: false,
      error: error.message
    };
  }
}

export { getDeviceId, getDeviceInfo }; 