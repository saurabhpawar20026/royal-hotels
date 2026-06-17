# Getting a Website Link for Royal Hotels

## Option 1 — Instant link on your own network (no signup)
Works on your phone/laptop on the **same WiFi**:
```bash
npm run build
npm run preview -- --host
```
Open the **Network** URL it prints, e.g. `http://192.168.31.249:4173/`.
(Only reachable by devices on your WiFi — not the public internet.)

## Option 2 — Real public link (recommended, ~2 min)

### A. Netlify Drop (easiest, no CLI)
1. Run `npm run build` → creates the `dist/` folder.
2. Go to <https://app.netlify.com/drop>.
3. **Drag the `dist` folder** onto the page.
4. You get a public URL like `https://royal-hotels-xyz.netlify.app` instantly.

### B. Vercel (CLI)
```bash
npm i -g vercel
vercel            # follow the prompts, login in browser
vercel --prod     # public production URL
```
(`vercel.json` is already included so client-side routes work.)

### C. GitHub Pages
Push to GitHub, then use the Actions “Deploy static content” workflow on `dist/`.
Set Vite `base` to your repo name if not served from the domain root.

## Notes on payments after deploying
- The static site (UI, UPI QR, Pay-at-Hotel) works anywhere.
- **Razorpay card/netbanking/wallet** needs the backend (`server/`) hosted too —
  deploy it to Render/Railway, then set `VITE_API_BASE=https://your-backend-url`
  in a root `.env` (or your host's env vars) and rebuild.
- The included `_redirects` (Netlify) and `vercel.json` make deep links work without 404s.
