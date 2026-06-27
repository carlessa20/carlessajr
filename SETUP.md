# How to Get This Live on GitHub Pages

## Step 1 — Install Git (if you don't have it)
Go to https://git-scm.com/download/mac and download. Install it, then open Terminal.

## Step 2 — Create a new repo on GitHub
1. Go to github.com and log in as carlessa20
2. Click the green **New** button (top left)
3. Name the repo: **carlessajr**
4. Keep it **Public**
5. Do NOT check "Add a README file"
6. Click **Create repository**

## Step 3 — Push the site files
Open Terminal and run these commands one at a time:

```
cd "/Users/carlessajr/Downloads/Claude/Buck Mason/Buck Mason/website"
git init
git add .
git commit -m "Initial site build"
git branch -M main
git remote add origin https://github.com/carlessa20/carlessajr.git
git push -u origin main
```

## Step 4 — Turn on GitHub Pages
1. In your repo on GitHub, click **Settings**
2. Click **Pages** in the left sidebar
3. Under "Branch", select **main** and click **Save**
4. Your site will be live at: **carlessa20.github.io/carlessajr**

## Step 5 — Connect your custom domain (carlessajr.com)
1. In GitHub Pages settings, type **carlessajr.com** in the "Custom domain" field and save
2. Go to your domain registrar (wherever you bought carlessajr.com — Squarespace, GoDaddy, etc.)
3. Add these DNS records:

**A Records** (point your root domain to GitHub):
```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

**CNAME Record**:
```
Name: www
Value: carlessa20.github.io
```

4. DNS changes take 10–30 minutes to propagate
5. Once live, check "Enforce HTTPS" in GitHub Pages settings

## Step 6 — Add your content
- **Videos**: Upload your videos to Vimeo, then replace the `YOUR_REEL_ID` and `GRID_VIDEO_1` etc. placeholders in `index.html` with the real Vimeo video IDs
- **Images**: Create an `images/` folder inside the `website` folder, add your photos, then update the `src` paths in the HTML
- **Hero photo on About page**: Add your photo as `images/hero-photo.jpg`

## Updating the site later
Any time you make changes, run:
```
cd "/Users/carlessajr/Downloads/Claude/Buck Mason/Buck Mason/website"
git add .
git commit -m "Update site"
git push
```
Changes go live in about 30 seconds.
