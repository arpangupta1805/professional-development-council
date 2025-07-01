# Professional Development Council - IIT Gandhinagar

This is the official website for the Professional Development Council of IIT Gandhinagar, built with [Next.js](https://nextjs.org/) and configured for GitHub Pages deployment.

## 🚀 Quick Start

### Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

#### Setup Instructions:

1. **Repository Configuration**:
   - Make sure your repository name matches the `basePath` in `next.config.js`
   - Current configuration assumes repository name is `pdc-own`
   - If your repository has a different name, update the `basePath` and `assetPrefix` in `next.config.js`

2. **GitHub Settings**:
   - Go to your repository's Settings > Pages
   - Set Source to "GitHub Actions"
   - The workflow will automatically deploy when you push to the main branch

3. **Environment Variables** (if needed):
   - Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to repository secrets if using Google authentication
   - Go to Settings > Secrets and variables > Actions

#### Manual Deployment:

```bash
npm run build
npm run export
npm run deploy
```

#### Important Notes:

- This is a static export of the Next.js app (no server-side features)
- Authentication has been disabled for GitHub Pages compatibility
- All content is publicly accessible
- API routes have been removed as they're not supported on GitHub Pages

## 📁 Project Structure

```
├── components/          # React components
├── data/               # Static data files
├── pages/              # Next.js pages
├── public/             # Static assets
├── styles/             # CSS files
├── .github/workflows/  # GitHub Actions
└── next.config.js      # Next.js configuration
```

## 🛠️ Features

- Responsive design
- Event management
- Team directory
- Material resources
- Contact forms
- Blog system

## 📝 License

This project is for the Professional Development Council of IIT Gandhinagar.

