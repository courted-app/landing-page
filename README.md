# Landing Page with Google Sheets Integration (React)

A modern, beautiful React landing page with a waitlist form that automatically saves submissions to Google Sheets. Built with React, Vite, and React Icons.

## Features

- ⚛️ **React** - Modern, component-based architecture
- 🎨 **Beautiful UI** - Gradient design with smooth animations
- 🎯 **Icons** - React Icons for polished visual elements
- 📱 **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
- 📊 **Google Sheets Integration** - Automatic form submissions
- 🗺️ **Google Places Autocomplete** - Smart city/club location input with autocomplete
- ⚡ **Fast** - Built with Vite for lightning-fast development
- ✨ **Animations** - Smooth transitions and hover effects

## Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Google Sheets

1. Go to [Google Sheets](https://sheets.google.com)
2. Create a new spreadsheet
3. Name it something like "Waitlist Submissions"
4. Copy the **Spreadsheet ID** from the URL (the long string between `/d/` and `/edit`)
   - Example: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID_HERE/edit`

### Step 3: Set Up Google Apps Script

1. Go to [Google Apps Script](https://script.google.com)
2. Click **"New Project"**
3. Delete the default code and paste the contents of `google-apps-script.js`
4. Update these variables in the script:
   - `SPREADSHEET_ID`: Paste your spreadsheet ID from Step 2
   - `SHEET_NAME`: The name of the sheet tab (default is "Waitlist")
5. Click **"Save"** (Ctrl/Cmd + S) and give your project a name
6. Click **"Deploy"** → **"New deployment"**
7. Click the gear icon ⚙️ next to "Select type" and choose **"Web app"**
8. Configure:
   - **Description**: "Waitlist Form Handler"
   - **Execute as**: "Me"
   - **Who has access**: "Anyone"
9. Click **"Deploy"**
10. **Authorize** the script when prompted:
    - Click "Review Permissions"
    - Choose your Google account
    - Click "Advanced" → "Go to [Your Project Name] (unsafe)"
    - Click "Allow"
11. Copy the **Web App URL** (looks like: `https://script.google.com/macros/s/...`)

### Step 4: Connect Your Landing Page

1. Open `src/App.jsx`
2. Find the line: `const GOOGLE_SCRIPT_URL = 'YOUR_GOOGLE_SCRIPT_URL_HERE';`
3. Replace `YOUR_GOOGLE_SCRIPT_URL_HERE` with the Web App URL you copied in Step 3

### Step 5: Set Up Google Places API (For City/Club Autocomplete)

The form includes Google Places Autocomplete for the "Current Club / City" field. To enable this feature:

1. **Create a Google Cloud Project** (if you don't have one):
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select an existing one

2. **Enable Places API**:
   - In the Google Cloud Console, go to "APIs & Services" → "Library"
   - Search for "Places API"
   - Click on it and click "Enable"

3. **Create an API Key**:
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy your API key

4. **Restrict Your API Key** (Recommended for security):
   - Click on your API key to edit it
   - Under "API restrictions", select "Restrict key"
   - Choose "Places API" from the list
   - Under "Website restrictions", add your domain(s)
   - Click "Save"

5. **Add API Key to Your Project**:
   - Open `index.html`
   - Find the line: `<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY_HERE&libraries=places"></script>`
   - Replace `YOUR_API_KEY_HERE` with your actual API key

**Note**: The Google Places API has a free tier that includes $200 in credits per month, which is typically enough for most small to medium sites. Check [Google Cloud Pricing](https://cloud.google.com/maps-platform/pricing) for details.

### Step 6: Run Locally

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to see your landing page!

### Step 7: Build for Production

```bash
npm run build
```

This creates an optimized `dist` folder ready for deployment.

## Hosting Options

### Option 1: Netlify (Recommended - Free & Easy)

**Via Netlify Website (Easiest):**
1. Go to [netlify.com](https://netlify.com)
2. Sign up/login
3. Drag and drop your `dist` folder (after running `npm run build`)
4. Your site will be live instantly!

**Via Netlify CLI:**
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build your project
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

**Benefits**: Free SSL, custom domain support, continuous deployment from Git

### Option 2: Vercel (Free & Fast)

**Via Vercel Website:**
1. Go to [vercel.com](https://vercel.com)
2. Sign up/login
3. Import your Git repository
4. Vercel will automatically detect React/Vite and deploy!

**Via Vercel CLI:**
```bash
# Install Vercel CLI
npm install -g vercel

# Build and deploy
npm run build
vercel --prod
```

**Benefits**: Free SSL, global CDN, automatic deployments, zero config

### Option 3: GitHub Pages

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from a branch
   - Branch: `main` / `dist` folder
   - Your site: `https://YOUR_USERNAME.github.io/REPO_NAME`

**Note**: You may need to update the `base` in `vite.config.js` for GitHub Pages:
```js
export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/'
})
```

### Option 4: Cloudflare Pages (Free)

1. Go to [Cloudflare Pages](https://pages.cloudflare.com)
2. Sign up/login
3. Connect your Git repository
4. Build settings:
   - Framework preset: Vite
   - Build command: `npm run build`
   - Build output directory: `dist`
5. Deploy!

**Benefits**: Free SSL, global CDN, fast performance

## Project Structure

```
landing-page/
├── src/
│   ├── App.jsx                      # Main React component
│   ├── App.css                      # Component styles
│   ├── main.jsx                     # React entry point
│   ├── index.css                    # Global styles
│   └── components/
│       └── PlacesAutocomplete.jsx   # Google Places autocomplete component
├── index.html                       # HTML template
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
├── google-apps-script.js            # Google Sheets integration code
└── README.md                        # This file
```

## Customization

### Change Colors

Edit the gradient in `src/App.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change Brand Name

Update in `src/App.jsx`:
```jsx
<h1 className="logo">Courted</h1>
```

### Add More Form Fields

1. Add state in `src/App.jsx`:
   ```jsx
   const [formData, setFormData] = useState({ 
     name: '', 
     email: '', 
     phone: '' // new field
   })
   ```

2. Add input field in the form
3. Update `google-apps-script.js` to handle the new field

### Change Icons

This project uses [React Icons](https://react-icons.github.io/react-icons/). Browse available icons and replace them in `App.jsx`:
```jsx
import { FiMail, FiUser } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'
```

## Troubleshooting

### Form submissions not working?

1. **Check Google Apps Script URL**: Make sure it's correct in `src/App.jsx`
2. **Check Google Apps Script permissions**: Ensure it's set to "Anyone" can access
3. **Check browser console**: Open DevTools (F12) and look for errors
4. **Verify Google Sheet**: Make sure the spreadsheet ID is correct

### Build errors?

- Make sure all dependencies are installed: `npm install`
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Port already in use?

Vite will automatically try a different port. Or specify one:
```bash
npm run dev -- --port 3000
```

## Development

- **Start dev server**: `npm run dev`
- **Build for production**: `npm run build`
- **Preview production build**: `npm run preview`

## Dependencies

- **React** - UI library
- **Vite** - Build tool and dev server
- **React Icons** - Icon library

## License

Feel free to use this project for your own purposes!
