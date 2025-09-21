import React from 'react';

interface AdSenseSlotProps {
  slot: 'header' | 'sidebar' | 'article-top' | 'article-middle' | 'article-bottom';
  className?: string;
}

export const AdSenseSlot: React.FC<AdSenseSlotProps> = ({ slot, className = '' }) => {
  const getSlotConfig = (slot: string) => {
    const configs = {
      'header': { width: 728, height: 90, name: 'Header Banner' },
      'sidebar': { width: 300, height: 250, name: 'Sidebar Square' },
      'article-top': { width: 728, height: 90, name: 'Article Top Banner' },
      'article-middle': { width: 336, height: 280, name: 'Article Middle' },
      'article-bottom': { width: 728, height: 90, name: 'Article Bottom Banner' }
    };
    return configs[slot] || configs['sidebar'];
  };

  const config = getSlotConfig(slot);

  return (
    <div className={`bg-muted border-2 border-dashed border-muted-foreground/20 rounded-lg flex items-center justify-center text-center p-4 ${className}`}>
      <div className="text-muted-foreground">
        <div className="text-sm font-medium">{config.name}</div>
        <div className="text-xs">{config.width} x {config.height}</div>
        <div className="text-xs mt-1">Google AdSense Placeholder</div>
      </div>
    </div>
  );
};

export const AutoAds: React.FC = () => {
  return (
    <>
      {/* Google AdSense Auto Ads Script */}
      <script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX"
        crossOrigin="anonymous"
      />
      <script>
        {`(adsbygoogle = window.adsbygoogle || []).push({
          google_ad_client: "ca-pub-XXXXXXXXXXXXXXXXX",
          enable_page_level_ads: true
        });`}
      </script>
    </>
  );
};

interface AffiliateSlotProps {
  type: 'crypto-exchange' | 'broker' | 'tool' | 'book';
  position: 'inline' | 'sidebar' | 'footer';
  className?: string;
}

export const AffiliateSlot: React.FC<AffiliateSlotProps> = ({ type, position, className = '' }) => {
  const getTypeConfig = (type: string) => {
    const configs = {
      'crypto-exchange': { name: 'Crypto Exchange', description: 'Trade cryptocurrencies' },
      'broker': { name: 'Broker Platform', description: 'Stock & Forex trading' },
      'tool': { name: 'Financial Tool', description: 'Analysis & portfolio tools' },
      'book': { name: 'Finance Book', description: 'Educational resources' }
    };
    return configs[type] || configs['tool'];
  };

  const config = getTypeConfig(type);
  const isInline = position === 'inline';

  return (
    <div className={`bg-accent/50 border border-accent rounded-lg p-4 ${isInline ? 'my-4' : ''} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-accent-foreground">{config.name}</div>
          <div className="text-xs text-muted-foreground">{config.description}</div>
          <div className="text-xs text-accent-foreground/60 mt-1">Affiliate Partner Placeholder</div>
        </div>
        <div className="ml-4">
          <div className="bg-primary text-primary-foreground px-3 py-1 rounded text-sm">
            Learn More
          </div>
        </div>
      </div>
    </div>
  );
};