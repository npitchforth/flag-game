import React, { useState, useEffect } from 'react';
import { getDeviceId, getDeviceInfo } from '../services/deviceId';

const DeviceIdTest = () => {
  const [deviceId, setDeviceId] = useState(null);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeviceInfo() {
      try {
        const id = await getDeviceId();
        const info = await getDeviceInfo();
        
        setDeviceId(id);
        setDeviceInfo(info);
      } catch (error) {
        console.error('Error loading device info:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDeviceInfo();
  }, []);

  if (loading) {
    return <div>Loading device info...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '14px' }}>
      <h3>Device ID Test</h3>
      <div><strong>Device ID:</strong> {deviceId}</div>
      <div><strong>Platform:</strong> {deviceInfo?.platform}</div>
      <div><strong>Is Mobile:</strong> {deviceInfo?.isMobile ? 'Yes' : 'No'}</div>
      
      {deviceInfo?.model && <div><strong>Model:</strong> {deviceInfo.model}</div>}
      {deviceInfo?.manufacturer && <div><strong>Manufacturer:</strong> {deviceInfo.manufacturer}</div>}
      {deviceInfo?.operatingSystem && <div><strong>OS:</strong> {deviceInfo.operatingSystem} {deviceInfo.osVersion}</div>}
      
      <button 
        onClick={() => {
          localStorage.removeItem('deviceId');
          window.location.reload();
        }}
        style={{ marginTop: '10px', padding: '5px 10px' }}
      >
        Reset Device ID (Web only)
      </button>
    </div>
  );
};

export default DeviceIdTest; 