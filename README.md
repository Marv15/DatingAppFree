# Dating App Free · Local Offline PWA

A minimalist habit and sobriety tracker for staying dating-app-free. Styled with the calm, warm aesthetic of **Claude AI's overlay**.

> 💡 **Experiment Note:** This project was created as a **vibe coding experiment / test with Gemini Flash 3.8** — designed to prove that a fully functional, offline-capable iOS PWA with real-time tracking, zero data loss updates, and multi-app habits can be built without macOS, Xcode, or Swift.

---

## ⚡ Quick Start: Run Locally & Connect Your iPhone

> [!IMPORTANT]
> **HTTPS is required for the offline PWA cache (Service Worker) to work on your phone.**
> iOS Safari and Android Chrome only activate Service Workers over a secure connection.
> A plain `http://192.168.x.x:8080` link will open the app, but **will not cache it for offline use**.
> See the [HTTPS Options](#-https-options-for-offline-installation) section below to enable true offline support.

### 1. Download or Clone
```bash
git clone https://github.com/Marv15/DatingAppFree.git
cd DatingAppFree
```

### 2. Start with One Click
- **Windows**: Double-click `start.bat`
- **macOS / Linux**: Run `./start.sh` *(or run `node server.js`)*

The terminal will automatically detect your local Wi-Fi IP and display:
```
=============================================================
       🕊️  Dating App Free · Local Server Ready
=============================================================
  🖥️  On this Computer:   http://localhost:8080
  📱  On your iPhone:     http://192.168.x.x:8080
=============================================================
```

### 3. Install on Your Phone (iPhone & Android)
1. Complete one of the **HTTPS setup options** from the section below.
2. Open the resulting `https://` URL in Safari (iPhone) or Chrome (Android).
3. Click the **"📱 Add to Mobile"** button inside the app to view the **QR Code**.
4. Add to your home screen:
   - **iPhone (Safari)**: Tap the **Share** button (square with arrow) &rarr; **"Add to Home Screen"** &rarr; tap **Add**.
   - **Android (Chrome)**: Tap the **three dots (⋮)** in the top right &rarr; **"Install app"** or **"Add to Home screen"**.
5. The **FreeTime** app icon is now on your phone's Home Screen! It runs full-screen without browser URL bars, works completely offline, and saves all your streaks locally.

---

## 🔐 HTTPS Options for Offline Installation

The Service Worker (responsible for offline caching) only activates on **HTTPS or localhost**.
Choose the option that fits your setup:

### Option A: Tailscale (Recommended — Private, No Port Forwarding)
[Tailscale](https://tailscale.com/) creates an encrypted, private WireGuard VPN between your devices. Your PC becomes reachable from your phone via a stable `https://` address — no port forwarding or router configuration needed.

1. **Install Tailscale** on both your Windows PC and your iPhone: https://tailscale.com/download
2. **Sign in** with the same account on both devices.
3. **Serve the project folder directly** via `tailscale serve` — no need to run `node server.js` separately:
   ```powershell
   tailscale serve --bg C:\path\to\DatingAppFree
   ```
   Replace `C:\path\to\DatingAppFree` with the actual path to your cloned project folder  
   *(e.g. right-click the folder in Explorer → "Copy as path")*.  
   This creates a `https://<your-machine-name>.<tailnet-name>.ts.net` URL with a valid certificate served directly by Tailscale's built-in file server.
4. Open that `https://` URL on your iPhone in Safari and follow Step 3 above.
5. **Open the app once from the Home Screen with Tailscale/VPN active** — this lets the Service Worker cache all assets on your device.

**After that one-time load, the app works completely offline without VPN.** 🎉  
iOS caches the DNS response for the Tailscale domain, and the Service Worker serves everything from local device storage — no network connection needed at all.

> [!NOTE]
> Tailscale's built-in Go file server may redirect `/index.html` → `/`.
> The Service Worker in this app is specifically coded to handle these redirects,
> so you won't encounter Safari's *"Response served by service worker has redirections"* error.


### Option B: GitHub Pages (Easiest — Public, No Setup)
If you push the repo to GitHub, you can enable GitHub Pages in one click for a permanent free HTTPS URL:

1. Go to: **Settings → Pages → Source**: `Deploy from a branch` → `master` / `/ (root)` → **Save**.
2. After ~60 seconds your app is live at `https://your-username.github.io/DatingAppFree/`.
3. Open that URL on your phone, add to Home Screen — done. No PC needs to be running.

### Option C: Local Tunnel (Quick Testing, Temporary URL)
For short-lived testing without any account or install:
```powershell
npx localtunnel --port 8080
```
The command prints a `https://` URL you can open on your phone. The URL changes every session.

### Option D: Self-signed Certificate (Advanced)
Generate a local certificate with [mkcert](https://github.com/FiloSottile/mkcert) and install the CA on your iPhone. This is more involved but keeps everything 100% local and offline.

---

## ✨ Core Features

- **Master Sobriety Timer**: Real-time ticker (Days, Hours, Minutes, Seconds) dating-app-free. Automatically calculates from your **most recently used / last deleted app**.
- **Multi-App Tracking**: Add apps like *Hinge*, *Tinder*, *Bumble*, *Grindr*, *Feeld*, or custom apps separately. Each app has its own quit date, time saved, subscription fee saved, and personal motivation.
- **Personal Motivations**: Write down why you deleted each app (e.g., *"Hinge felt like an unpaid job"*, *"Tinder destroyed my attention span"*).
- **Urge SOS (Craving Shield)**: Feeling tempted to redownload an app? Tap the shield to view your personalized motivation, follow an interactive 2-minute box breathing visualizer, and get 5 quick real-world grounding activities.
- **Quantified Freedom (Smoke-Free Style)**: Cumulative hours saved, subscription money saved (€/$/£/CHF), and swipes avoided, translated into real-world equivalents (books read, gym workouts).
- **Cognitive Milestones**: 10 neuroscience & psychology-backed recovery phases (Day 1 to Year 1) with progress bars.
- **Daily Reflection Journal**: 1-tap mood check-ins (🌿 Peaceful, ⚡ Energized, ✨ Grounded, 🌧️ Lonely, 🔥 Tempted) with personal notes.
- **6 Custom Aesthetic Themes**: Switch between **Claude Light** ☀️, **Claude Dark** 🌙, **Google Gemini** ✨ (cosmic dark with blue/purple spark), **ChatGPT** 🟢 (OpenAI slate & emerald), **GitHub** 🐙 (developer dark & vibrant green), and **Steam** 🎮 (gaming navy slate & electric cyan) with 1 click!
- **Zero Data Loss on Updates**: App code cached by the Service Worker is strictly decoupled from your streak data. Updating the code will **never** delete your streaks.
- **1-Tap Backup & Restore**: Export your backup JSON file or copy your backup to your clipboard anytime in Settings.

---

## 🔒 Privacy & Data Safety

- **100% Offline & Private**: No data is sent over the internet or to third-party servers. All streaks, motivations, and reflections live exclusively in your iPhone's browser storage.
- **Zero Internet Exposure**: The local server only listens on your private home Wi-Fi network (`192.168.x.x` or `10.x.x.x`).
- **Safe Code Updates**: When you pull new updates from GitHub (`git pull`), your existing streaks and logs remain 100% untouched.

---

## 📁 Repository Structure

| File / Folder | Purpose |
| :--- | :--- |
| [`start.bat`](start.bat) | Windows 1-click launcher (auto-detects Node.js or Python) |
| [`start.sh`](start.sh) | macOS & Linux 1-click launcher |
| [`server.js`](server.js) | Zero-dependency Node.js server with auto-IP detection & `/api/info` |
| [`index.html`](index.html) | PWA markup, iOS meta tags, and Claude AI overlay modals |
| [`css/styles.css`](css/styles.css) | Claude AI design system, warm oatmeal/charcoal palette, iOS safe areas |
| [`js/app.js`](js/app.js) | Ticker engine, tabs, modals, Urge SOS, service worker updates |
| [`js/storage.js`](js/storage.js) | Multi-app store, persistence, motivations, backup/restore |
| [`js/milestones.js`](js/milestones.js) | Milestones definitions & neurochemical recovery stages |
| [`js/qrcode.js`](js/qrcode.js) | Pure standalone SVG QR code generator for instant iPhone scanning |
| [`manifest.webmanifest`](manifest.webmanifest) | PWA configuration for iOS standalone display |
| [`sw.js`](sw.js) | Service worker with offline caching (Safari-safe, redirect-resilient) |
| [`icons/`](icons/) | High-res icons (180x180 Apple touch icon, 192x192, 512x512, SVG) |
