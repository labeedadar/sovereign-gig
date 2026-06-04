# Hosting Sovereign-Gig on GitHub (FREE)

Follow these steps to host your tool so you can use it on your phone or any computer.

### 1. Create a GitHub Repo
- Go to GitHub and create a new repository named `sovereign-gig`.
- Do NOT initialize with a README (keep it empty).

### 2. Upload the Files
- In your terminal (in the `Sovereign-Gig-Web` folder):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/sovereign-gig.git
git push -u origin main
```

### 3. Enable GitHub Pages
- Go to your repo **Settings** > **Pages**.
- Under **Build and deployment** > **Branch**, select `main` and `/ (root)`.
- Click **Save**.

### 4. Your Tool is Live!
- In a few minutes, your site will be available at: `https://YOUR_USERNAME.github.io/sovereign-gig/`
- Open this link on your **Mobile Phone** to use the Signal Filter and Escrow Portal anywhere.

---

### Security Note
- This tool is private and client-side only. 
- It does not store your data on a server.
- The Smart Contract logic uses MetaMask (on mobile, use the MetaMask app browser).
