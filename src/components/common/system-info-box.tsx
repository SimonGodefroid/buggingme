'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardBody, Chip, Skeleton } from '@nextui-org/react';
import Icon from './Icon';

interface SystemInfo {
  browser: string;
  browserVersion: string;
  os: string;
  isMobile: boolean;
  screenResolution: string;
  timezone: string;
  language: string;
  onLine: boolean;
  ipAddress: string;
}

const SystemInfoBox: React.FC = () => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSystemInfo = async (): Promise<SystemInfo> => {
      const nav = navigator as any;
      const userAgent = nav.userAgent;
      
      // Quick browser detection
      let browser = 'Unknown';
      let browserVersion = 'Unknown';
      
      if (userAgent.includes('Chrome') && !userAgent.includes('Edg')) {
        browser = 'Chrome';
        browserVersion = userAgent.match(/Chrome\/([0-9.]+)/)?.[1]?.split('.')[0] || 'Unknown';
      } else if (userAgent.includes('Firefox')) {
        browser = 'Firefox';
        browserVersion = userAgent.match(/Firefox\/([0-9.]+)/)?.[1]?.split('.')[0] || 'Unknown';
      } else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) {
        browser = 'Safari';
        browserVersion = userAgent.match(/Version\/([0-9.]+)/)?.[1]?.split('.')[0] || 'Unknown';
      } else if (userAgent.includes('Edg')) {
        browser = 'Edge';
        browserVersion = userAgent.match(/Edg\/([0-9.]+)/)?.[1]?.split('.')[0] || 'Unknown';
      }
      
      // Quick OS detection
      let os = 'Unknown';
      if (userAgent.includes('Windows')) os = 'Windows';
      else if (userAgent.includes('Mac OS')) os = 'macOS';
      else if (userAgent.includes('Linux')) os = 'Linux';
      else if (userAgent.includes('Android')) os = 'Android';
      else if (userAgent.includes('iOS')) os = 'iOS';
      
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
      
      // Get IP address
      let ipAddress = 'Unknown';
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        ipAddress = data.ip;
      } catch (error) {
        ipAddress = 'Private';
      }
      
      return {
        browser,
        browserVersion,
        os,
        isMobile,
        screenResolution: `${screen.width}×${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop() || 'Unknown',
        language: nav.language?.split('-')[0]?.toUpperCase() || 'Unknown',
        onLine: nav.onLine,
        ipAddress,
      };
    };

    getSystemInfo().then(info => {
      setSystemInfo(info);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <Card className="w-full max-w-md bg-gradient-to-br from-background to-default-50 border border-divider">
        <CardBody className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="bx-desktop" />
            <span className="text-sm font-medium text-foreground-600">System Info</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 rounded" />
            ))}
          </div>
        </CardBody>
      </Card>
    );
  }

  if (!systemInfo) return null;

  const InfoItem: React.FC<{ icon: string; label: string; value: string; status?: 'online' | 'offline' | 'mobile' | 'desktop' }> = ({ 
    icon, label, value, status 
  }) => (
    <div className="flex items-center justify-between gap-2 min-w-0">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="w-3.5 h-3.5 text-default-400 flex-shrink-0">
          <Icon name={icon} />
        </div>
        <span className="text-xs text-default-500 truncate">{label}</span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {status && (
          <div className={`w-1.5 h-1.5 rounded-full ${
            status === 'online' ? 'bg-success' : 
            status === 'offline' ? 'bg-danger' : 
            status === 'mobile' ? 'bg-warning' : 'bg-primary'
          }`} />
        )}
        <span className="text-xs font-medium text-foreground truncate max-w-20" title={value}>
          {value}
        </span>
      </div>
    </div>
  );

  return (
    <Card className="w-full  bg-gradient-to-br from-background to-default-50 border border-divider shadow-sm hover:shadow-md transition-shadow">
      <CardBody className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 text-primary">
              <Icon name="bx-desktop" />
            </div>
            <span className="text-sm font-medium text-foreground-600">System Info</span>
          </div>
          <Chip 
            size="sm" 
            variant="flat" 
            color={systemInfo.onLine ? "success" : "danger"}
            className="text-xs"
          >
            {systemInfo.onLine ? "Online" : "Offline"}
          </Chip>
        </div>
        
        <div className="space-y-2.5">
          <InfoItem 
            icon="bx-globe" 
            label="Browser" 
            value={`${systemInfo.browser} ${systemInfo.browserVersion}`} 
          />
          
          <InfoItem 
            icon="bx-mobile" 
            label="Device" 
            value={`${systemInfo.os} ${systemInfo.isMobile ? 'Mobile' : 'Desktop'}`}
            status={systemInfo.isMobile ? 'mobile' : 'desktop'}
          />
          
          <InfoItem 
            icon="bx-desktop" 
            label="Screen" 
            value={systemInfo.screenResolution} 
          />
          
          <InfoItem 
            icon="bx-time" 
            label="Zone" 
            value={systemInfo.timezone} 
          />
          
          <InfoItem 
            icon="bx-world" 
            label="Lang" 
            value={systemInfo.language} 
          />
          
          <InfoItem 
            icon="bx-wifi" 
            label="IP" 
            value={systemInfo.ipAddress} 
            status={systemInfo.onLine ? 'online' : 'offline'}
          />
        </div>

        {/* Hidden input for form submission */}
        <input 
          type="hidden" 
          name="systemInfo" 
          value={JSON.stringify(systemInfo)}
        />
      </CardBody>
    </Card>
  );
};

export default SystemInfoBox;