import { useEffect, useState } from 'react';
import Head from 'next/head';

export default function Debug() {
  const [envVars, setEnvVars] = useState({});

  useEffect(() => {
    setEnvVars({
      NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      NEXT_PUBLIC_BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH,
      NODE_ENV: process.env.NODE_ENV,
      clientIdLength: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.length || 0,
      clientIdFirst10: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID?.substring(0, 10) || 'Not found',
    });
  }, []);

  return (
    <div className="main-container">
      <Head>
        <title>Debug Environment Variables</title>
      </Head>
      
      <div className="page-container">
        <h1>Environment Variables Debug</h1>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px',
          fontFamily: 'monospace'
        }}>
          <h3>Environment Variables:</h3>
          <pre>{JSON.stringify(envVars, null, 2)}</pre>
          
          <h3>Google Scripts Loaded:</h3>
          <p>Google Identity Services: {typeof window !== 'undefined' && window.google ? 'Loaded' : 'Not Loaded'}</p>
          
          <h3>Current URL:</h3>
          <p>{typeof window !== 'undefined' ? window.location.href : 'Server Side'}</p>
          
          <h3>Build Time Check:</h3>
          <p>This page was built at: {new Date().toISOString()}</p>
        </div>
      </div>
    </div>
  );
}
