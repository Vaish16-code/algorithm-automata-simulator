"use client";

import { useEffect } from 'react';

interface AdSenseAdProps {
  slot: string;
  format?: 'horizontal' | 'vertical' | 'square' | 'responsive';
  className?: string;
}

const AdSenseAd: React.FC<AdSenseAdProps> = ({ slot, format = 'responsive', className = '' }) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  const getAdDimensions = () => {
    switch (format) {
      case 'horizontal':
        return { width: '728', height: '90' };
      case 'vertical':
        return { width: '160', height: '600' };
      case 'square':
        return { width: '300', height: '250' };
      default:
        return { width: 'auto', height: 'auto' };
    }
  };

  const dimensions = getAdDimensions();

  return (
    <div className={`ad-container ${className}`}>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: dimensions.width,
          height: dimensions.height,
        }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with your AdSense publisher ID
        data-ad-slot={slot}
        data-ad-format={format === 'responsive' ? 'auto' : undefined}
        data-full-width-responsive={format === 'responsive' ? 'true' : undefined}
      />
    </div>
  );
};

export default AdSenseAd;
