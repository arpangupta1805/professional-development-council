import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already signed in (stored in localStorage)
    const storedUser = localStorage.getItem('pdc_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        // Check if the stored user data is still valid (less than 24 hours old)
        const isExpired = Date.now() - userData.signInTime > 24 * 60 * 60 * 1000;
        if (!isExpired) {
          setUser(userData);
        } else {
          localStorage.removeItem('pdc_user');
        }
      } catch (error) {
        localStorage.removeItem('pdc_user');
      }
    }
    setLoading(false);
  }, []);

  const signInWithGoogle = () => {
    return new Promise((resolve, reject) => {
      setError(null);
      setLoading(true);

      const initializeGoogleSignIn = () => {
        try {
          if (typeof window !== 'undefined' && window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              callback: (response) => {
                try {
                  if (!response.credential) {
                    throw new Error('No credential received from Google');
                  }

                  // Decode the JWT token
                  const payload = JSON.parse(atob(response.credential.split('.')[1]));
                  
                  console.log('Google payload:', payload); // Debug log
                  
                  // Check if email is from @iitgn.ac.in domain
                  if (payload.email && payload.email.endsWith('@iitgn.ac.in')) {
                    const userData = {
                      name: payload.name,
                      email: payload.email,
                      picture: payload.picture,
                      domain: payload.hd || 'iitgn.ac.in',
                      signInTime: Date.now(),
                      accessToken: response.credential // Store the credential as access token
                    };
                    
                    console.log('User data created:', userData); // Debug log
                    
                    setUser(userData);
                    localStorage.setItem('pdc_user', JSON.stringify(userData));
                    setLoading(false);
                    resolve(userData);
                  } else {
                    const errorMsg = 'Only @iitgn.ac.in email addresses are allowed';
                    setError(errorMsg);
                    setLoading(false);
                    reject(new Error(errorMsg));
                  }
                } catch (error) {
                  console.error('Authentication error:', error);
                  setError(error.message);
                  setLoading(false);
                  reject(error);
                }
              },
              auto_select: false,
              cancel_on_tap_outside: false
            });

            // Use renderButton instead of prompt for better control
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'none';
            document.body.appendChild(buttonContainer);
            
            window.google.accounts.id.renderButton(buttonContainer, {
              theme: 'outline',
              size: 'large',
              width: '100%'
            });
            
            // Trigger the sign-in
            window.google.accounts.id.prompt((notification) => {
              if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
                // Fallback to manual button click
                const button = buttonContainer.querySelector('div[role="button"]');
                if (button) {
                  button.click();
                } else {
                  setError('Unable to initialize Google Sign-In');
                  setLoading(false);
                  reject(new Error('Unable to initialize Google Sign-In'));
                }
              }
            });
            
            // Clean up
            setTimeout(() => {
              if (buttonContainer && buttonContainer.parentNode) {
                buttonContainer.parentNode.removeChild(buttonContainer);
              }
            }, 1000);
            
          } else {
            throw new Error('Google Identity Services not available');
          }
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
          setError(error.message);
          setLoading(false);
          reject(error);
        }
      };

      // Check if Google script is already loaded
      if (typeof window !== 'undefined') {
        if (window.google && window.google.accounts) {
          initializeGoogleSignIn();
        } else {
          // Wait for the script to load
          let attempts = 0;
          const maxAttempts = 50; // 5 seconds
          
          const checkGoogle = setInterval(() => {
            attempts++;
            if (window.google && window.google.accounts) {
              clearInterval(checkGoogle);
              initializeGoogleSignIn();
            } else if (attempts >= maxAttempts) {
              clearInterval(checkGoogle);
              const errorMsg = 'Google Identity Services failed to load. Please refresh the page and try again.';
              setError(errorMsg);
              setLoading(false);
              reject(new Error(errorMsg));
            }
          }, 100);
        }
      } else {
        const errorMsg = 'Browser environment not available';
        setError(errorMsg);
        setLoading(false);
        reject(new Error(errorMsg));
      }
    });
  };

  const signOut = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('pdc_user');
    if (typeof window !== 'undefined' && window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    signInWithGoogle,
    signOut,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
