import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import Head from 'next/head';

const SignIn = () => {
  const { user, signInWithGoogle, loading, error, clearError } = useAuth();
  const router = useRouter();
  const { callbackUrl } = router.query;

  useEffect(() => {
    if (user) {
      // Redirect to callback URL or home if already signed in
      router.push(callbackUrl || '/');
    }
  }, [user, router, callbackUrl]);

  const handleSignIn = async () => {
    try {
      clearError(); // Clear any previous errors
      await signInWithGoogle();
      // Router.push will be handled by the useEffect above
    } catch (error) {
      console.error('Sign in failed:', error);
      // Error will be displayed via the error state from context
    }
  };

  if (loading) {
    return (
      <div className="signin-container">
        <div className="signin-content">
          <div className="loading-spinner"></div>
          <h2>Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Sign In - PDC IIT Gandhinagar</title>
      </Head>
      <div className="signin-container">
        <div className="signin-content">
          <div className="signin-header">
            <h1>Professional Development Council</h1>
            <h2>IIT Gandhinagar</h2>
            <p>Sign in with your @iitgn.ac.in email to access exclusive content</p>
          </div>
          
          {error && (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={clearError} className="error-dismiss">×</button>
            </div>
          )}
          
          <div className="signin-form">
            <button 
              className="google-signin-btn"
              onClick={handleSignIn}
              disabled={loading}
            >
              <div className="google-icon">
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </div>
              <span className="button-text">
                {loading ? 'Signing in...' : 'Continue with Google'}
              </span>
              {loading && (
                <div className="loading-spinner-btn">
                  <div className="spinner"></div>
                </div>
              )}
            </button>
            
            <div className="signin-divider">
              <span>Secure authentication for IIT Gandhinagar students</span>
            </div>
            
            <div className="signin-note">
              <div className="note-icon">🔒</div>
              <div className="note-content">
                <p><strong>Restricted Access</strong></p>
                <p>Only @iitgn.ac.in email addresses are allowed to access this platform</p>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          .signin-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
          }

          .signin-content {
            max-width: 400px;
            width: 100%;
            text-align: center;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }

          .signin-header h1 {
            font-size: 1.8rem;
            font-weight: bold;
            margin: 0 0 10px 0;
          }

          .signin-header h2 {
            font-size: 1.3rem;
            font-weight: 600;
            margin: 0 0 20px 0;
            opacity: 0.9;
          }

          .signin-header p {
            font-size: 1rem;
            opacity: 0.8;
            margin: 0 0 30px 0;
            line-height: 1.5;
          }

          .google-signin-button-container {
            margin-bottom: 20px;
            display: flex;
            justify-content: center;
          }

          .google-signin-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            background: white;
            color: #1f2937;
            border: 1px solid #d1d5db;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            width: 100%;
            max-width: 320px;
            margin: 0 auto 20px auto;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            position: relative;
            overflow: hidden;
          }

          .google-signin-btn:hover:not(:disabled) {
            background: #f9fafb;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
          }

          .google-signin-btn:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }

          .google-signin-btn:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
          }

          .google-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .button-text {
            font-weight: 500;
            flex: 1;
            text-align: center;
          }

          .loading-spinner-btn {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
          }

          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #e5e7eb;
            border-top: 2px solid #4285F4;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          .signin-divider {
            margin: 24px 0;
            padding: 0 20px;
          }

          .signin-divider span {
            color: rgba(255, 255, 255, 0.7);
            font-size: 14px;
            font-style: italic;
          }

          .signin-note {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 15px;
            font-size: 0.9rem;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            text-align: left;
          }

          .note-icon {
            font-size: 20px;
            flex-shrink: 0;
          }

          .note-content {
            flex: 1;
          }

          .note-content p {
            margin: 0;
            opacity: 0.9;
          }

          .note-content p:first-child {
            font-weight: 600;
            margin-bottom: 4px;
          }

          .error-message {
            background: rgba(239, 68, 68, 0.1);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 8px;
            padding: 12px;
            margin-bottom: 20px;
            position: relative;
            color: #dc2626;
          }

          .error-message p {
            margin: 0;
            font-size: 14px;
            line-height: 1.4;
          }

          .error-dismiss {
            position: absolute;
            top: 8px;
            right: 12px;
            background: none;
            border: none;
            color: #dc2626;
            font-size: 18px;
            font-weight: bold;
            cursor: pointer;
            padding: 0;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .error-dismiss:hover {
            background: rgba(239, 68, 68, 0.1);
            border-radius: 50%;
          }

          .signin-note {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 15px;
            font-size: 0.9rem;
          }

          .signin-note p {
            margin: 0;
            opacity: 0.9;
          }

          .loading-spinner {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-top: 3px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px auto;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 768px) {
            .signin-content {
              padding: 30px 20px;
            }

            .signin-header h1 {
              font-size: 1.5rem;
            }

            .signin-header h2 {
              font-size: 1.1rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default SignIn;
