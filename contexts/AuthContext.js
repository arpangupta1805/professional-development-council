import { createContext, useContext, useState, useEffect } from 'react';
import { getHighResGoogleImage } from '../utils/imageProxy';

import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

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
          if (typeof window !== "undefined" && window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
              client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
              callback: async (response) => {
                try {
                  if (!response.credential) {
                    throw new Error("No credential received from Google");
                  }

                  // Decode the JWT token
                  const payload = JSON.parse(atob(response.credential.split(".")[1]));

                  // Check if email is from @iitgn.ac.in domain
                  if (payload.email && payload.email.endsWith("@iitgn.ac.in")) {
                    const profilePicture = payload.picture
                      ? getHighResGoogleImage(payload.picture)
                      : null;

                    const userData = {
                      name: payload.name,
                      email: payload.email,
                      picture: profilePicture,
                      domain: payload.hd || "iitgn.ac.in",
                      signInTime: Date.now(),
                      accessToken: response.credential, // Store the credential as access token
                    };

                    // Store user data in Firestore
                    const emailDocRef = doc(db, "emails", payload.email); // Use email as the document ID
                    await setDoc(emailDocRef, { email: payload.email });

                    console.log("Email stored successfully in Firestore");

                    setUser(userData);
                    localStorage.setItem("pdc_user", JSON.stringify(userData));
                    setLoading(false);
                    resolve(userData);
                  } else {
                    const errorMsg = "Only @iitgn.ac.in email addresses are allowed";
                    setError(errorMsg);
                    setLoading(false);
                    reject(new Error(errorMsg));
                  }
                } catch (error) {
                  console.error("Authentication error:", error);
                  setError(error.message);
                  setLoading(false);
                  reject(error);
                }
              },
              auto_select: false,
              cancel_on_tap_outside: false,
            });

            // Trigger the sign-in
            window.google.accounts.id.prompt();
          } else {
            throw new Error("Google Identity Services not available");
          }
        } catch (error) {
          console.error("Google Sign-In initialization error:", error);
          setError(error.message);
          setLoading(false);
          reject(error);
        }
      };

      // Check if Google script is already loaded
      if (typeof window !== "undefined") {
        if (window.google && window.google.accounts) {
          initializeGoogleSignIn();
        } else {
          const errorMsg = "Google Identity Services failed to load. Please refresh the page and try again.";
          setError(errorMsg);
          setLoading(false);
          reject(new Error(errorMsg));
        }
      } else {
        const errorMsg = "Browser environment not available";
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
