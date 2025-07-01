// Helper function to get the correct asset path for GitHub Pages
export const getAssetPath = (path) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  // If path already starts with basePath, don't add it again
  if (path.startsWith(basePath)) {
    return path;
  }
  
  // Handle absolute paths from public folder
  if (path.startsWith('/')) {
    return `${basePath}${path}`;
  }
  
  // Handle relative paths
  return `${basePath}/${path}`;
};
