# Asset Path Configuration Guide

This guide explains how to handle asset paths when deploying to GitHub Pages and what to change if you move the repository.

## Current Configuration

The project uses a base path configuration for GitHub Pages deployment:
- **Repository Name**: `pdc-own`
- **Base Path**: `/pdc-own/` (added automatically in production)
- **Site URL**: `https://arpangupta1805.github.io/pdc-own/`

## Asset Path Strategy

### 1. CSS Background Images
**Location**: `styles/index.css`
- Uses relative paths: `url("../assets/images/banner-1.jpg")`
- ✅ Automatically works with base path
- No manual changes needed when repository name changes

### 2. JavaScript/JSX Image Sources
**Locations**: Components and pages
- Uses `getAssetPath()` utility function
- ✅ Automatically handles base path injection
- No manual changes needed when repository name changes

### 3. Data Files (Team/Events/Blogs)
**Locations**: `data/*.js` files
- Uses absolute paths: `"/assets/images/photo.jpg"`
- ✅ Processed by `getAssetPath()` utility
- No manual changes needed when repository name changes

## If You Change Repository Name

If you rename your repository from `pdc-own` to something else, update these files:

### Required Changes:

1. **next.config.js**
   ```javascript
   const repoName = 'your-new-repo-name'; // Change this line
   ```

2. **package.json**
   ```json
   "homepage": "https://username.github.io/your-new-repo-name"
   ```

3. **README.md**
   - Update all URL references
   - Update Google OAuth redirect URIs documentation

### Files That Update Automatically:
- ✅ All CSS background images
- ✅ All JavaScript/JSX image sources
- ✅ All data file image paths
- ✅ All component asset references

## Asset Path Utility

The `utils/assetPath.js` utility handles all dynamic path resolution:

```javascript
export const getAssetPath = (path) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  if (path.startsWith(basePath)) {
    return path; // Already has base path
  }
  
  if (path.startsWith('/')) {
    return `${basePath}${path}`; // Absolute path from public folder
  }
  
  return `${basePath}/${path}`; // Relative path
};
```

## Asset Types Handled

### Images
- Team member photos
- Event images
- Blog images
- Background images (CSS)
- Logo and branding images

### External Assets
- Google Fonts (no change needed)
- External images (Unsplash, etc.) (no change needed)
- CDN resources (no change needed)

## Troubleshooting Asset Loading

If you see 404 errors for assets:

1. **Check the browser console** for specific failed URLs
2. **Verify the file exists** in `public/assets/images/`
3. **Check the data files** for correct image paths
4. **Ensure components import** `getAssetPath` utility
5. **Rebuild the project** after configuration changes

## Common Asset Path Patterns

### ✅ Correct Usage:
```jsx
// In components
import { getAssetPath } from '../utils/assetPath';
<Image src={getAssetPath(item.image)} alt="..." />

// In CSS
background: url("../assets/images/banner.jpg");

// In data files
"image": "/assets/images/photo.jpg"
```

### ❌ Incorrect Usage:
```jsx
// Direct absolute paths (won't work on GitHub Pages)
<Image src="/assets/images/photo.jpg" alt="..." />

// Hard-coded base paths (breaks when repo name changes)
<Image src="/pdc-own/assets/images/photo.jpg" alt="..." />
```

## Deployment Verification

After deployment, check that these assets load correctly:
- Hero section background images
- Team member photos
- Event and blog images
- Navigation logo

The site should work at: `https://username.github.io/repo-name/`
