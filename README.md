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

1. **Repository Configuration** ✅ COMPLETED:
   - Repository name configured as `pdc_final`
   - `basePath` and `assetPrefix` configured in `next.config.js`
   - `homepage` set in `package.json`

2. **GitHub Settings** - YOU NEED TO DO THIS:
   - Go to your repository's Settings > Pages
   - Set Source to "GitHub Actions"
   - The workflow will automatically deploy when you push to the main branch

3. **Google Authentication Setup** (Optional):
   - Get a Google OAuth Client ID from [Google Cloud Console](https://console.cloud.google.com/)
   - Add authorized JavaScript origins: `https://arpangupta1805.github.io`
   - Add authorized redirect URIs: `https://arpangupta1805.github.io/pdc_final/auth/signin`
   - Add `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to repository secrets:
     - Go to Settings > Secrets and variables > Actions
     - Click "New repository secret"
     - Name: `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
     - Value: Your Google OAuth Client ID

#### Manual Deployment:

```bash
npm run build
npm run export
npm run deploy
```

#### Important Notes:

- ✅ This is a static export of the Next.js app
- ✅ Authentication is implemented using Google Sign-In (client-side only)
- ✅ Protected routes: All `/material/*` and `/resume_review` pages
- ✅ Only @iitgn.ac.in email addresses can access protected content
- ✅ All public content is accessible without authentication
- ⚠️  API routes are not supported on GitHub Pages (removed from build)

#### Your Site URL:
Once deployed, your site will be available at: **https://arpangupta1805.github.io/pdc_final/**

#### Checking Deployment Status:
- Go to your repository > Actions tab to see deployment progress
- First deployment may take 5-10 minutes
- Future deployments will be automatic on every push to main branch

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

