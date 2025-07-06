/**
 * Utility functions for handling profile images, especially Google profile images
 * that may have CORS restrictions
 */

/**
 * Get a high-resolution version of a Google profile picture
 * @param {string} originalUrl - The original Google profile picture URL
 * @returns {string} - URL with higher resolution
 */
export const getHighResGoogleImage = (originalUrl) => {
  if (!originalUrl) return null;
  
  // Replace s96-c (96x96) with s200-c (200x200) for higher resolution
  return originalUrl.replace(/s\d+-c/, 's200-c');
};

/**
 * Create a fallback image URL for when the original image fails to load
 * Uses a placeholder service with user's initials
 * @param {string} name - User's name
 * @param {number} size - Image size in pixels (default: 200)
 * @returns {string} - Fallback image URL
 */
export const getFallbackAvatarUrl = (name, size = 200) => {
  if (!name) return null;
  
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
  
  // Using a reliable avatar service
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=4285f4&color=ffffff&size=${size}&bold=true`;
};

/**
 * Preload an image and return a promise
 * @param {string} src - Image source URL
 * @returns {Promise} - Promise that resolves when image loads or rejects on error
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (!src) {
      reject(new Error('No image source provided'));
      return;
    }
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';
    
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    
    img.src = src;
  });
};

/**
 * Try to load an image with fallback options
 * @param {string} primaryUrl - Primary image URL to try first
 * @param {string} fallbackUrl - Fallback image URL
 * @returns {Promise<string>} - Promise that resolves with a working image URL
 */
export const loadImageWithFallback = async (primaryUrl, fallbackUrl) => {
  if (!primaryUrl && !fallbackUrl) {
    throw new Error('No image URLs provided');
  }
  
  // Try primary URL first
  if (primaryUrl) {
    try {
      await preloadImage(primaryUrl);
      return primaryUrl;
    } catch (error) {
      console.log('Primary image failed to load:', error.message);
    }
  }
  
  // Try fallback URL
  if (fallbackUrl) {
    try {
      await preloadImage(fallbackUrl);
      return fallbackUrl;
    } catch (error) {
      console.log('Fallback image failed to load:', error.message);
    }
  }
  
  throw new Error('All image URLs failed to load');
};
