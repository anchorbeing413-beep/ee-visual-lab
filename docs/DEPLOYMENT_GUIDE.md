# EE Visual Lab: Deployment & Hosting Guide

This guide provides simple, step-by-step instructions to deploy your **EE Visual Lab** website live to the internet for free, and run it locally with one click.

---

## 🌟 Recommended Platform: GitHub Pages (100% Free Forever)

Because EE Visual Lab is built with a pure, high-performance static frontend (zero complex backend overhead for Phase 1), **GitHub Pages** is the industry-standard hosting solution for scientific and educational projects.

### Why GitHub Pages?
* **100% Free Forever:** No hosting fees, no server maintenance.
* **Automatic CI/CD:** We have already added an automated deployment pipeline (`.github/workflows/deploy.yml`). Every time you push a new commit, your live site automatically updates.
* **Free HTTPS/SSL:** Built-in secure connection.
* **Custom Domain Support:** Can be linked to your own domain (e.g., `eevisuallab.org` or `eevisuallab.com`) at any time.

---

### Step-by-Step Instructions to Deploy to GitHub Pages

#### Step 1: Create a Repository on GitHub
1. Log in to your GitHub account: [github.com](https://github.com) (configured as `anchorbeing413-beep`).
2. Click the **`+`** icon in the top-right corner and select **New repository**.
3. Repository name: `ee-visual-lab`
4. Set visibility to **Public**.
5. Leave "Add a README file" **unchecked** (we already have our own).
6. Click **Create repository**.

#### Step 2: Push Your Local Code to GitHub
Open your terminal in VS Code and run the following three commands:
```powershell
git remote add origin https://github.com/anchorbeing413-beep/ee-visual-lab.git
git branch -M master
git push -u origin master
```

#### Step 3: Enable GitHub Actions Deployment
1. On GitHub, go to your repository page.
2. Click **Settings** (top tab with gear icon).
3. In the left sidebar, click **Pages** (under the "Code and automation" section).
4. Under **"Build and deployment"** > **Source**, change the dropdown from *"Deploy from a branch"* to **"GitHub Actions"**.
5. That's it! GitHub Actions will trigger our pre-configured workflow (`.github/workflows/deploy.yml`) and deploy your site within 60 seconds.

Your live website URL will be:
```
https://anchorbeing413-beep.github.io/ee-visual-lab/
```

---

## ⚡ Alternative Free Platforms

### Option B: Vercel (Instant 1-Click Cloud)
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
2. Click **"Add New..."** > **"Project"**.
3. Select your `ee-visual-lab` repository and click **Deploy**.
4. Vercel automatically deploys your project to a fast global edge network at: `https://ee-visual-lab.vercel.app`.

### Option C: Netlify (Drag-and-Drop or Git)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the `gate os` folder directly into your browser window.
3. Your site goes live instantly with a free Netlify subdomain.

---

## 💻 Local 1-Click Launch (Offline Dev Environment)

You don't need internet to run and develop EE Visual Lab:

1. **On Windows:** Simply double-click **`start-lab.bat`** in the project folder.
   * It starts the built-in Node server on port 3000.
   * It automatically launches your default web browser to `http://localhost:3000/index.html`.
2. **From Terminal / VS Code:**
   ```powershell
   npm start
   ```
3. **Run All Mathematical & Validation Tests:**
   ```powershell
   npm test
   ```
