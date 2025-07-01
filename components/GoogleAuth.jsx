import { useEffect } from 'react';
import Script from 'next/script';

const GoogleAuth = ({ children }) => {
  useEffect(() => {
    // Add a fallback loader in case the Script component fails
    const checkGoogleScript = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
      }
    };

    // Check after a small delay
    const timer = setTimeout(checkGoogleScript, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('Google Identity Services loaded');
        }}
        onError={(e) => {
          console.error('Failed to load Google Identity Services:', e);
        }}
      />
      {children}
    </>
  );
};

export default GoogleAuth;
